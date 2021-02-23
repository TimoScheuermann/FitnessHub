/* eslint-disable */
import App from '@/App.vue';
import router, { getTitle } from '@/router';
import store from '@/store';
import io from 'socket.io-client';
import * as TCComponents from 'tccomponents_vue';
import 'tccomponents_vue/lib/tccomponents_vue.css';
import Vue from 'vue';
import { Route } from 'vue-router';
import VueSocketIOExt from 'vue-socket.io-extended';
import { VNode } from 'vue/types/umd';
import './registerServiceWorker';
import { getUserFromJWT, verfiyUser } from './utils/auth';
import { backendURL } from './utils/constants';
import { closeFullscreen, getDepth, openFullscreen } from './utils/functions';

Vue.config.productionTip = false;

Vue.prototype.$oFS = openFullscreen;
Vue.prototype.$cFS = closeFullscreen;

for (const component in TCComponents) {
  Vue.component(component, TCComponents[component]);
}

export const socket = io(backendURL);
Vue.use(VueSocketIOExt, socket);

// console.log(getToken());

router.beforeEach(async (to: Route, from: Route, next: Function) => {
  const toDepth = getDepth(to);
  const fromDepth = getDepth(from);
  const toPath = to.fullPath.split('/').slice(0, 2);
  const fromPath = from.fullPath.split('/').slice(0, 2);

  if (to.meta.fullscreen) {
    store.commit('routeTransition', 'slide-fullscreen');
  } else if (fromPath.join('/') !== toPath.join('/')) {
    store.commit('routeTransition', 'slide-bottom');
  } else {
    store.commit(
      'routeTransition',
      toDepth < fromDepth ? 'slide-right' : 'slide-left'
    );
  }

  if (!store.getters.valid && (await verfiyUser())) {
    store.commit('signIn', getUserFromJWT());
  }

  if (to.meta.needsSignIn && !store.getters.valid) {
    openFullscreen('login', undefined, undefined, to);
  }

  if (to.name === 'login' && store.getters.valid) {
    await next({ name: 'profile' });
  }

  const title = getTitle(to);
  document.title = title;

  const gt = document.querySelector('meta[name="title"]');
  if (gt) gt.setAttribute('content', title);

  const twitter = document.querySelector('meta[property="twitter:title"]');
  if (twitter) twitter.setAttribute('content', title);

  const og = document.querySelector('meta[property="og:title"]');
  if (og) og.setAttribute('content', title);

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
  router,
  store,
  render: h => h(App)
}).$mount('#app');
