<template>
  <article class="restaurant-card">
    <img class="restaurant-card__image" :src="image" :alt="title" />

    <div class="restaurant-card__body">
      <h3 class="restaurant-card__title">{{ title }}</h3>
      <p class="restaurant-card__description">{{ description }}</p>
      <BaseButton block @click="$emit('view-slots')">Voir créneaux</BaseButton>
    </div>
  </article>
</template>

<script setup>
import BaseButton from './BaseButton.vue';

defineProps({
  image: {
    type: String,
    default: 'https://via.placeholder.com/64x64?text=Img'
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  }
});

defineEmits(['view-slots']);
</script>
