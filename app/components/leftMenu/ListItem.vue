<script setup lang="ts">
import type { TestStep } from '~~/types/zephyrs/TestStep';

interface Props {
  id: number;
  title: string;
  url: string;
  init: boolean;
  testSteps: TestStep[];
}
const props = defineProps<Props>();

interface Emits {
  (e: 'delete', id: number): void;
}
const emit = defineEmits<Emits>();

const route = useRoute();
const routeId = ref(+(route.params.id as string));

watch(
  () => route.params.id,
  (newId) => {
    routeId.value = +(newId as string);
  }
);

const active = computed(
  () => route.name?.toString().includes('jira-issue-id-issueTitle') && routeId.value === props.id
);

const localeRoute = useLocaleRoute();
const onClick = (e: any) => {
  if (!props.init) {
    return;
  }

  const route = localeRoute({
    name: 'jira-issue-id-issueTitle',
    params: {
      id: props.id,
      issueTitle: props.title
    }
  });
  if (!route) {
    return;
  }

  return navigateTo(route.fullPath);
};

const onClickLink = (e: Event, url: string) => {
  e.stopPropagation();
  window.open(url, '_blank')?.focus();
};

const confirmDialogStore = useConfirmDialogStore();
const { t } = useI18n();
const onClickDelete = (e: Event) => {
  e.stopPropagation();
  confirmDialogStore.open(t('jira.itemDeleteConfirm')).then(() => emit('delete', props.id));
};
</script>

<template>
  <q-item
    clickable
    transition-hide="jump-up"
    @click="onClick"
    :active="active"
    active-class="bg-light-blue-1 text-grey-8"
  >
    <q-item-section
      v-if="init"
      top
    >
      <q-item-label lines="1">
        <span class="text-weight-medium">{{ title }}</span>
      </q-item-label>
      <q-item-label
        lines="1"
        class="q-mt-xs text-body2 text-weight-bold text-primary text-uppercase"
      >
        <span
          class="cursor-pointer"
          @click="(event) => onClickLink(event, url)"
        >
          Open in Jira
        </span>
      </q-item-label>
    </q-item-section>

    <q-item-section
      v-if="init"
      top
      side
    >
      <div class="text-grey-8 q-gutter-xs">
        <q-btn
          class="gt-xs"
          size="12px"
          flat
          dense
          round
          icon="delete"
          @click="onClickDelete"
        />
      </div>
    </q-item-section>
    <q-inner-loading
      :showing="!init"
      :label="$t('jira.fetchExecutionLoading')"
      color="primary"
      label-style="font-size: 1.0em"
    />
  </q-item>
</template>

<style scoped></style>
