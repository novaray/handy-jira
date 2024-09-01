<script setup lang="ts">
import type { JiraMySelf } from '~~/types/jira/mySelf';
import { ValidationUtils } from '~/utils/validationUtils';
import type { JiraErrorResponse } from '~~/types/jira/errorResponse';

interface Emit {
  (e: 'success'): void;
}
const emit = defineEmits<Emit>();

const form = ref({
  email: '',
  jira: '',
  zephyrAccess: '',
  zephyrShared: ''
});
const error = ref<string>();
const loading = ref(false);

const handleSubmit = async () => {
  loading.value = true;
  $fetch<JiraMySelf>(`/api/jira/mySelf`, {
    query: {
      ...form.value
    }
  })
    .then((response) => emit('success'))
    .catch(useHandleError)
    .finally(() => (loading.value = false));
};
</script>

<template>
  <q-form
    class="q-gutter-lg"
    @submit.prevent="handleSubmit"
  >
    <q-input
      v-model="form.email"
      filled
      label="email"
      lazy-rules
      :rules="[
        (email) => ValidationUtils.isRequired(email, $t('validation.required', { field: 'email' })),
        (email) => ValidationUtils.isEmail(email, $t('validation.invalidEmail'))
      ]"
    />

    <q-input
      v-model="form.jira"
      filled
      label="Jira API Token"
      lazy-rules
      :rules="[(jira) => ValidationUtils.isRequired(jira, $t('validation.required', { field: 'Jira API Token' }))]"
    />

    <q-input
      v-model="form.zephyrAccess"
      filled
      label="Zephyr Access key"
      lazy-rules
      :rules="[
        (zephyr) => ValidationUtils.isRequired(zephyr, $t('validation.required', { field: 'Zephyr Access key' }))
      ]"
    />

    <q-input
      v-model="form.zephyrShared"
      filled
      label="Zephyr Shared key"
      lazy-rules
      :rules="[
        (zephyr) => ValidationUtils.isRequired(zephyr, $t('validation.required', { field: 'Zephyr Shared key' }))
      ]"
    />

    <div
      v-if="error"
      class="text-red text-center"
    >
      {{ error }}
    </div>

    <div class="q-mt-lg">
      <q-btn
        class="full-width"
        label="Login"
        type="submit"
        size="lg"
        color="primary"
        no-caps
        :loading="loading"
      />
    </div>
  </q-form>
</template>
