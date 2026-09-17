// Inicialização do Firebase — ponto central de conexão com todos os serviços
// A config do Firebase é pública por design (ela vai no bundle que o navegador
// baixa); quem protege os dados são as regras do Firestore/Auth.
//
// Os valores vêm do ambiente quando existem. O fallback abaixo é uma ponte
// TEMPORÁRIA: sem ele o site sai do ar enquanto as variáveis não estiverem
// cadastradas na Vercel. Depois de cadastrar as seis VITE_FIREBASE_* lá,
// apague o objeto `padrao` e deixe só o import.meta.env. Veja .env.example.

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const padrao = {
  apiKey: "AIzaSyDdIsYHm-8IUgITDMlcECdJ8DpMhd6PaVw",
  authDomain: "otica-roland.firebaseapp.com",
  projectId: "otica-roland",
  storageBucket: "otica-roland.firebasestorage.app",
  messagingSenderId: "495598030535",
  appId: "1:495598030535:web:bf802d54659852e50bf8e2",
};

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? padrao.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? padrao.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? padrao.projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? padrao.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? padrao.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID ?? padrao.appId,
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
