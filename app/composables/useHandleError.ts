import { Notify } from 'quasar';
import type { ComposerTranslation } from 'vue-i18n';

export const useHandleError = (error: any) => {
  if (!error) {
    // ignore
    return;
  }

  const { $i18n } = useNuxtApp(); // composable인 useI18n을 사용하면 에러 발생.
  console.error(error);

  if (error.data instanceof Blob) {
    const reader = new FileReader();
    reader.onload = () => {
      const result = JSON.parse(reader.result as string);
      Notify.create({
        message: getMessage(result.statusMessage, $i18n.t),
        color: 'negative'
      });
    };
    reader.readAsText(error.data);
    return;
  }

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
  Notify.create({
    message: getMessage(error.message, $i18n.t),
    type: 'warning'
  });
};

const getMessage = (message: string, t: ComposerTranslation) => {
  return message.split(' ').length === 1 ? t(`errorMessage.${message}`) : message;
};
