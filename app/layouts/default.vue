<script setup lang="ts">
import { Notify } from 'quasar';

const leftDrawerOpen = ref(true);

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};

const { locale } = useI18n();
const switchLocalePath = useSwitchLocalePath();

const { accountCookie, jiraCookie, zephyrCookie, deleteAuthCookies } = useAuthCookies();
const isAuthenticated = computed(() => !!accountCookie.value && !!jiraCookie.value && !!zephyrCookie.value);
const getSelectLocale = computed(() => (locale.value === 'en' ? 'English' : '한국어'));

const { t } = useI18n();
const confirmDialogStore = useConfirmDialogStore();
const signOut = (message: string) => {
  confirmDialogStore.open(message).then(() => {
    $fetch('/api/cookie/deleteAll', {
      method: 'DELETE'
    }).then(() => {
      deleteAuthCookies(); // refreshCookie는 서버에서 삭제한 쿠키값이 useCookie로 할당한 쿠키값과 동기화되지 않는 문제가 있어서 수동으로 삭제.
      Notify.create({
        message: t('logoutSuccess'),
        color: 'positive'
      });
    });
  });
};
</script>

<template>
  <q-layout view="hHh lpR fFf">
    <q-header
      elevated
      class="bg-dark text-white"
      height-hint="98"
    >
      <q-toolbar>
        <q-btn
          dense
          flat
          round
          icon="menu"
          @click="toggleLeftDrawer"
        />
        <q-toolbar-title>{{ $t('title') }}</q-toolbar-title>

        <NuxtLinkLocale
          v-slot="{ navigate }"
          custom
          to="/"
        >
          <q-btn
            stretch
            flat
            no-caps
            :label="$t('home')"
            @click="navigate"
          />
        </NuxtLinkLocale>
        <q-separator
          dark
          vertical
        />

        <q-btn-dropdown
          stretch
          flat
          no-caps
          :label="getSelectLocale"
        >
          <q-list
            padding
            dense
          >
            <q-item
              v-close-popup
              clickable
              :to="switchLocalePath('en')"
            >
              <q-item-section>
                <q-item-label>English</q-item-label>
              </q-item-section>
            </q-item>
            <q-item
              v-close-popup
              clickable
              :to="switchLocalePath('ko')"
            >
              <q-item-section>
                <q-item-label>한국어</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
        <q-separator
          dark
          vertical
        />
        <NuxtLinkLocale
          v-if="!isAuthenticated"
          v-slot="{ navigate }"
          custom
          to="/login"
        >
          <q-btn
            stretch
            flat
            :label="$t('login')"
            no-caps
            @click="navigate()"
          />
        </NuxtLinkLocale>
        <q-btn
          v-else
          stretch
          flat
          :label="$t('logout')"
          no-caps
          @click="signOut($t('logoutWarning'))"
        />
      </q-toolbar>
    </q-header>

    <q-drawer
      show-if-above
      v-model="leftDrawerOpen"
      side="left"
      bordered
    >
      <!-- drawer content -->
    </q-drawer>

    <q-page-container class="page-main-container">
      <slot></slot>
    </q-page-container>
  </q-layout>
  <CommonConfirmDialog />
</template>

<style scoped></style>
