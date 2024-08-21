import { Notify } from 'quasar';

export const useHandleError = (error: any) => {
  const { $i18n } = useNuxtApp();
  console.dir(error);
  if (error.data && error.data.data && error.data.data.clientMessage) {
    // zephyrs api error
    Notify.create({
      type: 'negative',
      message: `${error.status}  - ${error.data.data.clientMessage}`
    });
    return;
  } else if (error.data && error.data.data) {
    // jira api error
    Notify.create({
      type: 'negative',
      message: `${error.status}  - ${error.data.data}`
    });
    return;
  } else if (error.data && error.data.statusMessage) {
    // server api error
    Notify.create({
      type: 'negative',
      message: $i18n.t(`errorMessage.${error.data.statusMessage}`)
    });
    return;
  }

  // client error
  if (error.message.split(' ').length === 1) {
    // 다국어 에러
    Notify.create({
      type: 'warning',
      message: $i18n.t(`errorMessage.${error.message}`)
    });
  } else {
    // 일반 메시지 에러
    Notify.create({
      type: 'warning',
      message: error.message
    });
  }
};
