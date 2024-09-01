import { ZEPHYR_BASE_URL } from '~~/constants/baseUrl';
import { ZEPHYR_ACCESS_API_COOKIE_NAME } from '~~/constants/cookieName';
import type { StepResults } from '~~/types/zephyrs/StepResult';

export default defineEventHandler((event) => {
  const query = getQuery(event);
  const accessKey = getCookie(event, ZEPHYR_ACCESS_API_COOKIE_NAME);

  if (!query || !query.issueId || !query.executionId) {
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

  const { method, relativePath, querystring } = ZephyrAPISet.getStepResultsByExecution({
    issueId: query.issueId as string,
    executionId: query.executionId as string
  });

  const jwt = generateZephyrJWT(event, method, relativePath, querystring);

  return $fetch<StepResults>(`${ZEPHYR_BASE_URL}${relativePath}?${querystring}`, {
    headers: {
      Authorization: `JWT ${jwt}`,
      zapiAccessKey: accessKey
    }
  });
});
