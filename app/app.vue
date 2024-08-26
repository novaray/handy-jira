<script setup lang="ts">
const testExecutionStore = useTestExecutionStore();
const onPreventUnload = (event: BeforeUnloadEvent) => {
  if (!testExecutionStore.jiraItems.length) {
    return;
  }

  event.returnValue = '';
  event.preventDefault();
};

onMounted(() => {
  window.addEventListener('beforeunload', onPreventUnload);
});

onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', onPreventUnload);
});
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
