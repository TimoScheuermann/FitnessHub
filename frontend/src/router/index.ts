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
      component: () => import('@/views/Home.vue'),
      meta: {
        level: 0
      }
    },
    {
      path: '/community',
      name: 'community',
      component: () => import('@/views/Community.vue'),
      meta: {
        level: 0
      }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login.vue'),
      meta: {
        level: 0
      }
    },
    {
      path: '/nutrition',
      name: 'nutrition',
      component: () => import('@/views/Nutrition.vue'),
      meta: {
        level: 0
      }
    },
    {
      path: '/training',
      name: 'training',
      component: () => import('@/views/Training.vue'),
      meta: {
        level: 0
      }
    },
    {
      path: '/playground',
      name: 'playground',
      component: () => import('@/views/Playground.vue'),
      meta: {
        level: 0
      }
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
            title: 'Profil',
            level: 0
          }
        },
        {
          path: 'friends',
          name: 'friends',
          component: () => import('@/views/profile/Friends.vue'),
          meta: {
            needsSignIn: true,
            title: 'Freunde',
            level: 1
          }
        },
        {
          path: 'inbox',
          name: 'inbox',
          component: () => import('@/views/profile/Inbox.vue'),
          meta: {
            needsSignIn: true,
            title: 'Inbox',
            level: 1
          }
        },
        {
          path: 'health',
          name: 'health',
          component: () => import('@/views/profile/Health.vue'),
          meta: {
            needsSignIn: true,
            title: 'Gesundheit',
            level: 1
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
            title: 'Promote User',
            level: 1
          }
        },
        {
          path: 'submitted-exercises',
          name: 'submittedExercises',
          component: () => import('@/views/management/SubmittedExercises.vue'),
          meta: {
            needsSignIn: true,
            allowedGroups: ['admin', 'moderator'],
            title: 'Eingereichte Übungen',
            level: 1
          }
        },
        {
          path: 'statistics',
          name: 'statistics',
          component: () => import('@/views/management/Statistics.vue'),
          meta: {
            needsSignIn: true,
            allowedGroups: ['admin', 'moderator'],
            title: 'Statistik',
            level: 1
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
