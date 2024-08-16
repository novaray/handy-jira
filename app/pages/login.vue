<script setup lang="ts">
import { Notify } from 'quasar';

definePageMeta({
  middleware: ['guest-only'],
  layout: 'login'
});

const { t } = useI18n();
const localeRoute = useLocaleRoute();
const handleSuccess = () => {
  Notify.create({
    message: t('loginSuccess'),
    color: 'positive'
  });
  const route = localeRoute({ name: 'index' });
  navigateTo(route);
};
</script>

<template>
  <q-page padding>
    <div class="flex flex-center column q-pt-xl">
      <div class="text-h2 q-mt-xl q-mb-md">{{ $t('login') }}</div>
      <LoginForm
        style="width: 500px"
        @success="handleSuccess"
      />
    </div>
  </q-page>
</template>

<style scoped></style>
