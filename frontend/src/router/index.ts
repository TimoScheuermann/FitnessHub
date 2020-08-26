import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/Home.vue')
    },
    {
      path: '/community',
      name: 'community',
      component: () => import('@/views/Community.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login.vue')
    },
    {
      path: '/nutrition',
      name: 'nutrition',
      component: () => import('@/views/Nutrition.vue')
    },
    {
      path: '/search',
      name: 'search',
      component: () => import('@/views/Search.vue')
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/Profile.vue'),
      meta: {
        needsSignIn: true
      }
    },
    {
      path: '*',
      redirect: { name: 'home' }
    }
  ]
});

export default router;
