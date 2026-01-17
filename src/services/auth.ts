import { supabase, isWeb } from '../lib/supabase';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';

// 네이티브에서만 WebBrowser 세션 완료 처리
if (!isWeb) {
  WebBrowser.maybeCompleteAuthSession();
}

export interface SignUpParams {
  email: string;
  password: string;
  name: string;
}

export interface SignInParams {
  email: string;
  password: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  weight: number | null;
  height: number | null;
  created_at: string;
}

export type OAuthProvider = 'kakao' | 'google' | 'apple';

export const authService = {
  async signUp({ email, password, name }: SignUpParams) {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      // Supabase 에러 메시지 한글화
      if (authError.message.includes('already registered')) {
        throw new Error('이미 가입된 이메일입니다');
      }
      if (authError.message.includes('invalid')) {
        throw new Error('올바른 이메일 형식이 아닙니다');
      }
      if (authError.message.includes('Password')) {
        throw new Error('비밀번호는 6자 이상이어야 합니다');
      }
      throw new Error(authError.message || '회원가입에 실패했습니다');
    }
    
    if (!authData.user) throw new Error('회원가입에 실패했습니다');

    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        email,
        name,
      });

    if (profileError) {
      console.error('Profile creation error:', profileError);
      // 프로필 생성 실패해도 회원가입은 성공으로 처리 (나중에 생성 가능)
    }

    return authData;
  },

  async signIn({ email, password }: SignInParams) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  },

  async signInWithOAuth(provider: OAuthProvider) {
    if (isWeb) {
      // 웹: 현재 URL로 리다이렉트 (Supabase가 URL 파라미터에서 세션 자동 감지)
      const redirectUrl = window.location.origin;
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: redirectUrl,
          // 웹에서는 브라우저 리다이렉트 허용
          skipBrowserRedirect: false,
        },
      });

      if (error) throw error;
      
      // 웹에서는 페이지가 리다이렉트되므로 여기서 반환
      // OAuth 콜백 후 Supabase가 자동으로 세션 설정
      return data;
    } else {
      // 네이티브: WebBrowser를 사용한 인앱 브라우저
      const redirectUrl = Linking.createURL('auth/callback');
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: redirectUrl,
          skipBrowserRedirect: true,
        },
      });

      if (error) throw error;
      if (!data.url) throw new Error('OAuth URL을 가져올 수 없습니다');

      const result = await WebBrowser.openAuthSessionAsync(
        data.url,
        redirectUrl
      );

      if (result.type === 'success') {
        const url = result.url;
        
        let accessToken: string | null = null;
        let refreshToken: string | null = null;

        if (url.includes('#')) {
          const params = url.split('#')[1];
          const urlParams = new URLSearchParams(params);
          accessToken = urlParams.get('access_token');
          refreshToken = urlParams.get('refresh_token');
        }

        if (accessToken && refreshToken) {
          const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (sessionError) throw sessionError;

          // 프로필 자동 생성 (네이티브)
          if (sessionData.user) {
            await this.ensureProfile(sessionData.user);
          }

          return sessionData;
        }
      }

      throw new Error('로그인이 취소되었습니다');
    }
  },

  // OAuth 후 프로필 존재 확인 및 생성
  async ensureProfile(user: { id: string; email?: string; user_metadata?: any }) {
    const existingProfile = await this.getProfile(user.id);
    if (!existingProfile) {
      // 카카오: nickname, 구글: name 또는 full_name
      const name = user.user_metadata?.nickname 
        || user.user_metadata?.name 
        || user.user_metadata?.full_name 
        || null;
      
      await supabase.from('profiles').insert({
        id: user.id,
        email: user.email || '',
        name,
      });
    }
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  },

  async getProfile(userId: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data;
  },

  async updateProfile(userId: string, updates: Partial<Pick<UserProfile, 'name' | 'weight' | 'height'>>) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data as UserProfile;
  },

  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  },
};
