<script setup lang="ts">
interface Props {
  label?: string;
  color?: string;
  labelColor?: string;
  accept?: string;
  counter?: boolean;
  maxFileSize?: number;
  clearable?: boolean;
  disable?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  label: 'file Upload',
  color: 'grey-3',
  labelColor: 'green',
  counter: true,
  maxFileSize: Infinity,
  clearable: true,
  disable: false
});

const modelValue = defineModel<File | FileList | undefined>({
  default: undefined
});
</script>

<template>
  <q-file
    v-model="modelValue"
    :label="label"
    :color="color"
    :label-color="labelColor"
    :accept="accept"
    :counter="counter"
    :max-file-size="maxFileSize"
    :clearable="clearable"
    :disable="disable"
    outlined
  >
    <template v-slot:append>
      <q-icon
        name="attachment"
        :color="labelColor"
      />
    </template>
  </q-file>
</template>

<style scoped></style>
