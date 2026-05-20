<template>
  <div v-if="open" class="confirm-modal__overlay">
    <section class="confirm-modal">
      <h3 class="section-title">Confirmation</h3>
      <p>{{ message }}</p>
      <div class="confirm-modal__actions">
        <BaseButton @click="$emit('cancel')">Retour</BaseButton>
        <BaseButton variant="danger" @click="$emit('confirm')">Confirmer l'annulation</BaseButton>
      </div>
    </section>
  </div>
</template>

<script setup>
import BaseButton from './BaseButton.vue';

defineProps({
  open: {
    type: Boolean,
    default: false
  },
  message: {
    type: String,
    default: 'Voulez-vous vraiment annuler cette réservation ?'
  }
});

defineEmits(['confirm', 'cancel']);
</script>
