<template>
  <section>
    <h2 class="section-title">Détail restaurant</h2>
    <StatusMessage type="info" :message="restaurantsStore.loadingRestaurantDetail ? 'Chargement des informations...' : ''" />

    <div v-if="restaurant && !restaurantsStore.loadingRestaurantDetail" class="summary-card">
      <div class="grid gap-3 md:grid-cols-[140px_1fr] md:items-start">
        <img
          :src="restaurant.imageUrl"
          :alt="restaurant.name"
          class="h-28 w-full rounded-lg border border-slate-200 object-cover md:h-[120px]"
        />
        <div>
          <p class="mb-1 text-lg font-semibold text-slate-900">{{ restaurant.name }}</p>
          <p class="mb-2 text-sm font-medium text-blue-700">{{ restaurant.cuisineType }}</p>
          <p class="mb-2 text-sm text-slate-700">{{ restaurant.description }}</p>
          <p class="text-xs text-slate-500">{{ restaurant.address }}</p>
        </div>
      </div>
    </div>

    <div class="summary-card mt-sm">
      <h3 class="section-title">Choix de la date</h3>
      <div class="date-grid">
        <BaseButton
          v-for="date in dates"
          :key="date"
          :variant="selectedDate === date ? 'warning' : 'default'"
          @click="selectedDate = date"
        >
          {{ formatShortDate(date) }}
        </BaseButton>
      </div>
    </div>

    <div class="summary-card mt-sm">
      <StatusMessage type="info" :message="restaurantsStore.loadingSlots ? 'Chargement des créneaux...' : ''" />

      <SlotGrid :slots="restaurantsStore.slots" :selected-slot-id="selectedSlotId" @select-slot="selectSlot" />

      <StatusMessage
        type="info"
        :message="!restaurantsStore.loadingSlots && !restaurantsStore.slotsError && restaurantsStore.slots.length === 0 ? 'Aucun créneau pour cette date.' : ''"
      />

      <BaseButton block class="mt-sm reservation-continue-button" :disabled="!selectedSlot" @click="continueToReservation">
        Continuer
      </BaseButton>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import BaseButton from '../components/BaseButton.vue';
import SlotGrid from '../components/SlotGrid.vue';
import StatusMessage from '../components/StatusMessage.vue';
import { useRestaurantsStore } from '../stores/restaurants';

const route = useRoute();
const router = useRouter();
const restaurantsStore = useRestaurantsStore();
const DATE_OPTIONS_COUNT = 14;
const selectedDate = ref(new Date().toISOString().slice(0, 10));
const selectedSlot = ref(null);

const restaurantId = computed(() => String(route.params.id || ''));
const restaurant = computed(() => restaurantsStore.selectedRestaurant);
const selectedSlotId = computed(() => (selectedSlot.value ? selectedSlot.value.id : ''));

const dates = computed(() => {
  const base = new Date();
  return Array.from({ length: DATE_OPTIONS_COUNT }, (_, index) => {
    const d = new Date(base);
    d.setDate(base.getDate() + index);
    return d.toISOString().slice(0, 10);
  });
});

onMounted(async () => {
  if (!restaurantId.value) return;
  await restaurantsStore.fetchRestaurantById(restaurantId.value);
  await restaurantsStore.fetchSlots(restaurantId.value, selectedDate.value);
});

watch(selectedDate, async (newDate) => {
  selectedSlot.value = null;
  if (!restaurantId.value) return;
  await restaurantsStore.fetchSlots(restaurantId.value, newDate);
});

function selectSlot(slot) {
  if (slot.variant === 'full') return;
  selectedSlot.value = slot;
}

function continueToReservation() {
  if (!restaurant.value || !selectedSlot.value) return;
  router.push({
    name: 'reservation',
    query: {
      restaurantId: restaurant.value.id,
      restaurantName: restaurant.value.name,
      restaurantImage: restaurant.value.imageUrl,
      restaurantDescription: restaurant.value.description,
      restaurantCuisineType: restaurant.value.cuisineType,
      restaurantAddress: restaurant.value.address,
      date: selectedDate.value,
      timeSlotId: selectedSlot.value.id,
      slotLabel: selectedSlot.value.label
    }
  });
}

function formatShortDate(isoDate) {
  const date = new Date(`${isoDate}T00:00:00`);
  const weekday = date.toLocaleDateString('fr-FR', { weekday: 'short' }).replace('.', '');
  const [, month, day] = isoDate.split('-');
  return `${weekday} ${day}/${month}`;
}
</script>
