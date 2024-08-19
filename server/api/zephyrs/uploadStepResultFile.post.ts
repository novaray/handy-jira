import { ZEPHYR_BASE_URL } from '~~/constants/baseUrl';
import { ZEPHYR_ACCESS_API_COOKIE_NAME } from '~~/constants/cookieName';
import type { UploadStepResultFileResponse } from '~~/types/zephyrs/UploadStepResultFile';

export default defineEventHandler((event) => {
  const query = getQuery(event);
  const accessKey = getCookie(event, ZEPHYR_ACCESS_API_COOKIE_NAME);

  if (
    !query ||
    !query.entityId ||
    !query.projectId ||
    !query.issueId ||
    !query.cycleId ||
    !query.versionId ||
    !query.executionId
  ) {
    throw createError({
      statusCode: 400,
      statusMessage: 'CHECK_URL'
    });
  } else if (!accessKey) {
    throw createError({
      statusCode: 400,
      statusMessage: 'PLEASE_LOGIN'
    });
  }

  const { method, relativePath, querystring } = ZephyrAPISet.getUploadStepResultFile({
    entityId: query.entityId as string,
    executionId: query.executionId as string,
    projectId: +query.projectId,
    issueId: +query.issueId,
    cycleId: query.cycleId as string,
    versionId: +query.versionId
  });

  const jwt = generateZephyrJWT(event, method, relativePath, querystring);

  return $fetch<UploadStepResultFileResponse>(`${ZEPHYR_BASE_URL}${relativePath}?${querystring}`, {
    headers: {
      Authorization: `JWT ${jwt}`,
      zapiAccessKey: accessKey
    }
  });
});
