/* eslint-disable */
import App from '@/App.vue';
import router, { getTitle } from '@/router';
import store from '@/store';
import io from 'socket.io-client';
import * as TCComponents from 'tccomponents_vue';
import 'tccomponents_vue/lib/tccomponents_vue.css';
import Vue from 'vue';
import VueMasonry from 'vue-masonry-css';
import { Route } from 'vue-router';
import VueScrollReveal from 'vue-scroll-reveal';
import VueSocketIOExt from 'vue-socket.io-extended';
import { VNode } from 'vue/types/umd';
import './registerServiceWorker';
import { getUserFromJWT, verfiyUser } from './utils/auth';
import { backendURL } from './utils/constants';
import {
  closeFullscreen,
  handleDetailViewPreload,
  openFullscreen,
  shareExercise,
  shareNutritionplan,
  shareRecipe,
  shareWorkout
} from './utils/functions';
import { WorkoutManagement } from './utils/WorkoutManagement';

Vue.config.productionTip = false;

Vue.prototype.$oFS = openFullscreen;
Vue.prototype.$cFS = closeFullscreen;
Vue.prototype.$sE = shareExercise;
Vue.prototype.$sR = shareRecipe;
Vue.prototype.$sW = shareWorkout;
Vue.prototype.$sP = shareNutritionplan;

Vue.use(VueMasonry);
Vue.use(VueScrollReveal, {
  duration: 1000,
  scale: 0.9,
  opacity: 0,
  distance: '350px',
  delay: 0,
  origin: 'bottom',
  viewOffset: {
    bottom: 200
  }
});

for (const component in TCComponents) {
  Vue.component(component, TCComponents[component]);
}

export const socket = io(backendURL);
Vue.use(VueSocketIOExt, socket);

if (
  WorkoutManagement.hasActiveWorkout() &&
  router.currentRoute.name !== 'run-workout'
) {
  openFullscreen('run-workout');
}

router.beforeEach(async (to: Route, from: Route, next: Function) => {
  if (!store.getters.valid && (await verfiyUser())) {
    store.commit('signIn', getUserFromJWT());
  }

  if (to.meta.needsSignIn && !store.getters.valid) {
    openFullscreen('login', undefined, undefined, to);
  } else if (
    to.meta.groups &&
    !(to.meta.groups as string[]).some(
      t => t.toLowerCase() === getUserFromJWT().group.toLowerCase()
    )
  ) {
    await next(from);
  } else if (to.name === 'login' && store.getters.valid) {
    await next({ name: 'profile' });
  } else {
    next();
  }
});

router.afterEach((to: Route) => {
  const title = getTitle(to);
  document.title = title;

  const gt = document.querySelector('meta[name="title"]');
  if (gt) gt.setAttribute('content', title);

  const twitter = document.querySelector('meta[property="twitter:title"]');
  if (twitter) twitter.setAttribute('content', title);

  const og = document.querySelector('meta[property="og:title"]');
  if (og) og.setAttribute('content', title);

  if (to.name === 'recipe-details') {
    handleDetailViewPreload(to.params.id, 'recipe', 'r');
  } else if (to.name === 'exercise-details') {
    handleDetailViewPreload(to.params.id, 'exercise', 'e');
  } else if (to.name === 'workout-details') {
    handleDetailViewPreload(to.params.id, 'workout', 'w');
  } else if (to.name === 'nutritionplan') {
    handleDetailViewPreload(to.params.id, 'nutritionplan', 'p');
  }
});

// show specific html-elements only for specfic groups
// eslint-disable-next-line
Vue.directive('group', (el: HTMLElement, binding: any, vnode: VNode) => {
  const showElement =
    store.getters.valid &&
    Object.keys(binding.modifiers).includes(
      store.getters.user.group.toLowerCase()
    );
  if (!showElement) {
    el.innerHTML = '';
    setTimeout(() => {
      el.remove();
    });
  }
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
