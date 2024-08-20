import type { TestStep } from '~~/types/zephyrs/TestStep';

export interface TestExecutionStore {
  jiraItems: {
    id: number; // auto increment
    title: string; // issue 번호
    url: string;
    init: boolean; // 서버 데이터 받아옴 여부
    testSteps: TestStep[];
  }[];
  newId: number;
}

export const useTestExecutionStore = defineStore('testExecutionStore', {
  state: (): TestExecutionStore => ({
    jiraItems: [],
    newId: 1
  }),
  actions: {
    addInitJiraItem(title: string, url: string) {
      this.jiraItems.push({ id: this.newId++, title, url, init: false, testSteps: [] });
    },
    addJiraItem(title: string, url: string, testSteps: TestStep[]) {
      this.jiraItems.push({ id: this.newId++, title, url, testSteps });
    },
    modifyJiraItem(id: number, title: string, url: string, testSteps: TestStep[]) {
      const index = this.jiraItems.findIndex((item) => item.id === id);
      if (index === -1) {
        console.error('modifyJiraItem: invalid id');
      }

      this.jiraItems[index] = { id, title, url, init: true, testSteps };
    },
    removeJiraItem(id: number) {
      this.jiraItems = this.jiraItems.filter((item) => item.id !== id);
    }
  }
});
