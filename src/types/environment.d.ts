export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ENV: 'dev' | 'prod';
      PORT: string;
      BASEPATH:string;
      DBNAME: string;

    }
  }
}