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
  zephyr: ''
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
    .catch((err: JiraErrorResponse) => {
      error.value = `${err.status} - ${err.data.data}`;
      console.dir(err);
    })
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
      label="Jira API key"
      lazy-rules
      :rules="[(jira) => ValidationUtils.isRequired(jira, $t('validation.required', { field: 'Jira API key' }))]"
    />

    <q-input
      v-model="form.zephyr"
      filled
      label="Zephyr API key"
      lazy-rules
      :rules="[(zephyr) => ValidationUtils.isRequired(zephyr, $t('validation.required', { field: 'Zephyr API key' }))]"
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
