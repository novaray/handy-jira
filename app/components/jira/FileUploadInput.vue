<script setup lang="ts">
import { FILE_LIMIT_SIZE } from '~~/constants/common';

const MAX_FILE_SIZE = 40 * 1024 * 1024; // 40MB

interface Props {
  id: string; // entityId
  issueId: number;
  projectId: number;
  executionId: string;
  cycleId: string;
  versionId: number;
}
const props = defineProps<Props>();

const file = ref<File>();
watch(
  () => file.value,
  () => {
    isUpload.value = false;
    isCompress.value = false;
  }
);

const onDownloadClick = () => {
  if (!file.value) {
    return;
  }

  const url = URL.createObjectURL(file.value);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = file.value.name;
  document.body.appendChild(a);
  a.click();

  window.URL.revokeObjectURL(url);
  a.remove();
};

const { t } = useI18n();
const compressLoading = ref(false);
const isCompress = ref(false);
const disableCompress = computed(
  () => !file.value || !file.value!.type.startsWith('video/') || file.value!.size < FILE_LIMIT_SIZE || isCompress.value
);
const onCompressClick = () => {
  if (!file.value) {
    return;
  }

  compressLoading.value = true;
  const formData = new FormData();
  formData.append('video', file.value);
  console.log(file.value);

  $fetch('/api/file/compressVideo', {
    method: 'POST',
    body: formData,
    responseType: 'blob'
  })
    .then(async (response: any) => {
      isCompress.value = true;
      if (response.type === 'application/json') {
        return handleCompressError(response);
      }

      Notify.create({
        message: t('common.compressSuccess'),
        color: 'positive'
      });

      const tempFile = new File([response], file.value!.name);
      if (tempFile) {
        file.value = tempFile;
      }
    })
    .catch(useHandleError)
    .finally(() => (compressLoading.value = false));
};

const handleCompressError = (response: any) => {
  const reader = new FileReader();
  reader.onload = () => {
    const result = JSON.parse(reader.result as string);
    Notify.create({
      message: result.statusMessage,
      color: 'negative'
    });
  };
  reader.readAsText(response);
};

const uploadLoading = ref(false);
const isUpload = ref(false);
const disableUpload = computed(
  () =>
    !file.value || file.value.size > FILE_LIMIT_SIZE || isUpload.value || compressLoading.value || uploadLoading.value
);
const rootBgColorClass = computed(() => (isUpload.value ? 'bg-light-green-1' : ''));
const uploadSuccessIcon = computed(() => (isUpload.value ? 'check_circle' : undefined));
const onUploadClick = () => {
  if (!file.value) {
    return;
  }

  uploadLoading.value = true;
  const formData = new FormData();
  formData.append('file', file.value);

  $fetch('/api/zephyrs/uploadStepResultFile', {
    method: 'POST',
    query: {
      entityId: props.id,
      issueId: props.issueId,
      projectId: props.projectId,
      executionId: props.executionId,
      cycleId: props.cycleId,
      versionId: props.versionId
    },
    body: formData
  })
    .then(() => {
      Notify.create({
        message: t('common.uploadSuccess'),
        color: 'positive'
      });
      isUpload.value = true;
    })
    .catch(useHandleError)
    .finally(() => (uploadLoading.value = false));
};
</script>

<template>
  <div
    class="row justify-between"
    :class="rootBgColorClass"
  >
    <div class="col-8 q-pa-md">
      <div class="row">
        <CommonFileInput
          v-model="file"
          class="col-10"
          :label="$t('jira.fileInputLabel')"
          :max-file-size="MAX_FILE_SIZE"
          :disable="compressLoading"
        />
        <q-btn
          v-if="file"
          class="q-ml-md q-my-md"
          square
          size="small"
          color="secondary"
          icon="download"
          @click="onDownloadClick"
        />
      </div>
    </div>
    <div class="q-gutter-md column justify-center">
      <q-btn
        :label="$t('common.compressVideo')"
        :loading="compressLoading"
        :disable="disableCompress"
        class="full-width"
        color="primary"
        icon-right="movie"
        @click="onCompressClick"
      >
        <template v-slot:loading>
          <q-spinner-hourglass class="on-left" />
          {{ $t('common.compressLoading') }}
        </template>
      </q-btn>
      <q-btn
        :label="$t('common.fileUpload')"
        :loading="uploadLoading"
        :disable="disableUpload"
        :icon="uploadSuccessIcon"
        class="full-width"
        color="secondary"
        icon-right="cloud_upload"
        @click="onUploadClick"
      >
        <template v-slot:loading>
          <q-spinner-hourglass class="on-left" />
          {{ $t('common.uploadLoading') }}
        </template>
      </q-btn>
    </div>
  </div>
</template>

<style scoped></style>
