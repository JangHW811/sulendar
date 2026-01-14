import { supabase } from '../lib/supabase';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';

WebBrowser.maybeCompleteAuthSession();

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

    if (authError) throw authError;
    if (!authData.user) throw new Error('회원가입에 실패했습니다');

    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        email,
        name,
      });

    if (profileError) throw profileError;

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
    const redirectUrl = 'https://spaieqwgqpaxmhmkvdqp.supabase.co/auth/v1/callback';
    
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

        if (sessionData.user) {
          const existingProfile = await this.getProfile(sessionData.user.id);
          if (!existingProfile) {
            await supabase.from('profiles').insert({
              id: sessionData.user.id,
              email: sessionData.user.email || '',
              name: sessionData.user.user_metadata?.name || sessionData.user.user_metadata?.full_name || null,
            });
          }
        }

        return sessionData;
      }
    }

    throw new Error('로그인이 취소되었습니다');
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
