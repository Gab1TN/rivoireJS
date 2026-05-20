<template>
  <section>
    <h2 class="section-title">Détail restaurant</h2>
    <StatusMessage type="info" :message="restaurantsStore.loadingRestaurantDetail ? 'Chargement des informations...' : ''" />
    <StatusMessage type="error" :message="restaurantsStore.restaurantDetailError" />

    <div v-if="restaurant && !restaurantsStore.loadingRestaurantDetail" class="summary-card">
      <p><strong>{{ restaurant.name }}</strong></p>
      <p>{{ restaurant.description }}</p>
      <p><small>{{ restaurant.address }}</small></p>
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
      <StatusMessage type="error" :message="restaurantsStore.slotsError" />

      <SlotGrid :slots="restaurantsStore.slots" @select-slot="selectSlot" />

      <StatusMessage
        type="info"
        :message="!restaurantsStore.loadingSlots && !restaurantsStore.slotsError && restaurantsStore.slots.length === 0 ? 'Aucun créneau pour cette date.' : ''"
      />

      <BaseButton block class="mt-sm" :disabled="!selectedSlot" @click="continueToReservation">
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
const selectedDate = ref(new Date().toISOString().slice(0, 10));
const selectedSlot = ref(null);

const restaurantId = computed(() => String(route.params.id || ''));
const restaurant = computed(() => restaurantsStore.selectedRestaurant);

const dates = computed(() => {
  const base = new Date();
  return Array.from({ length: 5 }, (_, index) => {
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
      date: selectedDate.value,
      timeSlotId: selectedSlot.value.id,
      slotLabel: selectedSlot.value.label
    }
  });
}

function formatShortDate(isoDate) {
  const [, month, day] = isoDate.split('-');
  return `${day}/${month}`;
}
</script>
