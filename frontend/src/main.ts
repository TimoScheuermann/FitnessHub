import * as TCComponents from 'tccomponents_vue';
import 'tccomponents_vue/lib/tccomponents_vue.css';
import Vue from 'vue';
import { Route } from 'vue-router';
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
  const possibleToken = to.query.fpToken as string;
  if (possibleToken) {
    persistLogin(possibleToken);
    window.location.replace(window.location.href.split('?')[0]);
    return;
  }

  if (!store.getters.valid && (await verfiyUser())) {
    store.commit('signIn', getUserFromJWT());
  }

  next();
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
