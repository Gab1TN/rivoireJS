<template>
  <div class="screen-frame">
    <AppHeader title="Reserveo" />
    <main class="screen-content">
      <slot />
    </main>
  </div>
</template>

<script setup>
import AppHeader from '../components/AppHeader.vue';
</script>
