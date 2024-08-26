import type { TestStep } from '~~/types/zephyrs/TestStep';
import type { StepResult } from '~~/types/zephyrs/StepResult';
import type { Execution } from '~~/types/zephyrs/Execution';

export interface TestExecutionStore {
  jiraItems: JiraItem[];
  newId: number;
}

export interface JiraItem {
  id: number;
  title: string;
  url: string;
  issueId: number;
  projectId: number;
  executionId: string;
  cycleId: string;
  versionId: number;
  init: boolean;
  testSteps: ClientTestStep[];
  stepResults: StepResult[];
}

interface ClientTestStep extends TestStep {
  displayFileCount: number;
}

export const useTestExecutionStore = defineStore('testExecutionStore', {
  state: (): TestExecutionStore => ({
    jiraItems: [],
    newId: 1
  }),
  getters: {
    getJiraItemById: (state) => (id: number) => {
      if (state.jiraItems.length === 0 || state.jiraItems.every((item) => item.id !== id)) {
        return null;
      }

      return state.jiraItems.find((item) => item.id === id) as JiraItem;
    },
    getStepResult:
      (state) =>
      (id: number, stepId: string): null | StepResult => {
        if (state.jiraItems.length === 0 || state.jiraItems.every((item) => item.id !== id)) {
          return null;
        }

        // prettier-ignore
        return state.jiraItems
                  .find((item) => item.id === id)?.stepResults
                  .find((step) => step.stepId === stepId) ?? null;
      }
  },
  actions: {
    addInitJiraItem(title: string, url: string) {
      this.jiraItems.push({
        id: this.newId++,
        title,
        url,
        issueId: 0,
        projectId: 0,
        executionId: '',
        cycleId: '',
        versionId: 0,
        init: false,
        testSteps: [],
        stepResults: []
      });
      return this.newId - 1;
    },
    modifyJiraItem(id: number, testSteps: TestStep[], execution: Execution) {
      const index = this.jiraItems.findIndex((item) => item.id === id);
      if (index === -1) {
        console.error('modifyJiraItem: invalid id');
        throw new Error('invalid id. not found jira item');
      }

      const clientTestSteps = testSteps.map((step) => ({
        ...step,
        displayFileCount: 1
      }));

      this.jiraItems[index]! = {
        ...this.jiraItems[index]!,
        init: true,
        testSteps: clientTestSteps,
        issueId: execution.issueId,
        projectId: execution.projectId,
        executionId: execution.id,
        cycleId: execution.cycleId,
        versionId: execution.versionId
      };
    },
    removeJiraItem(id: number) {
      this.jiraItems = this.jiraItems.filter((item) => item.id !== id);
    },
    setStepResults(id: number, stepResults: StepResult[]) {
      const index = this.jiraItems.findIndex((item) => item.id === id);
      if (index === -1) {
        console.error('addStepResults: invalid id');
        throw new Error('invalid id. not found jira item');
      }

      // stepResults의 stepId가 testSteps의 id와 일치하는지로 검사할 것.
      // testSteps와 stepResults가 서로 인덱스로 매칭이 안 되는 것을 확인(아마 거꾸로 들어오는 듯..?).
      this.jiraItems[index]!.stepResults = stepResults;
    },
    resetDisplayFileCount(id: number) {
      const index = this.jiraItems.findIndex((item) => item.id === id);
      if (index === -1) {
        // ignore
        return;
      }

      this.jiraItems[index]!.testSteps.forEach((step) => {
        step.displayFileCount = 1;
      });
    }
  }
});
