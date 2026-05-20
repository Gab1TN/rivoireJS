<template>
  <section>
    <ReservationSummary
      :restaurant-name="reservation.restaurantName"
      :restaurant-image="reservation.restaurantImage"
      :restaurant-description="reservation.restaurantDescription"
      :restaurant-cuisine-type="reservation.restaurantCuisineType"
      :restaurant-address="reservation.restaurantAddress"
      :date="reservation.date"
      :slot="reservation.slot"
      :guests="reservation.guests"
    />

    <div class="mt-sm">
      <ReservationForm :disabled="reservationsStore.loadingCreate" @submit="submitForm" />
    </div>

    <StatusMessage type="info" :message="reservationsStore.loadingCreate ? 'Envoi de la réservation...' : ''" />
    <StatusMessage type="success" :message="reservationsStore.successMessage" />
  </section>
</template>

<script setup>
import { reactive } from 'vue';
import { useRoute } from 'vue-router';
import ReservationForm from '../components/ReservationForm.vue';
import ReservationSummary from '../components/ReservationSummary.vue';
import StatusMessage from '../components/StatusMessage.vue';
import { useReservationsStore } from '../stores/reservations';
import { useRestaurantsStore } from '../stores/restaurants';

const route = useRoute();
const reservationsStore = useReservationsStore();
const restaurantsStore = useRestaurantsStore();

const reservation = reactive({
  restaurantId: String(route.query.restaurantId || ''),
  restaurantName: String(route.query.restaurantName || 'Restaurant non défini'),
  restaurantImage: String(route.query.restaurantImage || ''),
  restaurantDescription: String(route.query.restaurantDescription || ''),
  restaurantCuisineType: String(route.query.restaurantCuisineType || ''),
  restaurantAddress: String(route.query.restaurantAddress || ''),
  date: String(route.query.date || 'Date non définie'),
  timeSlotId: String(route.query.timeSlotId || ''),
  slot: String(route.query.slotLabel || 'Créneau non défini'),
  guests: ''
});

function validate(payload) {
  if (!reservation.restaurantId || !reservation.timeSlotId || !reservation.date) return 'Informations de réservation incomplètes.';
  if (!payload.lastName || !payload.firstName || !payload.email || !payload.phone || !payload.guests) return 'Merci de remplir tous les champs.';
  if (!payload.email.includes('@')) return 'Email invalide.';
  if (Number(payload.guests) <= 0) return 'Le nombre de couverts doit être supérieur à 0.';
  return '';
}

async function submitForm(payload) {
  reservationsStore.clearFeedback();

  const validationError = validate(payload);
  if (validationError) {
    reservationsStore.error = validationError;
    return;
  }

  const apiPayload = {
    restaurantId: reservation.restaurantId,
    timeSlotId: reservation.timeSlotId,
    customerName: `${payload.firstName} ${payload.lastName}`.trim(),
    customerEmail: payload.email,
    customerPhone: payload.phone,
    covers: Number(payload.guests)
  };

  const data = await reservationsStore.createReservation(apiPayload);
  if (!data) return;

  reservation.guests = payload.guests;
  await restaurantsStore.fetchSlots(reservation.restaurantId, reservation.date);
}
</script>
