/**
 * Cliente Firebase compartilhado pelo site.
 *
 * Fica "desligado" (todas as exportações null / firebaseReady = false)
 * até que FIREBASE_CONFIG em src/data/content.js seja preenchido — assim
 * o resto do app pode checar `firebaseReady` e cair num estado seguro
 * (aviso "não configurado") em vez de quebrar.
 */
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { FIREBASE_CONFIG, FIREBASE_CONFIGURED } from "../data/content";

export const firebaseReady = FIREBASE_CONFIGURED;

let app = null;
if (firebaseReady) {
  app = getApps().length > 0 ? getApps()[0] : initializeApp(FIREBASE_CONFIG);
}

export const db = firebaseReady ? getFirestore(app) : null;
export const storage = firebaseReady ? getStorage(app) : null;
