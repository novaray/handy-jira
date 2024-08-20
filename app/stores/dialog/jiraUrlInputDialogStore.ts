import type { CommonDialog } from '~/stores/dialog/CommonDialog';

interface JiraUrlInputDialogStore extends CommonDialog {}

export const useJiraUrlInputDialogStore = defineStore('jiraUrlInputDialog', {
  state: (): JiraUrlInputDialogStore => ({
    visible: false,
    resolve: undefined,
    reject: undefined
  }),
  actions: {
    open() {
      this.visible = true;

      const { promise, resolve, reject } = Promise.withResolvers();
      this.resolve = resolve;
      this.reject = reject;
      return promise;
    },
    confirm(url: string) {
      this.visible = false;
      this.resolve?.(url);
    },
    close() {
      this.visible = false;
      this.reject?.();
    }
  }
});
