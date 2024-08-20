<script setup lang="ts">
const confirmDialogStore = useConfirmDialogStore();

const onClickCancel = () => {
  confirmDialogStore.close();
};

const onClickConfirm = () => {
  confirmDialogStore.confirm();
};
</script>

<template>
  <q-dialog :model-value="confirmDialogStore.visible">
    <q-card style="min-width: 350px">
      <q-card-section class="row items-center">
        <span class="q-ml-sm">{{ confirmDialogStore.message }}</span>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          :label="$t('cancel')"
          @click="onClickCancel"
        />
        <q-btn
          :label="$t('confirm')"
          color="primary"
          @click="onClickConfirm"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style scoped></style>
