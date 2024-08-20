import {
  JIRA_ACCOUNT_ID_NAME,
  JIRA_API_COOKIE_NAME,
  ZEPHYR_ACCESS_API_COOKIE_NAME,
  ZEPHYR_SHARED_API_COOKIE_NAME
} from '~~/constants/cookieName';

export const useAuthCookies = () => {
  const accountCookie = useCookie(JIRA_ACCOUNT_ID_NAME);
  const jiraCookie = useCookie(JIRA_API_COOKIE_NAME);
  const zephyrAccessCookie = useCookie(ZEPHYR_ACCESS_API_COOKIE_NAME);
  const zephyrSharedCookie = useCookie(ZEPHYR_SHARED_API_COOKIE_NAME);

  const isAuthenticated = computed(
    () => !!accountCookie.value && !!jiraCookie.value && !!zephyrAccessCookie.value && !!zephyrSharedCookie.value
  );

  const refreshAuthCookies = () => {
    refreshCookie(JIRA_ACCOUNT_ID_NAME);
    refreshCookie(JIRA_API_COOKIE_NAME);
    refreshCookie(ZEPHYR_ACCESS_API_COOKIE_NAME);
    refreshCookie(ZEPHYR_SHARED_API_COOKIE_NAME);
  };

  const deleteAuthCookies = () => {
    accountCookie.value = '';
    jiraCookie.value = '';
    zephyrAccessCookie.value = '';
    zephyrSharedCookie.value = '';
  };

  return {
    accountCookie,
    jiraCookie,
    zephyrAccessCookie,
    zephyrSharedCookie,
    isAuthenticated,
    refreshAuthCookies,
    deleteAuthCookies
  };
};
