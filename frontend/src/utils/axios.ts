import store from '@/store';
import Axios from 'axios';
import { getToken } from './auth';
import { backendURL } from './constants';

const axios = Axios.create({
  timeout: 5000,
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
  () => {
    store.state.openRequests--;
  }
);
axios.interceptors.response.use(config => {
  store.state.openRequests--;
  return config;
});

export default axios;
