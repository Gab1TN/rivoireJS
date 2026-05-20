<template>
  <section>
    <h2 class="section-title">Réservation par token</h2>

    <StatusMessage type="info" :message="reservationsStore.loadingFetch ? 'Recherche de la réservation...' : ''" />

    <ReservationSummary
      v-if="reservationsStore.reservation && !reservationsStore.loadingFetch"
      :restaurant-name="reservationsStore.reservation.restaurant.name"
      :date="reservationsStore.reservation.slot.date"
      :slot="reservationsStore.reservation.slot.startTime"
      :guests="reservationsStore.reservation.covers"
    />

    <StatusMessage
      type="info"
      :message="!reservationsStore.loadingFetch && !reservationsStore.error && !reservationsStore.reservation ? 'Aucune réservation trouvée.' : ''"
    />

    <div v-if="reservationsStore.reservation && !reservationsStore.loadingFetch" class="mt-sm">
      <BaseButton variant="danger" block :disabled="reservationsStore.loadingCancel" @click="openConfirm">
        Annuler la réservation
      </BaseButton>
    </div>

    <StatusMessage type="info" :message="reservationsStore.loadingCancel ? 'Annulation en cours...' : ''" />
    <StatusMessage type="success" :message="reservationsStore.successMessage" />

    <ConfirmModal
      :open="isConfirmOpen"
      message="Confirmer l'annulation de cette réservation ?"
      @cancel="closeConfirm"
      @confirm="confirmCancel"
    />
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import BaseButton from '../components/BaseButton.vue';
import ConfirmModal from '../components/ConfirmModal.vue';
import ReservationSummary from '../components/ReservationSummary.vue';
import StatusMessage from '../components/StatusMessage.vue';
import { useReservationsStore } from '../stores/reservations';
import { useRestaurantsStore } from '../stores/restaurants';

const route = useRoute();
const reservationsStore = useReservationsStore();
const restaurantsStore = useRestaurantsStore();
const isConfirmOpen = ref(false);

onMounted(async () => {
  const token = String(route.params.token || '');
  reservationsStore.clearFeedback();
  if (!token) {
    reservationsStore.error = 'Token manquant.';
    return;
  }
  await reservationsStore.fetchReservationByToken(token);
});

function openConfirm() {
  isConfirmOpen.value = true;
}

function closeConfirm() {
  isConfirmOpen.value = false;
}

async function confirmCancel() {
  const currentReservation = reservationsStore.reservation;
  if (!currentReservation) return;

  const response = await reservationsStore.cancelReservation({
    reservationId: currentReservation.id,
    token: currentReservation.token
  });

  if (response?.reservation) {
    const { restaurant, slot } = response.reservation;
    await restaurantsStore.fetchSlots(restaurant.id, slot.date);
  }

  isConfirmOpen.value = false;
}
</script>
