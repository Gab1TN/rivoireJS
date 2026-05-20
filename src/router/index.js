import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import RestaurantDetailView from '../views/RestaurantDetailView.vue';
import ReservationView from '../views/ReservationView.vue';
import ReservationTokenView from '../views/ReservationTokenView.vue';

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/restaurant/:id', name: 'restaurant-detail', component: RestaurantDetailView },
  { path: '/reservation', name: 'reservation', component: ReservationView },
  { path: '/reservation/token/:token', name: 'reservation-token', component: ReservationTokenView }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
