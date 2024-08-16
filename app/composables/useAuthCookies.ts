import { JIRA_ACCOUNT_ID_NAME, JIRA_API_COOKIE_NAME, ZEPHYR_API_COOKIE_NAME } from '~~/constants/cookieName';

export const useAuthCookies = () => {
  const accountCookie = useCookie(JIRA_ACCOUNT_ID_NAME);
  const jiraCookie = useCookie(JIRA_API_COOKIE_NAME);
  const zephyrCookie = useCookie(ZEPHYR_API_COOKIE_NAME);

  const refreshAuthCookies = () => {
    refreshCookie(JIRA_ACCOUNT_ID_NAME);
    refreshCookie(JIRA_API_COOKIE_NAME);
    refreshCookie(ZEPHYR_API_COOKIE_NAME);
  };

  const deleteAuthCookies = () => {
    accountCookie.value = '';
    jiraCookie.value = '';
    zephyrCookie.value = '';
  };

  return {
    accountCookie,
    jiraCookie,
    zephyrCookie,
    refreshAuthCookies,
    deleteAuthCookies
  };
};
