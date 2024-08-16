import {
  JIRA_ACCOUNT_ID_NAME,
  JIRA_API_COOKIE_NAME,
  ZEPHYR_ACCESS_API_COOKIE_NAME,
  ZEPHYR_SHARED_API_COOKIE_NAME
} from '~~/constants/cookieName';

export default defineNuxtRouteMiddleware((to, from) => {
  const accountId = useCookie(JIRA_ACCOUNT_ID_NAME);
  const jiraApiKey = useCookie(JIRA_API_COOKIE_NAME);
  const zephyrAccessApiKey = useCookie(ZEPHYR_ACCESS_API_COOKIE_NAME);
  const zephyrSharedApiKey = useCookie(ZEPHYR_SHARED_API_COOKIE_NAME);

  if (accountId.value && jiraApiKey.value && zephyrAccessApiKey.value && zephyrSharedApiKey.value) {
    return navigateTo('/');
  }
});
