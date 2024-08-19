import { JIRA_BASE_URL } from '~~/constants/baseUrl';
import { JiraMySelf } from '~~/types/jira/mySelf';
import {
  JIRA_ACCOUNT_ID_NAME,
  JIRA_API_COOKIE_NAME,
  ZEPHYR_ACCESS_API_COOKIE_NAME,
  ZEPHYR_SHARED_API_COOKIE_NAME
} from '~~/constants/cookieName';
import { H3Event } from 'h3';

export default defineEventHandler((event) => {
  const query = getQuery(event);

  if (!query || !query.email || !query.jira || !query.zephyrAccess || !query.zephyrShared) {
    throw createError({
      statusCode: 400,
      statusMessage: 'PARAMETER_MISSING'
    });
  }

  return $fetch<JiraMySelf>(`${JIRA_BASE_URL}/myself`, {
    headers: {
      Authorization: `Basic ${Buffer.from(`${query.email}:${query.jira}`).toString('base64')}`,
      Accept: 'application/json'
    }
  }).then((response) => {
    setCookieMaximum(event, JIRA_ACCOUNT_ID_NAME, response.accountId);
    setCookieMaximum(event, JIRA_API_COOKIE_NAME, query.jira as string);
    setCookieMaximum(event, ZEPHYR_ACCESS_API_COOKIE_NAME, query.zephyrAccess as string);
    setCookieMaximum(event, ZEPHYR_SHARED_API_COOKIE_NAME, query.zephyrShared as string);
    return response;
  });
});

const setCookieMaximum = (event: H3Event, name: string, value: string) => {
  setCookie(event, name, value, {
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 400), // 400일이 최대(https://chromestatus.com/feature/4887741241229312)
    sameSite: 'strict',
    secure: true
  });
};
