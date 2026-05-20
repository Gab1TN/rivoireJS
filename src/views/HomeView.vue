<template>
  <section>
    <h2 class="section-title">Nos restaurants</h2>

    <SearchBar
      label="Recherche"
      :model-value="search"
      placeholder="Rechercher un restaurant..."
      @update:model-value="search = $event"
    />

    <StatusMessage type="info" :message="restaurantsStore.loadingRestaurants ? 'Chargement des restaurants...' : ''" />
    <StatusMessage
      type="info"
      :message="!restaurantsStore.loadingRestaurants && !restaurantsStore.restaurantsError && filteredRestaurants.length === 0 ? 'Aucun restaurant trouvé.' : ''"
    />

    <div class="stack-sm restaurants-list">
      <RestaurantCard
        v-for="item in filteredRestaurants"
        :key="item.id"
        :image="item.imageUrl"
        :title="item.name"
        :description="item.description"
        @view-slots="openRestaurant(item.id)"
      />
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import RestaurantCard from '../components/RestaurantCard.vue';
import SearchBar from '../components/SearchBar.vue';
import StatusMessage from '../components/StatusMessage.vue';
import { useRestaurantsStore } from '../stores/restaurants';

const router = useRouter();
const restaurantsStore = useRestaurantsStore();
const search = ref('');

onMounted(() => {
  restaurantsStore.fetchRestaurants();
});

const filteredRestaurants = computed(() => {
  const term = search.value.trim().toLowerCase();
  if (!term) return restaurantsStore.restaurants;
  return restaurantsStore.restaurants.filter((item) => item.name.toLowerCase().includes(term));
});

function openRestaurant(id) {
  router.push({ name: 'restaurant-detail', params: { id } });
}
</script>

