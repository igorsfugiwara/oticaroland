// Inicialização do Firebase — ponto central de conexão com todos os serviços
// O firebaseConfig é público por design. A segurança fica nas regras do Firestore/Auth.

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDdIsYHm-8IUgITDMlcECdJ8DpMhd6PaVw",
  authDomain: "otica-roland.firebaseapp.com",
  projectId: "otica-roland",
  storageBucket: "otica-roland.firebasestorage.app",
  messagingSenderId: "495598030535",
  appId: "1:495598030535:web:bf802d54659852e50bf8e2"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
