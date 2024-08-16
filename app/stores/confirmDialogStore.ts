export interface ConfirmDialogStore {
  visible: boolean;
  message: string;
  resolve?: (value?: any) => void;
  reject?: (value?: any) => void;
}

export const useConfirmDialogStore = defineStore('confirmDialog', {
  state: (): ConfirmDialogStore => ({
    visible: false,
    message: '',
    resolve: undefined, // default 값을 함수 또는 객체로 하면 @nuxt/devalue 에서 stringify 에러 발생.
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
