import type { H3Event } from 'h3';
import { S3Client } from '@aws-sdk/client-s3';

export const generateS3Client = (event: H3Event) => {
  const { r2AccountId, r2AccessKey, r2SecretKey } = useRuntimeConfig(event);
  console.log('generateS3Client', r2AccountId, r2AccessKey, r2SecretKey);

  return new S3Client({
    endpoint: `https://${r2AccountId}.r2.cloudflarestorage.com`,
    region: 'auto',
    credentials: {
      accessKeyId: r2AccessKey,
      secretAccessKey: r2SecretKey
    }
  });
};
