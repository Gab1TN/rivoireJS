<template>
  <form class="reservation-form" @submit.prevent="$emit('submit', form)">
    <h2 class="section-title">Réservation</h2>

    <BaseInput label="Nom" :model-value="form.lastName" :disabled="disabled" @update:model-value="setField('lastName', $event)" />
    <BaseInput label="Prénom" :model-value="form.firstName" :disabled="disabled" @update:model-value="setField('firstName', $event)" />
    <BaseInput label="Email" type="email" :model-value="form.email" :disabled="disabled" @update:model-value="setField('email', $event)" />
    <BaseInput label="Téléphone" :model-value="form.phone" :disabled="disabled" @update:model-value="setField('phone', $event)" />
    <BaseInput label="Nombre de couverts" type="number" :model-value="form.guests" :disabled="disabled" @update:model-value="setField('guests', $event)" />

    <BaseButton type="submit" block :disabled="disabled">Envoyer</BaseButton>
  </form>
</template>

<script setup>
import { reactive } from 'vue';
import BaseInput from './BaseInput.vue';
import BaseButton from './BaseButton.vue';

defineProps({
  disabled: {
    type: Boolean,
    default: false
  }
});

const form = reactive({
  lastName: '',
  firstName: '',
  email: '',
  phone: '',
  guests: ''
});

defineEmits(['submit']);

function setField(field, value) {
  form[field] = value;
}

function fillRandomForm() {
  const firstNames = ['Emma', 'Lucas', 'Lina', 'Nathan', 'Chloe', 'Hugo', 'Lea', 'Adam'];
  const lastNames = ['Martin', 'Bernard', 'Dubois', 'Petit', 'Moreau', 'Simon', 'Laurent', 'Michel'];
  const domains = ['example.com', 'mail.fr', 'demo.test'];
  const random = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const randomDigits = (length) => Array.from({ length }, () => Math.floor(Math.random() * 10)).join('');

  const firstName = random(firstNames);
  const lastName = random(lastNames);

  form.firstName = firstName;
  form.lastName = lastName;
  form.email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Math.floor(Math.random() * 90 + 10)}@${random(domains)}`;
  form.phone = `06${randomDigits(8)}`;
  form.guests = String(Math.floor(Math.random() * 8) + 1);
}

defineExpose({
  fillRandomForm
});
</script>

