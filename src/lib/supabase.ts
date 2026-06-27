import 'react-native-url-polyfill/auto';
import * as SecureStore from 'expo-secure-store';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

const ExpoSecureStoreAdapter = {
  getItem: (key: string) => {
    return SecureStore.getItemAsync(key);
  },
  setItem: (key: string, value: string) => {
    SecureStore.setItemAsync(key, value);
  },
  removeItem: (key: string) => {
    SecureStore.deleteItemAsync(key);
  },
};

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

// Handle web SSR explicitly for Expo Router
const isWebSSR = Platform.OS === 'web' && typeof window === 'undefined';

// Use localStorage for web, SecureStore for Native (Expo Go compatible)
let storage;
if (isWebSSR) {
  storage = undefined;
} else if (Platform.OS === 'web') {
  storage = localStorage;
} else {
  storage = ExpoSecureStoreAdapter;
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: storage as any,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
