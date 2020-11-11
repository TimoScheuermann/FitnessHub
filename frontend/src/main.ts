import io from 'socket.io-client';
import * as TCComponents from 'tccomponents_vue';
import 'tccomponents_vue/lib/tccomponents_vue.css';
import Vue from 'vue';
import { Route } from 'vue-router';
import VueSocketIOExt from 'vue-socket.io-extended';
import { VNode } from 'vue/types/umd';
import App from './App.vue';
import FHAvatar from './components/shared/FH-Avatar.vue';
import FHCarousel from './components/shared/FH-Carousel.vue';
import FHMobileHeader from './components/shared/FH-Mobile-Header.vue';
import FHUserList from './components/shared/user-list/FH-UserList.vue';
import FHUserListItem from './components/shared/user-list/FH-UserListItem.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
import { getUserFromJWT, persistLogin, verfiyUser } from './utils/auth';
import axios from './utils/axios';
import { backendURL, fhBotId } from './utils/constants';
import { EventBus } from './utils/eventbus';
import { getCategory, getFriend, getMuscle } from './utils/functions';
import {
  IExercise,
  IMessage,
  IPendingFriendship,
  IRecipe,
  IUserInfo,
  IWorkout
} from './utils/interfaces';

// prepare socket connection
const socket = io(backendURL, { autoConnect: false });
Vue.use(VueSocketIOExt, socket);

// load global components
Vue.component('fh-mobile-header', FHMobileHeader);
Vue.component('fh-avatar', FHAvatar);
Vue.component('fh-user-list', FHUserList);
Vue.component('fh-user-list-item', FHUserListItem);
Vue.component('fh-carousel', FHCarousel);

Vue.config.productionTip = false;

// load tc components
for (const component in TCComponents) {
  Vue.component(component, TCComponents[component]);
}

// scroll to top after route change
router.afterEach(() => {
  window.scrollTo({ top: 0 });
  document.querySelectorAll('.child-view').forEach(x => x.scrollTo({ top: 0 }));
});

router.beforeEach(async (to: Route, from: Route, next: Function) => {
  // determine route transition
  const toDepth = to.meta.level || 0;
  const fromDepth = from.meta.level || 0;
  store.commit(
    'routeTransition',
    toDepth < fromDepth ? 'slide-right' : 'slide-left'
  );

  // check for login token
  const possibleToken = to.query.fhToken as string;
  if (possibleToken) {
    persistLogin(possibleToken);
  }

  // login if authorized
  if (!store.getters.valid && (await verfiyUser())) {
    store.commit('signIn', getUserFromJWT());
    // open current workout if prev. started
    EventBus.$emit('modal-start-workout-returning', true);

    // load messages
    axios.get('message').then(res => {
      res.data.forEach((x: IMessage) => store.commit('addMessage', x));
    });

    // load friends
    axios.get('friends').then(res => {
      res.data.forEach((x: IUserInfo) => store.commit('addFriend', x));
    });

    // load invitations
    axios.get('friends/invitations').then(res => {
      res.data.forEach((x: IPendingFriendship) =>
        store.commit('addFriendRequest', x)
      );
    });

    // load created exercises
    axios.get('exercise/mine').then(res => {
      res.data.forEach((x: IExercise) => store.commit('manageExercise', x));
    });

    // load recent exercises
    axios.get('exercise/recent').then(res => {
      res.data.forEach((x: IExercise) => store.commit('addRecentExercise', x));
    });

    // load created workouts
    axios.get('workout').then(res => {
      res.data.forEach((x: IWorkout) => store.commit('manageWorkout', x));
    });

    // load health and training charts
    axios.get('charts').then(res => {
      store.commit('setWorkoutCharts', res.data);
    });

    // load created recipes
    axios.get('recipe/mine').then(res => {
      res.data.forEach((x: IRecipe) => store.commit('addRecipe', x));
    });

    // load liked recipes
    axios.get('recipe/liked').then(res => {
      res.data.forEach((x: IRecipe) => store.commit('addFavedRecipe', x));
    });

    // load trainingplan
    axios.get('trainingplan/full').then(res => {
      store.commit('setTrainingplan', res.data);
    });

    // load weight
    axios.get('health/height').then(res => {
      if (res.data) store.commit('setHeight', res.data.value);
    });

    // load exercise submissions
    if (['Admin', 'Moderator'].includes(store.getters.user.group)) {
      axios.get('exercise/submissions').then(res => {
        res.data.forEach((x: IExercise) =>
          store.commit('manageExerciseSubmission', x)
        );
      });
    }

    // open sockets
    socket.open();
  }

  // forward to profile if already signed in
  if (to.name === 'login' && store.getters.valid) {
    next({ name: 'profile' });
    return;
  }

  // forward to login if not signed in
  if (to.name === 'profile' && !store.getters.valid) {
    next({ name: 'login' });
    return;
  }

  // dont load route if users needs to be signed in
  if (to.meta.needsSignIn && !store.getters.valid) {
    next(from);
    return;
  }

  // check if target is friend with user
  if (to.name === 'chatroom' || to.name === 'friend') {
    if (to.name === 'chatroom' && to.params.id === fhBotId) {
      next();
      return;
    }
    if (!getFriend(to.params.id)) {
      next({ name: 'friends' });
      return;
    }
  }

  // only allow edit if exercise has been reviewed
  if (
    to.name === 'editExercise' &&
    (store.getters.exercises as IExercise[]).filter(
      x => x._id === to.params.id && x.reviewed
    ).length !== 1
  ) {
    next(from);
    return;
  }

  // check if muscle exists
  if (to.name === 'training-muscle' && !getMuscle(to.params.muscle)) {
    next(from);
    return;
  }

  // check if nutrition-category exists
  if (to.name === 'nutrition-category' && !getCategory(to.params.category)) {
    next(from);
    return;
  }

  // check if user has required group
  if (
    to.meta.allowedGroups &&
    !(
      store.getters.valid &&
      to.meta.allowedGroups.includes(store.getters.user.group.toLowerCase())
    )
  ) {
    next(from);
    return;
  }

  if (possibleToken) {
    next({ name: 'profile' });
    return;
  }

  // close all modals
  EventBus.$emit('modals-close');

  next();
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
  sockets: {
    // tell backend which user has connected after login
    connect() {
      socket.emit('join', getUserFromJWT()._id);
    }
  },
  router,
  store,
  render: h => h(App)
}).$mount('#app');
