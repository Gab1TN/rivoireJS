<template>
  <button
    type="button"
    :disabled="variant === 'full'"
    :class="buttonClass"
    @click="$emit('select', slot)"
  >
    <span class="slot-button__time">{{ slot }}</span>
    <span class="slot-button__meta" :class="metaClass">{{ availabilityText }}</span>
  </button>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  slot: {
    type: String,
    required: true
  },
  variant: {
    type: String,
    default: 'free'
  },
  remainingSeats: {
    type: Number,
    default: 0
  },
  isSelected: {
    type: Boolean,
    default: false
  }
});

defineEmits(['select']);

const availabilityText = computed(() => {
  if (props.variant === 'full') return 'Complet';
  return `${props.remainingSeats} place${props.remainingSeats > 1 ? 's' : ''} restante${props.remainingSeats > 1 ? 's' : ''}`;
});

const buttonClass = computed(() => {
  const base = 'slot-button';
  if (props.variant === 'full') return `${base} slot-button--full`;
  if (props.variant === 'nearly_full') return `${base} ${props.isSelected ? 'slot-button--selected' : 'slot-button--nearly'}`;
  return `${base} ${props.isSelected ? 'slot-button--selected' : 'slot-button--free'}`;
});

const metaClass = computed(() => {
  if (props.variant === 'full') return 'slot-button__meta--full';
  if (props.variant === 'nearly_full') return 'slot-button__meta--nearly';
  return 'slot-button__meta--free';
});
</script>

