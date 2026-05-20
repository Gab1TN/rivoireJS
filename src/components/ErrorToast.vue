<template>
  <div
    v-if="message"
    class="error-toast"
    :class="type === 'success' ? 'error-toast--success' : 'error-toast--error'"
    role="alert"
    :aria-live="type === 'error' ? 'assertive' : 'polite'"
  >
    <p class="error-toast__text">{{ message }}</p>
    <button type="button" class="error-toast__close" aria-label="Fermer la notification" @click="$emit('close')">
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
      </svg>
    </button>
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

