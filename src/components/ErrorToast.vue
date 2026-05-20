<template>
  <div
    v-if="message"
    class="error-toast"
    :class="`error-toast--${type}`"
    role="alert"
    :aria-live="type === 'error' ? 'assertive' : 'polite'"
  >
    <p class="error-toast__text">{{ message }}</p>
    <button type="button" class="error-toast__close" @click="$emit('close')">×</button>
  </div>
</template>

<script setup>
import { onBeforeUnmount, watch } from 'vue';

const props = defineProps({
  type: {
    type: String,
    default: 'error'
  },
  message: {
    type: String,
    default: ''
  },
  autoCloseMs: {
    type: Number,
    default: 4500
  }
});

const emit = defineEmits(['close']);
let timeoutId = null;

watch(
  () => props.message,
  (message) => {
    if (timeoutId) clearTimeout(timeoutId);
    if (!message || props.autoCloseMs <= 0) return;
    timeoutId = setTimeout(() => {
      emit('close');
    }, props.autoCloseMs);
  },
  { immediate: true }
);

onBeforeUnmount(() => {
  if (timeoutId) clearTimeout(timeoutId);
});
</script>
