export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ENV: 'dev' | 'prod'|'test';
      PORT: string;
      BASEPATH:string;
      DBNAME: string;
      PRIVATEKEY:string;
      PUBLICKEY:string;
      FIRESTORE_EMULATOR_HOST:string;
      FIREBASE_CONFIG:string;

    }
  }
}