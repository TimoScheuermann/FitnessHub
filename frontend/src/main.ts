import io from 'socket.io-client';
import * as TCComponents from 'tccomponents_vue';
import 'tccomponents_vue/lib/tccomponents_vue.css';
import Vue from 'vue';
import { Route } from 'vue-router';
import VueSocketIOExt from 'vue-socket.io-extended';
import { VNode } from 'vue/types/umd';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
import { getUserFromJWT, persistLogin, verfiyUser } from './utils/auth';
import axios from './utils/axios';
import { backendURL } from './utils/constants';
import { IMessage } from './utils/interfaces';

const socket = io(backendURL, { autoConnect: false });

Vue.use(VueSocketIOExt, socket);

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
    console.log('Found token');
    persistLogin(possibleToken);
    window.location.replace(window.location.href.split('?')[0]);
    return;
  }

  if (!store.getters.valid && (await verfiyUser())) {
    store.commit('signIn', getUserFromJWT());
    // const notificaitons: ITotalMessages = (await axios.get('inbox/total')).data;
    // store.commit('setNotifications', notificaitons);
    axios.get('friends').then(res => {
      store.commit('setFriends', res.data);
    });
    axios.get('message').then(res => {
      res.data.forEach((x: IMessage) => store.commit('addMessage', x));
    });
    socket.open();
  }

  if (to.name === 'login' && store.getters.valid) {
    next({ name: 'profile' });
    return;
  }

  if (to.meta.needsSignIn && !store.getters.valid) {
    next(from);
    return;
  }

  if (to.meta.allowedGroups) {
    if (
      !(
        store.getters.valid &&
        to.meta.allowedGroups.includes(store.getters.user.group.toLowerCase())
      )
    ) {
      next(from);
      return;
    }
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
