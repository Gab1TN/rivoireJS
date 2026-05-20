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

    <div v-if="createdToken" class="summary-card mt-sm token-card">
      <p class="token-card__label">Token de réservation</p>
      <div class="token-card__row">
        <code class="token-card__value">{{ createdToken }}</code>
        <button type="button" class="token-card__copy" :aria-label="copyLabel" @click="copyToken">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="9" y="9" width="11" height="11" rx="2" stroke="currentColor" stroke-width="1.8" />
            <path d="M15 9V6C15 4.89543 14.1046 4 13 4H6C4.89543 4 4 4.89543 4 6V13C4 14.1046 4.89543 15 6 15H9" stroke="currentColor" stroke-width="1.8" />
          </svg>
          <span>{{ copyLabel }}</span>
        </button>
      </div>
      <p class="token-card__hint">Lien direct : <strong>{{ tokenUrl }}</strong></p>
    </div>

    <div class="mt-sm stack-sm">
      <BaseButton variant="warning" :disabled="reservationsStore.loadingCreate" @click="fillDemoForm">
        Remplir
      </BaseButton>
      <ReservationForm ref="reservationFormRef" :disabled="reservationsStore.loadingCreate" @submit="submitForm" />
    </div>

    <StatusMessage type="info" :message="reservationsStore.loadingCreate ? 'Envoi de la réservation...' : ''" />
  </section>
</template>

<script setup>
import { computed, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import BaseButton from '../components/BaseButton.vue';
import ReservationForm from '../components/ReservationForm.vue';
import ReservationSummary from '../components/ReservationSummary.vue';
import StatusMessage from '../components/StatusMessage.vue';
import { useReservationsStore } from '../stores/reservations';
import { useRestaurantsStore } from '../stores/restaurants';

const route = useRoute();
const reservationsStore = useReservationsStore();
const restaurantsStore = useRestaurantsStore();
const reservationFormRef = ref(null);
const copyLabel = ref('Copier');

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

const createdToken = computed(() => {
  const payload = reservationsStore.reservation;
  if (!payload) return '';
  if (typeof payload.token === 'string') return payload.token;
  if (typeof payload?.reservation?.token === 'string') return payload.reservation.token;
  return '';
});

const tokenUrl = computed(() => {
  if (!createdToken.value) return '';
  return `${window.location.origin}/reservation/token/${createdToken.value}`;
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

function fillDemoForm() {
  reservationFormRef.value?.fillRandomForm();
}

async function copyToken() {
  if (!createdToken.value) return;
  try {
    await navigator.clipboard.writeText(createdToken.value);
    copyLabel.value = 'Copié';
    setTimeout(() => {
      copyLabel.value = 'Copier';
    }, 1400);
  } catch {
    reservationsStore.error = 'Impossible de copier le token.';
  }
}
</script>
