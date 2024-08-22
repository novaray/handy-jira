<script setup lang="ts">
const testExecutionStore = useTestExecutionStore();
const { jiraItems } = storeToRefs(testExecutionStore);

const onDelete = (id: number) => {
  testExecutionStore.removeJiraItem(id);
};
</script>

<template>
  <q-list
    bordered
    class="rounded-borders"
    style="max-width: 600px"
  >
    <q-item-label header>Jira issues</q-item-label>

    <template v-for="({ id, title, url, init, testSteps }, index) in jiraItems">
      <LeftMenuListItem
        :id
        :title
        :url
        :init
        :testSteps
        @delete="onDelete"
      />
      <q-separator
        v-if="index < jiraItems.length - 1"
        spaced
      />
    </template>
  </q-list>
</template>

<style scoped></style>
