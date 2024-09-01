import { ZEPHYR_BASE_URL } from '~~/constants/baseUrl';
import { ZEPHYR_ACCESS_API_COOKIE_NAME } from '~~/constants/cookieName';
import type { UploadStepResultFileResponse } from '~~/types/zephyrs/UploadStepResultFile';
import { Blob } from 'buffer';
import { FILE_LIMIT_SIZE } from '~~/constants/common';

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

  const file = form.find((file) => file.filename);
  if (!file) {
    throw createError({
      statusCode: 400,
      statusMessage: 'NO_FILE_UPLOADED'
    });
  } else if (file.data.length > FILE_LIMIT_SIZE) {
    throw createError({
      statusCode: 400,
      statusMessage: 'FILE_SIZE_EX'
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

  sendForm.append('attachmentFileName', file.filename!);
  sendForm.append('files', new Blob([file.data]) as any, file.filename!);

  return $fetch<UploadStepResultFileResponse>(`${ZEPHYR_BASE_URL}${relativePath}?${querystring}`, {
    method: 'POST',
    headers: {
      Authorization: `JWT ${jwt}`,
      zapiAccessKey: accessKey
    },
    body: sendForm
  });
});
