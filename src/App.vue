<template>
  <MainLayout>
    <div v-if="showGlobalLoading" class="global-loading">Chargement...</div>
    <ErrorToast :message="globalError.message" @close="clearGlobalError" />
    <RouterView />
  </MainLayout>
</template>

<script setup>
import { computed } from 'vue';
import { RouterView } from 'vue-router';
import ErrorToast from './components/ErrorToast.vue';
import MainLayout from './layouts/MainLayout.vue';
import { useRestaurantsStore } from './stores/restaurants';
import { useReservationsStore } from './stores/reservations';

const restaurantsStore = useRestaurantsStore();
const reservationsStore = useReservationsStore();

const showGlobalLoading = computed(() => restaurantsStore.isLoading || reservationsStore.isLoading);

const globalError = computed(() => {
  if (reservationsStore.error) return { source: 'reservation', message: reservationsStore.error };
  if (restaurantsStore.restaurantsError) return { source: 'restaurants', message: restaurantsStore.restaurantsError };
  if (restaurantsStore.restaurantDetailError) return { source: 'restaurant-detail', message: restaurantsStore.restaurantDetailError };
  if (restaurantsStore.slotsError) return { source: 'slots', message: restaurantsStore.slotsError };
  return { source: '', message: '' };
});

function clearGlobalError() {
  if (globalError.value.source === 'reservation') reservationsStore.error = '';
  if (globalError.value.source === 'restaurants') restaurantsStore.restaurantsError = '';
  if (globalError.value.source === 'restaurant-detail') restaurantsStore.restaurantDetailError = '';
  if (globalError.value.source === 'slots') restaurantsStore.slotsError = '';
}
</script>
