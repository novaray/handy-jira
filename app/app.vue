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

const i18nHead = useLocaleHead();
const { locale } = useI18n();
watch(
  () => locale.value,
  () => {
    i18nHead.value.htmlAttrs = {
      lang: locale.value
    };
    useHead({
      htmlAttrs: {
        lang: locale.value
      }
    });
  }
);

const description = ref('Use Handy Jira to manage your Jira issues and test cases.');
useSeoMeta({
  title: 'Handy Jira',
  description,
  ogTitle: 'Handy Jira',
  ogDescription: description,
  ogType: 'website'
});
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
