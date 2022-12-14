interface ImportMetaEnv {
  readonly GOOGLE_OAUTH_CLIENT_ID: string;
  readonly GOOGLE_OAUTH_CLIENT_SECRET: string;

  readonly ENV?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
