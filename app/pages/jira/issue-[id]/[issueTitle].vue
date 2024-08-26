<script setup lang="ts">
import type { StepResults } from '~~/types/zephyrs/StepResult';
import { NOT_FOUND } from '~~/constants/common';

const DISPLAY_CARD_COUNT = 5;

const testExecutionStore = useTestExecutionStore();
const route = useRoute();

const id = +(route.params.id as string);
const jiraItem = computed(() => testExecutionStore.getJiraItemById(id));
const testSteps = computed(() => jiraItem.value?.testSteps || []);

const fetchTestResults = () => {
  if (!jiraItem.value) {
    console.error('No jira item');
    return;
  }

  if (jiraItem.value.stepResults.length > 0) {
    // 이미 앞서서 탭을 클릭하여 데이터를 가져왔다면 다시 요청하지 않는다.
    return;
  }

  $fetch('/api/zephyrs/stepResults', {
    method: 'GET',
    query: {
      issueId: jiraItem.value.issueId,
      executionId: jiraItem.value.executionId
    }
  })
    .then((response: StepResults) => {
      Notify.create({
        message: 'Step results loaded!',
        type: 'success'
      });

      testExecutionStore.setStepResults(id, response.stepResults);
    })
    .catch(useHandleError);
};
fetchTestResults();

const tab = ref(1);
const tabs = computed(() => {
  return Array.from({ length: testSteps.value.length }, (_, i) => i + 1).reduce((acc: number[][], current, index) => {
    // 현재의 인덱스에서 DISPLAY_CARD_COUNT로 나눈 나머지가 0일 때 새로운 배열을 만들어 추가
    if (index % DISPLAY_CARD_COUNT === 0) {
      acc.push([] as number[]);
    }

    // 마지막 배열에 현재 요소를 추가
    acc[acc.length - 1]!.push(current);
    return acc;
  }, []);
});
const stepsInTab = computed(() =>
  testSteps.value!.filter((_, i) => i >= tab.value - 1 && i < tab.value - 1 + DISPLAY_CARD_COUNT)
);

const getLabel = (tab: number[]) => {
  if (tab.length === 1) {
    return `Step ${tab[0]}`;
  }

  return `Step ${tab[0]} - ${tab[tab.length - 1]}`;
};

const getStepResultId = (stepId: string) => {
  const stepResult = testExecutionStore.getStepResult(jiraItem.value!.id, stepId);
  if (!stepResult) {
    return NOT_FOUND;
  }

  return stepResult.id;
};

onBeforeRouteUpdate(() => testExecutionStore.resetDisplayFileCount(id));
onBeforeRouteLeave(() => testExecutionStore.resetDisplayFileCount(id));
</script>

<template>
  <q-splitter
    :model-value="20"
    horizontal
  >
    <template v-slot:before>
      <q-tabs
        v-model="tab"
        inline-label
        class="bg-blue-grey text-white shadow-2"
      >
        <q-tab
          v-for="tab in tabs"
          :key="tab[0]"
          :name="tab[0]"
          icon="description"
          :label="getLabel(tab)"
        />
      </q-tabs>
    </template>
    <template v-slot:after>
      <q-tab-panels
        v-model="tab"
        animated
        swipeable
        vertical
        transition-prev="jump-up"
        transition-next="jump-up"
      >
        <q-tab-panel
          v-for="tab in tabs"
          :key="tab[0]"
          :name="tab[0]"
        >
          <template
            v-for="(step, index) in stepsInTab"
            :key="step.id"
          >
            <div class="text-h5 text-weight-medium q-mb-md">
              <span class="flex items-center">
                <q-icon
                  name="description"
                  class="q-mr-sm"
                  size="20px"
                  color="primary"
                />
                Step {{ step.orderId }}
              </span>
            </div>
            <div class="text-h6 text-grey q-mb-xs">Test Step</div>
            <div class="q-mb-md break-space">{{ step.step }}</div>
            <div class="text-h6 text-grey q-mb-xs">Data Test</div>
            <div class="q-mb-md break-space">{{ step.data }}</div>
            <div class="text-h6 text-grey q-mb-xs">Test Result</div>
            <div class="break-space">{{ step.result }}</div>
            <JiraFileUploadInput
              v-for="file in step.displayFileCount"
              :key="file"
              :id="getStepResultId(step.id)"
              :issue-id="jiraItem!.issueId"
              :project-id="jiraItem!.projectId"
              :execution-id="jiraItem!.executionId"
              :cycle-id="jiraItem!.cycleId"
              :version-id="jiraItem!.versionId"
              class="q-my-md"
            />
            <q-btn
              :label="$t('common.addFile')"
              class="full-width"
              color="green"
              unelevated
              :outline="true"
              @click="() => (step.displayFileCount += 1)"
            />
            <q-separator
              v-if="index !== stepsInTab.length - 1"
              spaced="lg"
              size="5px"
            />
          </template>
        </q-tab-panel>
      </q-tab-panels>
    </template>
  </q-splitter>
</template>

<style scoped>
/* q-splitter__before는 q-splitter의 before 슬롯을 가리킨다. */
:deep(.q-splitter__before) {
  position: sticky;
  top: 50px;
  z-index: 100;
}

.break-space {
  white-space: break-spaces;
}
</style>
