import EmptyRouter from '@/views-interim/EmptyRouter.vue';
import ManagementInterim from '@/views-interim/ManagementInterim.vue';
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
      path: '/playground',
      name: 'playground',
      component: () => import('@/views/Playground.vue')
    },
    {
      path: '/profile',
      component: EmptyRouter,
      children: [
        {
          path: '',
          name: 'profile',
          component: () => import('@/views/profile/Profile.vue'),
          meta: {
            needsSignIn: true
          }
        },
        {
          path: 'friends',
          name: 'friends',
          component: () => import('@/views/profile/Friends.vue'),
          meta: {
            needsSignIn: true
          }
        }
      ]
    },
    {
      path: '/management',
      component: ManagementInterim,
      children: [
        {
          path: 'promote-user',
          name: 'promoteUser',
          component: () => import('@/views/management/PromoteUser.vue'),
          meta: {
            needsSignIn: true,
            allowedGroups: ['admin']
          }
        },
        {
          path: 'submitted-exercises',
          name: 'submittedExercises',
          component: () => import('@/views/management/SubmittedExercises.vue'),
          meta: {
            needsSignIn: true,
            allowedGroups: ['admin', 'moderator']
          }
        },
        {
          path: 'statistics',
          name: 'statistics',
          component: () => import('@/views/management/Statistics.vue'),
          meta: {
            needsSignIn: true,
            allowedGroups: ['admin', 'moderator']
          }
        },
        {
          path: 'support-tickets',
          name: 'supportTickets',
          component: () => import('@/views/management/SupportTickets.vue'),
          meta: {
            needsSignIn: true,
            allowedGroups: ['admin', 'moderator']
          }
        }
      ]
    },
    {
      path: '*',
      redirect: { name: 'home' }
    }
  ]
});

export default router;
