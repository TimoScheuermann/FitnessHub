import store from '@/store';
import Axios from 'axios';
import { getToken } from './auth';
import { backendURL } from './constants';

const axios = Axios.create({
  timeout: 10000,
  baseURL: backendURL
});

axios.interceptors.request.use(
  config => {
    if (process.env.NODE_ENV === 'development') {
      console.info('✉️ ', config.method?.toUpperCase() + ' ' + config.url);
    }
    config.headers = {
      Authorization: `Bearer ${getToken()}`
    };
    store.state.openRequests++;
    return config;
  },
  error => {
    store.state.openRequests--;
    return Promise.reject(error);
  }
);
axios.interceptors.response.use(
  config => {
    store.state.openRequests--;
    return config;
  },
  error => {
    store.state.openRequests--;
    return Promise.reject(error);
  }
);

export default axios;
