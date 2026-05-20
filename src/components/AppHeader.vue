<template>
  <header class="app-header">
    <h1 class="app-header__title">
      <RouterLink to="/" class="app-header__home">{{ title }}</RouterLink>
    </h1>
    <RouterLink to="/reservation/token/" class="app-header__token-link" aria-label="Accéder à la réservation par token">
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M14 8C14 10.2091 12.2091 12 10 12C7.79086 12 6 10.2091 6 8C6 5.79086 7.79086 4 10 4C12.2091 4 14 5.79086 14 8Z"
          stroke="currentColor"
          stroke-width="1.8"
        />
        <path
          d="M14 8H21L19 10L20 11L18 13L16 11L14 13L12 11"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </RouterLink>
  </header>
</template>

<script setup>
import { RouterLink } from 'vue-router';

defineProps({
  title: {
    type: String,
    default: 'Reserveo'
  }
});
</script>

