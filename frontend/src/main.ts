import * as TCComponents from 'tccomponents_vue';
import 'tccomponents_vue/lib/tccomponents_vue.css';
import Vue from 'vue';
import { Route } from 'vue-router';
import { VNode } from 'vue/types/umd';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
import { getUserFromJWT, persistLogin, verfiyUser } from './utils/auth';

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
    window.location.replace(window.location.href.split('?')[0]);
    return;
  }

  if (!store.getters.valid && (await verfiyUser())) {
    store.commit('signIn', getUserFromJWT());
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
      !store.getters.valid ||
      !to.meta.allowedGroups.includes(store.getters.user.group.toLowerCase())
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
  router,
  store,
  render: h => h(App)
}).$mount('#app');
