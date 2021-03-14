import Login from '@/views/login/Login.vue';
import Recipe from '@/views/nutrition/Recipe.vue';
import Scanner from '@/views/nutrition/Scanner.vue';
import SearchRecipe from '@/views/nutrition/SearchRecipe.vue';
import WikiItem from '@/views/nutrition/WikiItem.vue';
import ChatRoom from '@/views/profile/ChatRoom.vue';
import UpdateExercise from '@/views/profile/exercise/UpdateExercise.vue';
import AddFriend from '@/views/profile/friends/AddFriend.vue';
import FriendDetails from '@/views/profile/friends/Details.vue';
import ExerciseSubmission from '@/views/profile/management/ExerciseSubmission.vue';
import UserSearch from '@/views/profile/management/UserSearch.vue';
import UpdateRecipe from '@/views/profile/recipe/UpdateRecipe.vue';
import UpdateTrainingplan from '@/views/profile/trainingplan/UpdateTrainingplan.vue';
import AddToWorkout from '@/views/profile/workout/AddToWorkout.vue';
import CreateWorkout from '@/views/profile/workout/CreateWorkout.vue';
import RunningWorkout from '@/views/profile/workout/RunningWorkout.vue';
import UpdateWorkout from '@/views/profile/workout/UpdateWorkout.vue';
import Exercise from '@/views/training/Exercise.vue';
import SearchExercise from '@/views/training/SearchExercise.vue';
import Workout from '@/views/training/Workout.vue';
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
    /**
     * => Start Fullscreen
     */

    {
      path: '/add-to-workout',
      name: 'add-to-workout',
      component: AddToWorkout,
      meta: {
        title: prefix + 'Übung hinzufügen',
        fullscreen: true,
        needsSignIn: true,
        fsFallback: 'training'
      }
    },
    {
      path: '/active-workout',
      name: 'run-workout',
      component: RunningWorkout,
      meta: {
        title: prefix + 'Workout',
        fullscreen: true,
        needsSignIn: true,
        fsFallback: 'workouts'
      }
    },
    {
      path: '/training/search',
      name: 'search-exercise',
      component: SearchExercise,
      meta: {
        title: prefix + 'Search',
        fullscreen: true,
        fsFallback: 'training'
      }
    },
    {
      path: '/nutrition/search',
      name: 'search-recipe',
      component: SearchRecipe,
      meta: {
        title: prefix + 'Search',
        fullscreen: true,
        fsFallback: 'nutrition'
      }
    },
    {
      path: '/training/exercise/:id',
      name: 'exercise-details',
      component: Exercise,
      meta: {
        title: prefix + 'Übung',
        fullscreen: true,
        fsFallback: 'training'
      }
    },
    {
      path: '/training/workout/:id',
      name: 'workout-details',
      component: Workout,
      meta: {
        title: prefix + 'Workout',
        fullscreen: true,
        fsFallback: 'training'
      }
    },
    {
      path: '/training/workout/:id/update',
      name: 'update-workout',
      component: UpdateWorkout,
      meta: {
        title: prefix + 'Workout bearbeiten',
        fullscreen: true,
        needsSignIn: true,
        fsFallback: 'workouts'
      }
    },
    {
      path: '/nutrition/scanner',
      name: 'food-scanner',
      component: Scanner,
      meta: {
        title: prefix + 'Obst / Gemüse Scanner',
        fullscreen: true,
        fsFallback: 'nutrition'
      }
    },
    {
      path: '/nutrition/recipe/:id',
      name: 'recipe-details',
      component: Recipe,
      meta: {
        title: prefix + 'Rezept',
        fullscreen: true,
        fsFallback: 'nutrition'
      }
    },
    {
      path: '/nutrition/recipe/:id/update',
      name: 'update-recipe',
      component: UpdateRecipe,
      meta: {
        title: prefix + 'Rezept anpassen',
        needsSignIn: true,
        fullscreen: true
      }
    },
    {
      path: '/nutrition/wiki/:id',
      name: 'nutrition-wiki-item',
      component: WikiItem,
      meta: {
        title: prefix + 'Ernährungswiki',
        fullscreen: true
      }
    },
    {
      path: '/training/exercise/:id/update',
      name: 'update-exercise',
      component: UpdateExercise,
      meta: {
        title: prefix + 'Übung anpassen',
        needsSignIn: true,
        fullscreen: true,
        fsFallback: 'exercises'
      }
    },
    {
      path: '/profile/messages/:friendId',
      name: 'chatroom',
      component: ChatRoom,
      meta: {
        title: prefix + 'ChatRoom',
        needsSignIn: true,
        fullscreen: true,
        fsFallback: 'messages'
      }
    },
    {
      path: '/profile/friends/add',
      name: 'add-friend',
      component: AddFriend,
      meta: {
        title: prefix + 'Freund hinzufügen',
        needsSignIn: true,
        fullscreen: true,
        fsFallback: 'friends'
      }
    },
    {
      path: '/profile/friends/:id',
      name: 'friend-details',
      component: FriendDetails,
      meta: {
        title: prefix + 'Freund',
        needsSignIn: true,
        fullscreen: true,
        fsFallback: 'friends'
      }
    },
    {
      path: '/profile/workouts/create',
      name: 'create-workout',
      component: CreateWorkout,
      meta: {
        title: prefix + 'Workout erstellen',
        needsSignIn: true,
        fullscreen: true,
        fsFallback: 'workouts'
      }
    },
    {
      path: '/profile/trainingplan/update/:day',
      name: 'update-trainingplan',
      component: UpdateTrainingplan,
      meta: {
        title: prefix + 'Trainingsplan ändern',
        needsSignIn: true,
        fullscreen: true,
        fsFallback: 'trainingplan'
      }
    },

    {
      path: '/profile/management/submissions/:id',
      name: 'exercise-submission',
      component: ExerciseSubmission,
      meta: {
        title: prefix + 'Eingereichte Übung',
        needsSignIn: true,
        groups: ['Admin', 'Moderator'],
        fullscreen: true,
        fsFallback: 'exercise-submissions'
      }
    },

    {
      path: '/profile/management/user-search',
      name: 'mgmt-user-search',
      component: UserSearch,
      meta: {
        title: prefix + 'Nutzer finden',
        needsSignIn: true,
        groups: ['Admin', 'Moderator'],
        fullscreen: true,
        fsFallback: 'profile'
      }
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
        title: prefix + 'Login',
        fullscreen: true,
        fsFallback: 'home'
      }
    },
    /**
     * <= Ende Fullscreen
     */
    {
      path: '/community',
      component: () => import('@/views-interim/Community-Interim.vue'),
      children: [
        {
          path: '',
          name: 'community',
          component: () => import('@/views/community/Community.vue'),
          meta: {
            title: prefix + 'Community',
            hero: 'Neueste Nachrichten'
          }
        },
        {
          path: 'create',
          name: 'create-post',
          component: () => import('@/views/community/CreatePost.vue'),
          meta: {
            title: prefix + 'Post erstellen',
            hero: 'Post erstellen',
            needsSignIn: true,
            groups: ['Admin', 'Moderator']
          }
        },
        {
          path: 'edit/:id',
          name: 'edit-post',
          component: () => import('@/views/community/EditPost.vue'),
          meta: {
            title: prefix + 'Post bearbeiten',
            hero: 'Post bearbeiten',
            needsSignIn: true,
            groups: ['Admin', 'Moderator']
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
            title: prefix + 'Profil',
            needsSignIn: true,
            hero: 'Profil'
          }
        },
        {
          path: 'settings',
          name: 'settings',
          component: () => import('@/views/profile/Settings.vue'),
          meta: {
            title: prefix + 'Einstellungen',
            needsSignIn: true,
            hero: 'Einstellungen'
          }
        },
        {
          path: 'messages',
          name: 'messages',
          component: () => import('@/views/profile/Messages.vue'),
          meta: {
            title: prefix + 'Nachrichten',
            needsSignIn: true,
            hero: 'Nachrichten'
          }
        },
        {
          path: 'friends',
          name: 'friends',
          component: () => import('@/views/profile/friends/Friends.vue'),
          meta: {
            title: prefix + 'Freunde',
            needsSignIn: true,
            hero: 'Freunde'
          }
        },

        {
          path: 'workouts',
          name: 'workouts',
          component: () => import('@/views/profile/workout/Workouts.vue'),
          meta: {
            title: prefix + 'Workouts',
            needsSignIn: true,
            hero: 'Workouts'
          }
        },
        {
          path: 'trainingplan',
          name: 'trainingplan',
          component: () =>
            import('@/views/profile/trainingplan/Trainingplan.vue'),
          meta: {
            title: prefix + 'Trainingsplan',
            needsSignIn: true,
            hero: 'Trainingsplan'
          }
        },
        {
          path: 'achievements',
          name: 'achievements',
          component: () => import('@/views/profile/Achievements.vue'),
          meta: {
            title: prefix + 'Erfolge',
            needsSignIn: true,
            hero: 'Erfolge'
          }
        },
        {
          path: 'telegram',
          name: 'telegram',
          component: () => import('@/views/profile/Telegram.vue'),
          meta: {
            title: prefix + 'Telegram',
            needsSignIn: true,
            hero: 'Telegram'
          }
        },
        {
          path: 'statistics',
          name: 'statistics',
          component: () => import('@/views/profile/Trainingstatistics.vue'),
          meta: {
            title: prefix + 'Trainingsstatistik',
            needsSignIn: true,
            hero: 'Trainingsstatistik'
          }
        },
        {
          path: 'recipes',
          name: 'recipes',
          component: () => import('@/views/profile/recipe/Recipes.vue'),
          meta: {
            title: prefix + 'Rezepte',
            needsSignIn: true,
            hero: 'Rezepte'
          }
        },
        {
          path: 'recipes/submit',
          name: 'submit-recipe',
          component: () => import('@/views/profile/recipe/SubmitRecipe.vue'),
          meta: {
            title: prefix + 'Rezept erstellen',
            needsSignIn: true,
            hero: 'Erstellen',
            backTitle: 'Rezepte',
            backRoute: 'recipes'
          }
        },
        {
          path: 'exercises',
          name: 'exercises',
          component: () => import('@/views/profile/exercise/Exercises.vue'),
          meta: {
            title: prefix + 'Übungen',
            needsSignIn: true,
            hero: 'Übungen'
          }
        },
        {
          path: 'exercises/submit',
          name: 'submit-exercise',
          component: () =>
            import('@/views/profile/exercise/SubmitExercise.vue'),
          meta: {
            title: prefix + 'Übung erstellen',
            needsSignIn: true,
            hero: 'Erstellen',
            backTitle: 'Übungen',
            backRoute: 'home'
          }
        },

        {
          path: 'management/submissions',
          name: 'exercise-submissions',
          component: () =>
            import('@/views/profile/management/ExerciseSubmissions.vue'),
          meta: {
            title: prefix + 'Eingereichte Übungen',
            needsSignIn: true,
            groups: ['Admin', 'Moderator'],
            hero: 'Eingereichte Übungen'
          }
        },
        {
          path: 'management/statistics',
          name: 'mgmt-statistics',
          component: () => import('@/views/profile/management/Statistics.vue'),
          meta: {
            title: prefix + 'Statistik',
            needsSignIn: true,
            groups: ['Admin', 'Moderator'],
            hero: 'Statistik'
          }
        },
        {
          path: 'management/suspend-user',
          name: 'mgmt-suspend-user',
          component: () => import('@/views/profile/management/SuspendUser.vue'),
          meta: {
            title: prefix + 'Nutzer sperren',
            needsSignIn: true,
            groups: ['Admin', 'Moderator'],
            hero: 'Nutzer sperren'
          }
        },
        {
          path: 'management/promote-user',
          name: 'mgmt-promote-user',
          component: () => import('@/views/profile/management/PromoteUser.vue'),
          meta: {
            title: prefix + 'Nutzer befördern',
            needsSignIn: true,
            groups: ['Admin'],
            hero: 'Nutzer befördern'
          }
        },
        {
          path: 'management/variables',
          name: 'mgmt-variables',
          component: () => import('@/views/profile/management/Variables.vue'),
          meta: {
            title: prefix + 'Variablen',
            needsSignIn: true,
            groups: ['Admin', 'Moderator'],
            hero: 'Variablen'
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
            hero: 'Muskel'
          }
        },
        {
          path: 'search-results',
          name: 'exercise-search-results',
          component: () => import('@/components/FHSearchResults.vue'),
          meta: {
            title: prefix + 'Suchergebnisse',
            hero: 'Suchergebnisse',
            backTitle: 'Suche',
            backRoute: 'search-exercise'
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
            title: prefix + 'Nutrition',
            hero: 'Rezepte'
          }
        },
        {
          path: 'wiki',
          name: 'nutrition-wiki',
          component: () => import('@/views/nutrition/Wiki.vue'),
          meta: {
            title: prefix + 'Ernährungswiki',
            hero: 'Ernährungswiki'
          }
        },
        {
          path: 'category/:category',
          name: 'recipe-category',
          component: () => import('@/views/nutrition/Category.vue'),
          meta: {
            title: prefix + 'Kategorie',
            hero: 'Kategorie'
          }
        },
        {
          path: 'search-results',
          name: 'recipe-search-results',
          component: () => import('@/components/FHSearchResults.vue'),
          meta: {
            title: prefix + 'Suchergebnisse',
            hero: 'Suchergebnisse',
            backTitle: 'Suche',
            backRoute: 'search-recipe'
          }
        },
        { path: '*', redirect: { name: 'nutrition' } }
      ]
    },
    {
      path: '/',
      component: () => import('@/views-interim/Home-Interim.vue'),
      name: 'home',
      meta: {
        title: prefix + 'Home',
        hero: 'FitnessHub'
      }
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
