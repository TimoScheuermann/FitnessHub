import io from 'socket.io-client';
import * as TCComponents from 'tccomponents_vue';
import 'tccomponents_vue/lib/tccomponents_vue.css';
import Vue from 'vue';
import { Route } from 'vue-router';
import VueSocketIOExt from 'vue-socket.io-extended';
import { VNode } from 'vue/types/umd';
import App from './App.vue';
import FHAvatar from './components/shared/FH-Avatar.vue';
import FHMobileHeader from './components/shared/FH-Mobile-Header.vue';
import FHUserList from './components/shared/user-list/FH-UserList.vue';
import FHUserListItem from './components/shared/user-list/FH-UserListItem.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
import { getUserFromJWT, persistLogin, verfiyUser } from './utils/auth';
import axios from './utils/axios';
import { backendURL, fhBotId } from './utils/constants';
import { getFriend } from './utils/functions';
import {
  IExercise,
  IMessage,
  IPendingFriendship,
  IUserInfo
} from './utils/interfaces';

const socket = io(backendURL, { autoConnect: false });
Vue.use(VueSocketIOExt, socket);
Vue.component('fh-mobile-header', FHMobileHeader);
Vue.component('fh-avatar', FHAvatar);
Vue.component('fh-user-list', FHUserList);
Vue.component('fh-user-list-item', FHUserListItem);

Vue.config.productionTip = false;

for (const component in TCComponents) {
  Vue.component(component, TCComponents[component]);
}

router.beforeEach(async (to: Route, from: Route, next: Function) => {
  const toDepth = to.meta.level || 0;
  const fromDepth = from.meta.level || 0;
  store.commit(
    'routeTransition',
    toDepth < fromDepth ? 'slide-right' : 'slide-left'
  );

  const possibleToken = to.query.fhToken as string;
  if (possibleToken) {
    persistLogin(possibleToken);
  }

  if (!store.getters.valid && (await verfiyUser())) {
    store.commit('signIn', getUserFromJWT());
    axios.get('message').then(res => {
      res.data.forEach((x: IMessage) => store.commit('addMessage', x));
    });
    axios.get('friends').then(res => {
      res.data.forEach((x: IUserInfo) => store.commit('addFriend', x));
    });
    axios.get('friends/invitations').then(res => {
      res.data.forEach((x: IPendingFriendship) =>
        store.commit('addFriendRequest', x)
      );
    });
    axios.get('exercise/mine').then(res => {
      res.data.forEach((x: IExercise) => store.commit('manageExercise', x));
    });
    axios.get('exercise/submissions').then(res => {
      res.data.forEach((x: IExercise) =>
        store.commit('manageExerciseSubmission', x)
      );
    });

    socket.open();
  }

  if (to.name === 'login' && store.getters.valid) {
    next({ name: 'profile' });
    return;
  }

  if (to.name === 'profile' && !store.getters.valid) {
    next({ name: 'login' });
    return;
  }

  if (to.meta.needsSignIn && !store.getters.valid) {
    next(from);
    return;
  }

  if (to.name === 'chatroom' || to.name === 'friend') {
    if (to.name === 'chatroom' && to.params.id === fhBotId) {
      next();
      return;
    }
    if (!getFriend(to.params.id)) {
      next(from);
      return;
    }
  }

  if (
    to.name === 'editExercise' &&
    (store.getters.exercises as IExercise[]).filter(x => x._id === to.params.id)
      .length !== 1
  ) {
    next({ name: 'exercises' });
    return;
  }

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

  next();
});

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
    connect() {
      socket.emit('join', getUserFromJWT()._id);
    }
  },
  router,
  store,
  render: h => h(App)
}).$mount('#app');
