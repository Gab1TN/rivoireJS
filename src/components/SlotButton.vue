<template>
  <BaseButton
    :variant="buttonVariant"
    :disabled="variant === 'full'"
    block
    @click="$emit('select', slot)"
  >
    {{ slot }}
  </BaseButton>
</template>

<script setup>
import BaseButton from './BaseButton.vue';
import { computed } from 'vue';

const props = defineProps({
  slot: {
    type: String,
    required: true
  },
  variant: {
    type: String,
    default: 'free'
  }
});

defineEmits(['select']);

const buttonVariant = computed(() => {
  if (props.variant === 'nearly_full') return 'warning';
  if (props.variant === 'full') return 'muted';
  return 'default';
});
</script>
