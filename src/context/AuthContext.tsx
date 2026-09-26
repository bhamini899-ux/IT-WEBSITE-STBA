import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { initAuth, googleSignIn, logout as authLogout, getAccessToken } from '../lib/auth';
import { getGmailUserProfile, GmailUserProfile } from '../services/gmailNotificationService';

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  gmailProfile: GmailUserProfile | null;
  isLoading: boolean;
  isConnecting: boolean;
  error: string | null;
  login: () => Promise<boolean>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [gmailProfile, setGmailProfile] = useState<GmailUserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = initAuth(
      async (authUser, token) => {
        setUser(authUser);
        setAccessToken(token);
        if (token) {
          try {
            const profile = await getGmailUserProfile(token);
            setGmailProfile(profile);
          } catch (err: any) {
            console.warn('Could not load Gmail profile on init:', err.message);
          }
        }
        setIsLoading(false);
      },
      () => {
        setUser(null);
        setAccessToken(null);
        setGmailProfile(null);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const login = async (): Promise<boolean> => {
    setIsConnecting(true);
    setError(null);
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        setAccessToken(result.accessToken);
        try {
          const profile = await getGmailUserProfile(result.accessToken);
          setGmailProfile(profile);
        } catch (profileErr: any) {
          console.warn('Profile fetch after login warning:', profileErr.message);
        }
        return true;
      }
      return false;
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to sign in with Google');
      return false;
    } finally {
      setIsConnecting(false);
    }
  };

  const logout = async () => {
    try {
      await authLogout();
      setUser(null);
      setAccessToken(null);
      setGmailProfile(null);
    } catch (err: any) {
      console.error('Logout error:', err);
    }
  };

  const refreshProfile = async () => {
    const token = accessToken || getAccessToken();
    if (token) {
      try {
        const profile = await getGmailUserProfile(token);
        setGmailProfile(profile);
      } catch (err: any) {
        console.error('Error refreshing Gmail profile:', err);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        gmailProfile,
        isLoading,
        isConnecting,
        error,
        login,
        logout,
        refreshProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
