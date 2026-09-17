// Inicialização do Firebase — ponto central de conexão com todos os serviços
// A config do Firebase é pública por design (ela vai no bundle); a segurança
// fica nas regras do Firestore/Auth. Mesmo assim os valores vêm do ambiente,
// para o repositório não carregar credencial de projeto e para dar/tirar
// ambiente sem editar código. Veja .env.example.

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  throw new Error(
    'Firebase não configurado: faltam as variáveis VITE_FIREBASE_* no ambiente. ' +
    'Copie .env.example para .env.local e preencha, ou cadastre-as na Vercel.'
  );
}

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
