<template>
  <MainLayout>
    <div v-if="showGlobalLoading" class="global-loading">Chargement...</div>
    <ErrorToast :type="globalToast.type" :message="globalToast.message" @close="clearGlobalToast" />
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

const globalToast = computed(() => {
  if (reservationsStore.error) return { source: 'reservation-error', type: 'error', message: reservationsStore.error };
  if (restaurantsStore.restaurantsError) return { source: 'restaurants-error', type: 'error', message: restaurantsStore.restaurantsError };
  if (restaurantsStore.restaurantDetailError) {
    return { source: 'restaurant-detail-error', type: 'error', message: restaurantsStore.restaurantDetailError };
  }
  if (restaurantsStore.slotsError) return { source: 'slots-error', type: 'error', message: restaurantsStore.slotsError };
  if (reservationsStore.successMessage) return { source: 'reservation-success', type: 'success', message: reservationsStore.successMessage };
  return { source: '', type: 'error', message: '' };
});

function clearGlobalToast() {
  if (globalToast.value.source === 'reservation-error') reservationsStore.error = '';
  if (globalToast.value.source === 'restaurants-error') restaurantsStore.restaurantsError = '';
  if (globalToast.value.source === 'restaurant-detail-error') restaurantsStore.restaurantDetailError = '';
  if (globalToast.value.source === 'slots-error') restaurantsStore.slotsError = '';
  if (globalToast.value.source === 'reservation-success') reservationsStore.successMessage = '';
}
</script>
