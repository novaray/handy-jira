import type { H3Event } from 'h3';
import { S3Client } from '@aws-sdk/client-s3';

export const generateS3Client = (event: H3Event) => {
  const { r2AccountId, r2AccessKey, r2SecretKey } = useRuntimeConfig(event).public;
  console.log(
    'generateS3Client',
    r2AccountId,
    process.env.R2_ACCOUNT_ID,
    r2AccessKey,
    process.env.R2_ACCESS_KEY,
    r2SecretKey,
    process.env.R2_SECRET_KEY
  );

  return new S3Client({
    endpoint: `https://${r2AccountId ?? process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    region: 'auto',
    credentials: {
      accessKeyId: r2AccessKey ?? process.env.R2_ACCESS_KEY,
      secretAccessKey: r2SecretKey ?? process.env.R2_SECRET_KEY
    }
  });
};
