<template>
  <div v-if="message" class="error-toast" role="alert" aria-live="assertive">
    <p class="error-toast__text">{{ message }}</p>
    <button type="button" class="error-toast__close" @click="$emit('close')">×</button>
  </div>
</template>

<script setup>
defineProps({
  message: {
    type: String,
    default: ''
  }
});

defineEmits(['close']);
</script>
