declare module 'nuxt/schema' {
  interface PublicRuntimeConfig {
    r2AccountId: string;
    r2BucketName: string;
    r2AccessKey: string;
    r2SecretKey: string;
  }
}
// It is always important to ensure you import/export something when augmenting a type
export {};
