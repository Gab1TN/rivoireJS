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
  const seatsLeftMatch = text.match(/Not enough seats left\s*\((\d+)\s*remaining\)/i);

  if (seatsLeftMatch) {
    return `Il n'y a pas assez de places disponibles (${seatsLeftMatch[1]} restantes).`;
  }

  if (lower.includes('reservation is already cancelled') || lower.includes('reservation is already canceled')) {
    return 'La réservation est déjà annulée.';
  }
  if (lower.includes('reservation not found')) return 'Réservation introuvable.';
  if (lower.includes('invalid token')) return 'Token invalide.';
  if (lower.includes('token is required')) return 'Le token est requis.';
  if (lower.includes('network error')) return "Erreur réseau. Vérifie que le backend est bien lancé.";
  if (lower.includes('timeout')) return "Délai d'attente dépassé. Réessaie.";

  return text;
}

export const useReservationsStore = defineStore('reservations', {
  state: () => ({
    reservation: null,
    loadingCreate: false,
    loadingFetch: false,
    loadingCancel: false,
    error: '',
    successMessage: ''
  }),
  getters: {
    isLoading: (state) => state.loadingCreate || state.loadingFetch || state.loadingCancel
  },
  actions: {
    clearFeedback() {
      this.error = '';
      this.successMessage = '';
    },

    async createReservation(payload) {
      this.loadingCreate = true;
      this.clearFeedback();
      try {
        const { data } = await api.post('/reservations', payload);
        this.reservation = data;
        this.successMessage = data?.message || 'Réservation créée.';
        return data;
      } catch (error) {
        this.error = getApiErrorMessage(error, 'Impossible de créer la réservation.');
        return null;
      } finally {
        this.loadingCreate = false;
      }
    },

    async fetchReservationByToken(token) {
      this.loadingFetch = true;
      this.clearFeedback();
      try {
        const { data } = await api.get(`/reservations/by-token/${token}`);
        this.reservation = data;
        return data;
      } catch (error) {
        this.reservation = null;
        this.error = getApiErrorMessage(error, 'Réservation introuvable.');
        return null;
      } finally {
        this.loadingFetch = false;
      }
    },

    async cancelReservation({ reservationId, token }) {
      this.loadingCancel = true;
      this.clearFeedback();
      try {
        const { data } = await api.patch(`/reservations/${reservationId}/cancel`, { token });
        this.reservation = data?.reservation ?? null;
        this.successMessage = data?.message || 'Réservation annulée.';
        return data;
      } catch (error) {
        this.error = getApiErrorMessage(error, 'Impossible d\'annuler la réservation.');
        return null;
      } finally {
        this.loadingCancel = false;
      }
    }
  }
});
