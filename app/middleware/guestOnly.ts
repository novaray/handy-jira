import { JIRA_ACCOUNT_ID_NAME, JIRA_API_COOKIE_NAME, ZEPHYR_API_COOKIE_NAME } from '~~/constants/cookieName';

export default defineNuxtRouteMiddleware((to, from) => {
  const accountId = useCookie(JIRA_ACCOUNT_ID_NAME);
  const jiraApiKey = useCookie(JIRA_API_COOKIE_NAME);
  const zephyrApiKey = useCookie(ZEPHYR_API_COOKIE_NAME);

  if (accountId.value && jiraApiKey.value && zephyrApiKey.value) {
    return navigateTo('/');
  }
});
