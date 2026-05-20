import { defineStore } from 'pinia';
import api from '../services/api';

function getApiErrorMessage(error, fallbackMessage) {
  const responseMessage = error?.response?.data?.message;
  if (Array.isArray(responseMessage)) return translateApiMessage(responseMessage.join(', '));
  if (typeof responseMessage === 'string' && responseMessage.trim()) return translateApiMessage(responseMessage);
  if (typeof error?.message === 'string' && error.message.trim()) return translateApiMessage(error.message);
  return translateApiMessage(fallbackMessage);
}

function translateApiMessage(message) {
  const text = String(message || '').trim();
  const lower = text.toLowerCase();

  if (lower.includes('restaurant not found')) return 'Restaurant introuvable.';
  if (lower.includes('query param date is required')) return 'Le paramètre date est requis (YYYY-MM-DD).';
  if (lower.includes('not found')) return 'Ressource introuvable.';
  if (lower.includes('network error')) return "Erreur réseau. Vérifie que le backend est bien lancé.";
  if (lower.includes('timeout')) return "Délai d'attente dépassé. Réessaie.";

  return text;
}

function normalizeSlot(slot) {
  return {
    id: slot.id,
    label: slot.startTime,
    variant: slot.status,
    date: slot.date,
    startTime: slot.startTime,
    endTime: slot.endTime,
    status: slot.status,
    restaurantId: slot.restaurantId
  };
}

export const useRestaurantsStore = defineStore('restaurants', {
  state: () => ({
    restaurants: [],
    selectedRestaurant: null,
    slots: [],
    loadingRestaurants: false,
    loadingRestaurantDetail: false,
    loadingSlots: false,
    restaurantsError: '',
    restaurantDetailError: '',
    slotsError: ''
  }),
  getters: {
    hasRestaurants: (state) => state.restaurants.length > 0,
    hasSlots: (state) => state.slots.length > 0,
    isLoading: (state) => state.loadingRestaurants || state.loadingRestaurantDetail || state.loadingSlots
  },
  actions: {
    clearErrors() {
      this.restaurantsError = '';
      this.restaurantDetailError = '';
      this.slotsError = '';
    },

    async fetchRestaurants() {
      this.loadingRestaurants = true;
      this.restaurantsError = '';
      try {
        const { data } = await api.get('/restaurants');
        this.restaurants = Array.isArray(data) ? data : [];
      } catch (error) {
        this.restaurants = [];
        this.restaurantsError = getApiErrorMessage(error, 'Impossible de charger les restaurants.');
      } finally {
        this.loadingRestaurants = false;
      }
    },

    async fetchRestaurantById(id) {
      this.loadingRestaurantDetail = true;
      this.restaurantDetailError = '';
      try {
        const { data } = await api.get(`/restaurants/${id}`);
        this.selectedRestaurant = data;
      } catch (error) {
        this.selectedRestaurant = null;
        this.restaurantDetailError = getApiErrorMessage(error, 'Impossible de charger ce restaurant.');
      } finally {
        this.loadingRestaurantDetail = false;
      }
    },

    async fetchSlots(restaurantId, date) {
      this.loadingSlots = true;
      this.slotsError = '';
      try {
        const { data } = await api.get(`/restaurants/${restaurantId}/slots`, { params: { date } });
        this.slots = Array.isArray(data) ? data.map(normalizeSlot) : [];
      } catch (error) {
        this.slots = [];
        this.slotsError = getApiErrorMessage(error, 'Impossible de charger les créneaux.');
      } finally {
        this.loadingSlots = false;
      }
    }
  }
});
