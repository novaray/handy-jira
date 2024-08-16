import { JIRA_ACCOUNT_ID_NAME, JIRA_API_COOKIE_NAME, ZEPHYR_ACCESS_API_COOKIE_NAME } from '~~/constants/cookieName';

export default defineEventHandler((event) => {
  deleteCookie(event, JIRA_ACCOUNT_ID_NAME);
  deleteCookie(event, JIRA_API_COOKIE_NAME);
  deleteCookie(event, ZEPHYR_ACCESS_API_COOKIE_NAME);
});
