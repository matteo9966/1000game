export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ENV: 'dev' | 'prod';
      PORT: string;
      BASEPATH:string;
      DBNAME: string;
      PRIVATEKEY:string;
      PUBLICKEY:string;

    }
  }
}