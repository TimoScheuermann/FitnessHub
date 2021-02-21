import Vue from 'vue';
import VueRouter, { Route } from 'vue-router';

Vue.use(VueRouter);
const prefix = 'FitnessHub | ';

const router = new VueRouter({
  scrollBehavior() {
    return { x: 0, y: 0 };
  },
  mode: 'history',

  routes: [
    {
      path: '/community',
      component: () => import('@/views-interim/Community-Interim.vue'),
      children: [
        {
          path: '',
          name: 'community',
          component: () => import('@/views/community/Community.vue'),
          meta: {
            title: prefix + 'Community'
          }
        },
        { path: '*', redirect: { name: 'community' } }
      ]
    },
    {
      path: '/profile',
      component: () => import('@/views-interim/Profile-Interim.vue'),
      children: [
        {
          path: '',
          name: 'profile',
          component: () => import('@/views/profile/Profile.vue'),
          meta: {
            title: prefix + 'Profile'
          }
        },
        { path: '*', redirect: { name: 'profile' } }
      ]
    },
    {
      path: '/training',
      component: () => import('@/views-interim/Training-Interim.vue'),
      children: [
        {
          path: '',
          name: 'training',
          component: () => import('@/views/training/Training.vue'),
          meta: {
            title: prefix + 'Training',
            hero: 'Training'
          }
        },
        {
          path: 'guide',
          name: 'muscle-guide',
          component: () => import('@/views/training/Guide.vue'),
          meta: {
            title: prefix + 'Muskelguide',
            hero: 'Muskelguide'
          }
        },
        {
          path: 'muscle/:muscle',
          name: 'muscle-exercises',
          component: () => import('@/views/training/Muscle.vue'),
          meta: {
            title: prefix + 'Muskel',
            hero: '%muscle%'
          }
        },
        { path: '*', redirect: { name: 'training' } }
      ]
    },
    {
      path: '/nutrition',
      component: () => import('@/views-interim/Nutrition-Interim.vue'),
      children: [
        {
          path: '',
          name: 'nutrition',
          component: () => import('@/views/nutrition/Nutrition.vue'),
          meta: {
            title: prefix + 'Nutrition'
          }
        },
        {
          path: 'tipps',
          name: 'nutrition-tipps',
          component: () => import('@/views/nutrition/Tipps.vue'),
          meta: {
            title: prefix + 'Ernährungstipps',
            hero: 'Ernährungstipps'
          }
        },
        { path: '*', redirect: { name: 'nutrition' } }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login/Login.vue'),
      meta: {
        title: prefix + 'Login',
        fullscreen: true
      }
    },
    {
      path: '/search-exercise',
      name: 'search-exercise',
      component: () => import('@/views/search/SearchExercise.vue'),
      meta: {
        title: prefix + 'Search',
        fullscreen: true
      }
    },
    {
      path: '/exercise/:id',
      name: 'exercise-details',
      component: () => import('@/views/exercise/Exercise.vue'),
      meta: {
        title: prefix + 'Exercise',
        fullscreen: true
      }
    },
    {
      path: '/recipe/:id',
      name: 'recipe-details',
      component: () => import('@/views/recipe/Recipe.vue'),
      meta: {
        title: prefix + 'Recipe',
        fullscreen: true
      }
    },
    {
      path: '/',
      component: () => import('@/views-interim/Home-Interim.vue'),
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('@/views/home/Home.vue'),
          meta: {
            title: prefix + 'Home'
          }
        },
        { path: '*', redirect: { name: 'home' } }
      ]
    },
    { path: '*', redirect: { name: 'home' } }
  ]
});

export default router;

export function getTitle(route: Route = router.currentRoute): string {
  const name: string = route.meta.title;
  if (!name) prefix;
  return name;
}
