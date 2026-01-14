import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://spaieqwgqpaxmhmkvdqp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwYWllcXdncXBheG1obWt2ZHFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgzOTQyMDAsImV4cCI6MjA4Mzk3MDIwMH0.rstkMjV-M1lUy5RoB2uWV_w-gRbDac-BJAQxZIsKMaA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
