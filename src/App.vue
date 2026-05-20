<template>
  <MainLayout>
    <div v-if="showGlobalLoading" class="global-loading">Chargement...</div>
    <RouterView />
  </MainLayout>
</template>

<script setup>
import { computed } from 'vue';
import { RouterView } from 'vue-router';
import MainLayout from './layouts/MainLayout.vue';
import { useRestaurantsStore } from './stores/restaurants';
import { useReservationsStore } from './stores/reservations';

const restaurantsStore = useRestaurantsStore();
const reservationsStore = useReservationsStore();

const showGlobalLoading = computed(() => restaurantsStore.isLoading || reservationsStore.isLoading);
</script>
