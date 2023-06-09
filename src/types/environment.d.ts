export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ENV: 'dev' | 'prod';
      PORT: number;
      BASEPATH:string;
      DBNAME: string;

    }
  }
}