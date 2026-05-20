<template>
  <button
    type="button"
    :disabled="variant === 'full'"
    :class="buttonClass"
    @click="$emit('select', slot)"
  >
    <span class="text-sm font-semibold">{{ slot }}</span>
    <span class="text-xs" :class="metaClass">{{ availabilityText }}</span>
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
  const base = 'w-full rounded-lg border px-3 py-2 text-left transition';
  if (props.variant === 'full') {
    return `${base} border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed`;
  }

  if (props.variant === 'nearly_full') {
    return props.isSelected
      ? `${base} border-blue-600 bg-blue-50 ring-2 ring-blue-100 text-blue-900`
      : `${base} border-blue-200 bg-blue-50 text-blue-800 hover:border-blue-300`;
  }

  return props.isSelected
    ? `${base} border-blue-600 bg-blue-50 ring-2 ring-blue-100 text-blue-900`
    : `${base} border-slate-300 bg-white text-slate-800 hover:border-blue-300 hover:bg-blue-50`;
});

const metaClass = computed(() => {
  if (props.variant === 'full') return 'text-slate-500';
  if (props.variant === 'nearly_full') return 'text-blue-700';
  return 'text-slate-500';
});
</script>
