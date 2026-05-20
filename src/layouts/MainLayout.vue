<template>
  <div class="screen-frame">
    <AppHeader title="Reserveo" @menu-click="$emit('menu-click')" />
    <main class="screen-content">
      <slot />
    </main>
  </div>
</template>

<script setup>
import AppHeader from '../components/AppHeader.vue';
defineEmits(['menu-click']);
</script>
