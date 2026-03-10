import { useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '../config/firebase';

export type AuthState = {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
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

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
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
