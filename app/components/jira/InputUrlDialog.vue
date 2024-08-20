<script setup lang="ts">
const url = ref('');
const dialogStore = useJiraUrlInputDialogStore();

const onClickCancel = () => {
  dialogStore.close();
};

const onClickConfirm = () => {
  dialogStore.confirm(url.value);
};
</script>

<template>
  <q-dialog
    :model-value="dialogStore.visible"
    persistent
  >
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">{{ $t('jira.inputUrlDialog.title') }}</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-input
          dense
          v-model="url"
          autofocus
          :label="$t('jira.inputUrlDialog.placeholder')"
          @keyup.enter="onClickConfirm"
        />
      </q-card-section>

      <q-card-actions
        align="right"
        class="text-primary"
      >
        <q-btn
          flat
          :label="$t('cancel')"
          @click="onClickCancel"
        />
        <q-btn
          flat
          :label="$t('confirm')"
          @click="onClickConfirm"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style scoped></style>
