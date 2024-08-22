import { Notify } from 'quasar';

export const useHandleError = (error: any) => {
  const { $i18n } = useNuxtApp(); // composable인 useI18n을 사용하면 에러 발생.
  console.error(error);
  if (error.data && error.data.data && error.data.data.clientMessage) {
    // zephyrs api error
    Notify.create({
      message: `${error.status}  - ${error.data.data.clientMessage}`,
      type: 'negative'
    });
    return;
  } else if (error.data && error.data.data) {
    // jira api error
    Notify.create({
      message: `${error.status}  - ${error.data.data}`,
      type: 'negative'
    });
    return;
  } else if (error.data && error.data.statusMessage) {
    // server api error
    Notify.create({
      message: $i18n.t(`errorMessage.${error.data.statusMessage}`),
      type: 'negative'
    });
    return;
  }

  // client error
  if (error.message.split(' ').length === 1) {
    // 다국어 에러
    Notify.create({
      message: $i18n.t(`errorMessage.${error.message}`),
      type: 'warning'
    });
  } else {
    // 일반 메시지 에러
    Notify.create({
      message: error.message,
      type: 'warning'
    });
  }
};
