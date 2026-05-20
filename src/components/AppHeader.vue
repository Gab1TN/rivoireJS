<template>
  <header class="app-header">
    <h1 class="app-header__title">{{ title }}</h1>
    <button
      v-if="showMenu"
      type="button"
      class="app-header__menu"
      aria-label="Ouvrir le menu"
      @click="$emit('menu-click')"
    >
      <span></span>
      <span></span>
      <span></span>
    </button>
  </header>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: 'Reserveo'
  },
  showMenu: {
    type: Boolean,
    default: true
  }
});

defineEmits(['menu-click']);
</script>
