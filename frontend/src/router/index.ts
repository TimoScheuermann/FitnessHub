import ManagementInterim from '@/views-interim/ManagementInterim.vue';
import ProfileInterim from '@/views-interim/ProfileInterim.vue';
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
      path: '/training',
      name: 'training',
      component: () => import('@/views/Training.vue')
    },
    {
      path: '/playground',
      name: 'playground',
      component: () => import('@/views/Playground.vue')
    },
    {
      path: '/profile',
      component: ProfileInterim,
      children: [
        {
          path: '',
          name: 'profile',
          component: () => import('@/views/profile/Profile.vue'),
          meta: {
            needsSignIn: true,
            title: 'Profil'
          }
        },
        {
          path: 'friends',
          name: 'friends',
          component: () => import('@/views/profile/Friends.vue'),
          meta: {
            needsSignIn: true,
            title: 'Freunde'
          }
        },
        {
          path: 'inbox',
          name: 'inbox',
          component: () => import('@/views/profile/Inbox.vue'),
          meta: {
            needsSignIn: true,
            title: 'Inbox'
          }
        },
        {
          path: 'health',
          name: 'health',
          component: () => import('@/views/profile/Health.vue'),
          meta: {
            needsSignIn: true,
            title: 'Gesundheit'
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
            allowedGroups: ['admin'],
            title: 'Promote User'
          }
        },
        {
          path: 'submitted-exercises',
          name: 'submittedExercises',
          component: () => import('@/views/management/SubmittedExercises.vue'),
          meta: {
            needsSignIn: true,
            allowedGroups: ['admin', 'moderator'],
            title: 'Eingereichte Übungen'
          }
        },
        {
          path: 'statistics',
          name: 'statistics',
          component: () => import('@/views/management/Statistics.vue'),
          meta: {
            needsSignIn: true,
            allowedGroups: ['admin', 'moderator'],
            title: 'Statistik'
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
