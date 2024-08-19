import { ZEPHYR_BASE_URL } from '~~/constants/baseUrl';
import { TestStep } from '~~/types/zephyrs/TestStep';
import { ZEPHYR_ACCESS_API_COOKIE_NAME } from '~~/constants/cookieName';

export default defineEventHandler((event) => {
  const query = getQuery(event);
  const accessKey = getCookie(event, ZEPHYR_ACCESS_API_COOKIE_NAME);

  if (!query || !query.issueId || !query.projectId) {
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

  const { method, relativePath, querystring } = ZephyrAPISet.getAllTestSteps({
    issueId: query.issueId as string,
    projectId: query.projectId as string
  });

  const jwt = generateZephyrJWT(event, method, relativePath, querystring);

  return $fetch<TestStep[]>(`${ZEPHYR_BASE_URL}${relativePath}?${querystring}`, {
    headers: {
      Authorization: `JWT ${jwt}`,
      zapiAccessKey: accessKey
    }
  });
});
