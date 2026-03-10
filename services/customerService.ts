import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Customer } from '../types';

const COLL = 'customers';

export function subscribeCustomers(cb: (customers: Customer[]) => void): () => void {
  return onSnapshot(collection(db, COLL), snap => {
    cb(snap.docs.map(d => d.data() as Customer));
  });
}

export async function addCustomer(data: Omit<Customer, 'id' | 'createdAt'>): Promise<string> {
  const id = `customer-${Date.now()}`;
  const customer: Customer = { ...data, id, createdAt: new Date().toISOString() };
  await setDoc(doc(db, COLL, id), customer);
  return id;
}

export async function updateCustomer(id: string, updates: Partial<Customer>): Promise<void> {
  await updateDoc(doc(db, COLL, id), updates as Record<string, unknown>);
}

export async function deleteCustomer(id: string): Promise<void> {
  await deleteDoc(doc(db, COLL, id));
}
