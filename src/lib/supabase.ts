import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

const supabaseUrl = 'https://spaieqwgqpaxmhmkvdqp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwYWllcXdncXBheG1obWt2ZHFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgzOTQyMDAsImV4cCI6MjA4Mzk3MDIwMH0.rstkMjV-M1lUy5RoB2uWV_w-gRbDac-BJAQxZIsKMaA';

const isWeb = Platform.OS === 'web';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // 웹: localStorage 사용 (기본값), 네이티브: AsyncStorage 사용
    ...(isWeb ? {} : { storage: AsyncStorage }),
    autoRefreshToken: true,
    persistSession: true,
    // 웹: URL에서 세션 감지 (OAuth 콜백), 네이티브: 비활성화
    detectSessionInUrl: isWeb,
  },
});

// 플랫폼 정보 export (다른 곳에서 사용)
export { isWeb };
