<template>
  <section>
    <h3 class="section-title">Créneaux disponibles</h3>
    <div class="slot-grid">
      <SlotButton
        v-for="slot in slots"
        :key="slot.id"
        :slot="slot.label"
        :variant="slot.variant"
        @select="$emit('select-slot', slot)"
      />
    </div>
  </section>
</template>

<script setup>
import SlotButton from './SlotButton.vue';

defineProps({
  slots: {
    type: Array,
    default: () => []
  }
});

defineEmits(['select-slot']);
</script>
