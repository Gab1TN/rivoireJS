<template>
  <section class="summary-card">
    <h3 class="section-title">Récapitulatif</h3>

    <div v-if="restaurantImage || restaurantDescription" class="mb-3 grid gap-3 sm:grid-cols-[96px_1fr] sm:items-start">
      <img
        v-if="restaurantImage"
        :src="restaurantImage"
        :alt="restaurantName"
        class="h-24 w-full rounded-lg border border-slate-200 object-cover sm:h-[96px]"
      />
      <div>
        <p v-if="restaurantCuisineType" class="mb-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
          {{ restaurantCuisineType }}
        </p>
        <p v-if="restaurantDescription" class="mb-1 text-sm text-slate-700">{{ restaurantDescription }}</p>
        <p v-if="restaurantAddress" class="text-xs text-slate-500">{{ restaurantAddress }}</p>
      </div>
    </div>

    <p><strong>Restaurant :</strong> {{ restaurantName }}</p>
    <p><strong>Date :</strong> {{ date }}</p>
    <p><strong>Créneau :</strong> {{ slot }}</p>
    <p><strong>Couverts :</strong> {{ guests }}</p>
  </section>
</template>

<script setup>
defineProps({
  restaurantName: {
    type: String,
    default: ''
  },
  restaurantImage: {
    type: String,
    default: ''
  },
  restaurantDescription: {
    type: String,
    default: ''
  },
  restaurantCuisineType: {
    type: String,
    default: ''
  },
  restaurantAddress: {
    type: String,
    default: ''
  },
  date: {
    type: String,
    default: ''
  },
  slot: {
    type: String,
    default: ''
  },
  guests: {
    type: [String, Number],
    default: ''
  }
});
</script>
