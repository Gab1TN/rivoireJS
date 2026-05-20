import { defineStore } from 'pinia';
import api from '../services/api';

function getApiErrorMessage(error, fallbackMessage) {
  const responseMessage = error?.response?.data?.message;
  if (Array.isArray(responseMessage)) return responseMessage.join(', ');
  if (typeof responseMessage === 'string' && responseMessage.trim()) return responseMessage;
  if (typeof error?.message === 'string' && error.message.trim()) return error.message;
  return fallbackMessage;
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
