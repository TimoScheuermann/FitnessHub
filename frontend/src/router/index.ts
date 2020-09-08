import EmptyRouter from '@/views-interim/EmptyRouter.vue';
import LegalInterim from '@/views-interim/LegalInterim.vue';
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
      component: () => import('@/views/training/Training.vue'),
      meta: {
        level: 0
      }
    },
    {
      path: '/training/muscle/:muscle',
      name: 'training-muscle',
      component: () => import('@/views/training/Muscle.vue'),
      meta: {
        level: 1
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
          component: () => import('@/views/profile/friends/Friends.vue'),
          meta: {
            needsSignIn: true,
            title: 'Freunde',
            level: 1
          }
        },
        {
          path: 'friends/:id',
          name: 'friend',
          component: () => import('@/views/profile/friends/FriendDetail.vue'),
          meta: {
            needsSignIn: true,
            title: 'Freunde',
            level: 2
          }
        },
        {
          path: 'messages',
          name: 'messages',
          component: () => import('@/views/profile/messages/Messages.vue'),
          meta: {
            needsSignIn: true,
            title: 'Nachrichten',
            level: 1
          }
        },
        {
          path: 'messages/:id',
          name: 'chatroom',
          component: () => import('@/views/profile/messages/Chatroom.vue'),
          meta: {
            needsSignIn: true,
            title: 'Nachrichten',
            level: 2
          }
        },
        {
          path: 'highlights',
          name: 'highlights',
          component: () => import('@/views/profile/Highlights.vue'),
          meta: {
            needsSignIn: true,
            title: 'Highlights',
            level: 1
          }
        },
        {
          path: 'achievements',
          name: 'achievements',
          component: () => import('@/views/profile/Achievements.vue'),
          meta: {
            needsSignIn: true,
            title: 'Erfolge',
            level: 1
          }
        },
        {
          path: 'settings',
          name: 'settings',
          component: () => import('@/views/profile/Settings.vue'),
          meta: {
            needsSignIn: true,
            title: 'Einstellungen',
            level: 1
          }
        },
        {
          path: 'exercises',
          name: 'exercises',
          component: () => import('@/views/profile/exercises/Exercises.vue'),
          meta: {
            needsSignIn: true,
            title: 'Übungen',
            level: 1
          }
        },
        {
          path: 'exercises/submit',
          name: 'submitExercise',
          component: () =>
            import('@/views/profile/exercises/SubmitExercise.vue'),
          meta: {
            needsSignIn: true,
            title: 'Übung einreichen',
            level: 2
          }
        },
        {
          path: 'exercises/edit/:id',
          name: 'editExercise',
          component: () => import('@/views/profile/exercises/EditExercise.vue'),
          meta: {
            needsSignIn: true,
            title: 'Übung bearbeiten',
            level: 2
          }
        },
        {
          path: 'workouts',
          name: 'workouts',
          component: () => import('@/views/profile/Workouts.vue'),
          meta: {
            title: 'Workouts',
            level: 1
          }
        },
        {
          path: 'suspended',
          name: 'suspended',
          component: () => import('@/views/profile/Suspended.vue'),
          meta: {
            title: 'Gesperrt',
            level: 1
          }
        },
        {
          path: 'management',
          component: EmptyRouter,
          children: [
            {
              path: 'promote-user',
              name: 'promoteUser',
              component: () =>
                import('@/views/profile/management/PromoteUser.vue'),
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
              component: () =>
                import('@/views/profile/management/SubmittedExercises.vue'),
              meta: {
                needsSignIn: true,
                allowedGroups: ['admin', 'moderator'],
                title: 'Review',
                level: 1
              }
            },
            {
              path: 'statistics',
              name: 'statistics',
              component: () =>
                import('@/views/profile/management/Statistics.vue'),
              meta: {
                needsSignIn: true,
                allowedGroups: ['admin', 'moderator'],
                title: 'Statistik',
                level: 1
              }
            },
            {
              path: 'suspend-user',
              name: 'suspendUser',
              component: () =>
                import('@/views/profile/management/SuspendUser.vue'),
              meta: {
                needsSignIn: true,
                allowedGroups: ['admin', 'moderator'],
                title: 'Suspend User',
                level: 1
              }
            }
          ]
        }
      ]
    },
    {
      path: '/legal',
      component: LegalInterim,
      children: [
        {
          path: 'privacy',
          name: 'privacy',
          component: () => import('@/views/legal/PrivacyPolicy.vue'),
          meta: {
            title: 'Privacy Policy'
          }
        },
        {
          path: 'terms',
          name: 'terms',
          component: () => import('@/views/legal/TermsOfUse.vue'),
          meta: {
            title: 'Terms of Use'
          }
        },
        {
          path: 'impressum',
          name: 'impressum',
          component: () => import('@/views/legal/Impressum.vue'),
          meta: {
            title: 'Impressum'
          }
        },
        {
          path: '',
          redirect: { name: 'home' }
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
