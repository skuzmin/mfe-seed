declare module '*.scss?inline' {
  const content: string;
  export default content;
}

/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_APP_VERSION: string;
  readonly VITE_BACKEND_URL: string;
  readonly VITE_FRONTEND_URL: string;
  readonly VITE_ENV: string;
  readonly VITE_MFE_NAME: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare const __COMMIT_HASH__: string;
declare const __BUILT_AT__: number;
