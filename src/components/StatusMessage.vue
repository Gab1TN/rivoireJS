<template>
  <p v-if="message" class="status-message" :class="`status-message--${type}`">
    {{ message }}
  </p>
</template>

<script setup>
defineProps({
  type: {
    type: String,
    default: 'info'
  },
  message: {
    type: String,
    default: ''
  }
});
</script>
