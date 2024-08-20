import type { CommonDialog } from '~/stores/dialog/CommonDialog';

export interface ConfirmDialogStore extends CommonDialog {
  message: string;
}

export const useConfirmDialogStore = defineStore('confirmDialog', {
  state: (): ConfirmDialogStore => ({
    visible: false,
    message: '',
    resolve: undefined,
    reject: undefined
  }),
  actions: {
    open(message: string) {
      this.visible = true;
      this.message = message;

      const { promise, resolve, reject } = Promise.withResolvers();
      this.resolve = resolve;
      this.reject = reject;
      return promise;
    },
    confirm() {
      this.visible = false;
      this.resolve?.();
    },
    close() {
      this.visible = false;
      this.reject?.();
    }
  }
});
