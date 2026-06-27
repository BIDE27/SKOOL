import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { Platform } from 'react-native';
import { useRouter, useSegments } from 'expo-router';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  role: string | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  role: null,
  isLoading: true,
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserRole(session.user);
      } else {
        setIsLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchUserRole(session.user);
        } else {
          setRole(null);
          setIsLoading(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserRole = async (userObj: User) => {
    try {
      if (userObj.user_metadata && userObj.user_metadata.role) {
        setRole(userObj.user_metadata.role);
      } else {
        // Fallback if metadata is missing
        const { data, error } = await supabase
          .from('users')
          .select('role')
          .eq('id', userObj.id)
          .single();
          
        if (data && !error) {
          setRole(data.role);
        } else {
          setRole(null);
        }
      }
    } catch (e) {
      console.error(e);
      setRole(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!session && !inAuthGroup) {
      // Redirect to login
      router.replace('/');
    } else if (session && role) {
      // Prevent routing if we are already in the correct group
      const currentGroup = segments[0];
      const targetGroup = `(${role})`;
      
      // If we're at the root login or in wrong group
      if (!currentGroup || (currentGroup !== targetGroup && currentGroup !== '(auth)')) {
        // We route to the specific role dashboard
        router.replace(`/${targetGroup}` as any);
      }
    }
  }, [session, role, isLoading, segments]);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.error(e);
    } finally {
      setSession(null);
      setRole(null);
      setUser(null);
      if (Platform.OS === 'web') {
        window.location.reload();
      } else {
        router.replace('/');
      }
    }
  };

  return (
    <AuthContext.Provider value={{ session, user, role, isLoading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
