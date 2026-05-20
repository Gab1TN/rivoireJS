<template>
  <label class="search-bar">
    <span v-if="label" class="field__label">{{ label }}</span>
    <BaseInput
      :model-value="modelValue"
      :placeholder="placeholder"
      @update:model-value="$emit('update:modelValue', $event)"
    />
  </label>
</template>

<script setup>
import BaseInput from './BaseInput.vue';

defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Rechercher un restaurant'
  }
});

defineEmits(['update:modelValue']);
</script>
