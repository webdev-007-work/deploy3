
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

// Extend User type to include profile data
interface ExtendedUser extends User {
  name?: string;
  avatar?: string;
}

interface AuthContextType {
  user: ExtendedUser | null;
  session: Session | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  // Add aliases for backward compatibility
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name?: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Memoize auth state to prevent unnecessary re-renders
  const isAuthenticated = Boolean(session);
  const isAdmin = Boolean(user?.email === 'admin@gmail.com');

  // Memoize auth functions to prevent re-creation on every render
  const signIn = useCallback(async (email: string, password: string) => {
    console.log('[Auth] Signing in user:', email);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    console.log('[Auth] Signing up user:', email);
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl
      }
    });
    return { error };
  }, []);

  const signOut = useCallback(async () => {
    console.log('[Auth] Signing out user');
    await supabase.auth.signOut();
  }, []);

  // Add compatibility functions
  const login = useCallback(async (email: string, password: string) => {
    const { error } = await signIn(email, password);
    if (error) {
      console.error('Login error:', error);
      return false;
    }
    return true;
  }, [signIn]);

  const register = useCallback(async (email: string, password: string, name?: string) => {
    const { error } = await signUp(email, password);
    if (error) {
      console.error('Registration error:', error);
      return false;
    }
    return true;
  }, [signUp]);

  const logout = useCallback(async () => {
    await signOut();
  }, [signOut]);

  useEffect(() => {
    console.log('[Auth] Initializing auth...');
    
    let mounted = true;

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!mounted) return;
        
        console.log('[Auth] Auth state changed:', event);
        
        // Only update state if session actually changed
        setSession(prevSession => {
          if (prevSession?.access_token !== session?.access_token) {
            return session;
          }
          return prevSession;
        });
        
        setUser(prevUser => {
          const newUser = session?.user ?? null;
          if (newUser && prevUser?.id !== newUser?.id) {
            // Extend user with profile data if available
            const extendedUser: ExtendedUser = {
              ...newUser,
              name: newUser.user_metadata?.name || newUser.email?.split('@')[0] || 'User',
              avatar: newUser.user_metadata?.avatar || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face`
            };
            return extendedUser;
          }
          return newUser;
        });
        
        if (mounted && isLoading) {
          setIsLoading(false);
        }
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      
      setSession(session);
      if (session?.user) {
        const extendedUser: ExtendedUser = {
          ...session.user,
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
          avatar: session.user.user_metadata?.avatar || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face`
        };
        setUser(extendedUser);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []); // Empty dependency array to prevent re-running

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = React.useMemo(() => ({
    user,
    session,
    isAuthenticated,
    isAdmin,
    isLoading,
    signIn,
    signUp,
    signOut,
    login,
    register,
    logout,
  }), [user, session, isAuthenticated, isAdmin, isLoading, signIn, signUp, signOut, login, register, logout]);

  return (
    <AuthContext.Provider value={contextValue}>
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
