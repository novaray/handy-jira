export const getBucketSignedUrl = (fileName: string, isGet: boolean = true) => {
  return $fetch<{
    url: string;
  }>(`/api/infra/bucket/generate${isGet ? 'Get' : 'Put'}BucketUrl`, {
    method: 'GET',
    query: {
      key: fileName
    }
  });
};
