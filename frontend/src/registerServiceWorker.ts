/* eslint-disable no-console */

import { register } from 'register-service-worker';
import { EventBus } from './utils/eventbus';

if (process.env.NODE_ENV === 'production') {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready() {
      console.log(
        'App is being served from cache by a service worker.\n' +
          'For more details, visit https://goo.gl/AFskqB'
      );
    },
    registered() {
      console.log('Service worker has been registered.');
    },
    cached() {
      console.log('Content has been cached for offline use.');
    },
    updatefound() {
      console.log('New content is downloading.');
    },
    updated(registration: ServiceWorkerRegistration) {
      if (registration && registration.waiting) {
        EventBus.$emit('modal-update-available', registration);
      }
    },
    offline() {
      console.log(
        'No internet connection found. App is running in offline mode.'
      );
    },
    error(error) {
      console.error('Error during service worker registration:', error);
    }
  });
}

navigator.serviceWorker.addEventListener(
  'controllerchange',
  () => window.location.reload(),
  { once: true }
);
