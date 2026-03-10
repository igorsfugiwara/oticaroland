import { useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '../config/firebase';

// "lingao" → "lingao@admin.oticaroland.com"
// Crie esse usuário em: Firebase Console → Authentication → Users → Add user
const toEmail = (username: string) => `${username.toLowerCase().trim()}@admin.oticaroland.com`;

export type AuthState = {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
};

export function useAuthHook(): AuthState {
  const [authUser, setAuthUser] = useState<boolean | null>(null); // null = carregando

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, user => {
      setAuthUser(!!user);
    });
    return unsub;
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      await signInWithEmailAndPassword(auth, toEmail(username), password);
      return true;
    } catch {
      return false;
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  return {
    isAuthenticated: authUser === true,
    isLoading: authUser === null,
    login,
    logout,
  };
}
