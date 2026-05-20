<template>
  <section>
    <h2 class="section-title">Accès à la réservation par token</h2>

    <form class="summary-card" @submit.prevent="openReservation">
      <BaseInput
        label="Token"
        :model-value="token"
        placeholder="Collez votre token de réservation"
        @update:model-value="token = String($event || '')"
      />
      <BaseButton type="submit" block :disabled="!normalizedToken">Ouvrir ma réservation</BaseButton>
    </form>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import BaseButton from '../components/BaseButton.vue';
import BaseInput from '../components/BaseInput.vue';

const router = useRouter();
const token = ref('');

const normalizedToken = computed(() => token.value.trim());

function openReservation() {
  if (!normalizedToken.value) return;
  router.push({ name: 'reservation-token', params: { token: normalizedToken.value } });
}
</script>

