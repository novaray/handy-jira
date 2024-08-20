<script setup lang="ts">
const { locale } = useI18n();
const switchLocalePath = useSwitchLocalePath();

const getSelectLocale = computed(() => (locale.value === 'en' ? 'English' : '한국어'));
</script>

<template>
  <q-layout view="hHh lpR fFf">
    <q-header
      elevated
      class="bg-dark text-white"
      height-hint="98"
    >
      <q-toolbar>
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
      </q-toolbar>
    </q-header>

    <q-page-container class="page-main-container">
      <slot></slot>
    </q-page-container>
  </q-layout>
</template>

<style scoped></style>
