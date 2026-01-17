import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { authService, UserProfile, OAuthProvider } from '../services/auth';
import { isWeb } from '../lib/supabase';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithOAuth: (provider: OAuthProvider) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Pick<UserProfile, 'name' | 'weight' | 'height'>>) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const sess = await authService.getSession();
        setSession(sess);
        setUser(sess?.user ?? null);
        if (sess?.user) {
          const prof = await authService.getProfile(sess.user.id);
          setProfile(prof);
        }
      } catch (error) {
        console.error('Auth init error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    const { data: { subscription } } = authService.onAuthStateChange(async (event, sess) => {
      setSession(sess);
      setUser(sess?.user ?? null);
      
      if (sess?.user) {
        try {
          // OAuth 로그인 시 프로필 자동 생성 (웹에서 특히 중요)
          if (event === 'SIGNED_IN') {
            await authService.ensureProfile(sess.user);
          }
          const prof = await authService.getProfile(sess.user.id);
          setProfile(prof);
        } catch (error) {
          console.error('Profile fetch error:', error);
        }
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { session: newSession } = await authService.signIn({ email, password });
    setSession(newSession);
    setUser(newSession?.user ?? null);
    if (newSession?.user) {
      const prof = await authService.getProfile(newSession.user.id);
      setProfile(prof);
    }
  };

  const signInWithOAuth = async (provider: OAuthProvider) => {
    const result = await authService.signInWithOAuth(provider);
    
    // 웹: 페이지가 리다이렉트되므로 여기서 끝 (onAuthStateChange가 처리)
    if (isWeb) {
      return;
    }
    
    // 네이티브: 세션 직접 설정
    if (result && 'session' in result && result.session) {
      setSession(result.session);
      setUser(result.session.user ?? null);
      if (result.session.user) {
        const prof = await authService.getProfile(result.session.user.id);
        setProfile(prof);
      }
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    await authService.signUp({ email, password, name });
  };

  const signOut = async () => {
    await authService.signOut();
    setSession(null);
    setUser(null);
    setProfile(null);
  };

  const updateProfile = async (updates: Partial<Pick<UserProfile, 'name' | 'weight' | 'height'>>) => {
    if (!user) throw new Error('로그인이 필요합니다');
    const updated = await authService.updateProfile(user.id, updates);
    setProfile(updated);
  };

  const refreshProfile = async () => {
    if (!user) return;
    const prof = await authService.getProfile(user.id);
    setProfile(prof);
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        profile,
        isLoading,
        signIn,
        signInWithOAuth,
        signUp,
        signOut,
        updateProfile,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
