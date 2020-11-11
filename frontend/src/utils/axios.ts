import store from '@/store';
import Axios from 'axios';
import { cacheAdapterEnhancer } from 'axios-extensions';
import { getToken } from './auth';
import { backendURL } from './constants';

const axios = Axios.create({
  timeout: 30000,
  baseURL: backendURL,
  // eslint-disable-next-line
  adapter: cacheAdapterEnhancer(Axios.defaults.adapter as any)
});

axios.interceptors.request.use(
  config => {
    // show request in console during development
    if (process.env.NODE_ENV === 'development') {
      console.info('✉️ ', config.method?.toUpperCase() + ' ' + config.url);
    }
    config.headers = {
      Authorization: `Bearer ${getToken()}`
    };
    // increase amount of open requests
    store.state.openRequests++;
    return config;
  },
  error => {
    // decrease amount of open requests due errors
    store.state.openRequests--;
    return Promise.reject(error);
  }
);
axios.interceptors.response.use(
  // decrease amount of open requests
  config => {
    store.state.openRequests--;
    return config;
  },
  // decrease amount of open requests due errors
  error => {
    store.state.openRequests--;
    return Promise.reject(error);
  }
);

export default axios;
