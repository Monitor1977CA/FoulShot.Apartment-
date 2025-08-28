/// <reference types="vite/client" />

// Add Vite env typings so `import.meta.env.VITE_API_KEY` is recognized by TypeScript.
interface ImportMetaEnv {
  readonly VITE_API_KEY?: string;
  // add other VITE_ env vars here as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
