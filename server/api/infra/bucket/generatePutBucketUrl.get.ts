import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export default defineEventHandler(async (event) => {
  const { key } = getQuery(event);
  if (!key) {
    throw createError({
      statusCode: 400,
      statusMessage: 'PARAMETER_MISSING'
    });
  }

  const { r2BucketName } = useRuntimeConfig(event).public;
  console.log('generatePutBucketUrl', r2BucketName, process.env.R2_BUCKET_NAME);
  const s3Client = generateS3Client(event);

  const params = {
    Bucket: r2BucketName ?? process.env.R2_BUCKET_NAME,
    Key: key as string
  };

  try {
    const command = new PutObjectCommand(params);
    const signedUrl = await getSignedUrl(s3Client, command); // expires default 900s(15m)
    return {
      url: signedUrl
    };
  } catch (e) {
    console.dir(e);
    console.error(e);
    throw createError({
      statusCode: 500,
      statusMessage: 'S3_ERROR'
    });
  }
});
