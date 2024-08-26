import { ZEPHYR_BASE_URL } from '~~/constants/baseUrl';
import { ZEPHYR_ACCESS_API_COOKIE_NAME } from '~~/constants/cookieName';
import type { UploadStepResultFileResponse } from '~~/types/zephyrs/UploadStepResultFile';
import { Blob } from 'buffer';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const form = await readMultipartFormData(event);
  const accessKey = getCookie(event, ZEPHYR_ACCESS_API_COOKIE_NAME);

  if (
    !query ||
    !query.entityId ||
    !query.issueId ||
    !query.projectId ||
    !query.executionId ||
    !query.cycleId ||
    !query.versionId
  ) {
    throw createError({
      statusCode: 400,
      statusMessage: 'PARAMETER_MISSING'
    });
  } else if (!accessKey) {
    throw createError({
      statusCode: 400,
      statusMessage: 'PLEASE_LOGIN'
    });
  } else if (!form || !form.length) {
    throw createError({
      statusCode: 400,
      statusMessage: 'NO_FILE_UPLOADED'
    });
  }

  const videoFile = form.find((file) => file.filename);
  if (!videoFile) {
    throw createError({
      statusCode: 400,
      statusMessage: 'NO_FILE_UPLOADED'
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
  const sendForm = new FormData();

  sendForm.append('attachmentFileName', videoFile.filename!);
  sendForm.append('files', new Blob([videoFile.data]) as any, videoFile.filename!);

  return $fetch<UploadStepResultFileResponse>(`${ZEPHYR_BASE_URL}${relativePath}?${querystring}`, {
    method: 'POST',
    headers: {
      Authorization: `JWT ${jwt}`,
      zapiAccessKey: accessKey
    },
    body: sendForm
  });
});
