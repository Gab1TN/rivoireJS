<template>
  <section class="summary-card">
    <h3 class="section-title">Récapitulatif</h3>
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
