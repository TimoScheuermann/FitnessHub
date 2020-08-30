import Axios from 'axios';
import { getToken } from './auth';

export default Axios.create({
  timeout: 2000,
  headers: {
    Authorization: `Bearer ${getToken()}`
  },
  baseURL: 'http://localhost:3000/'
  // baseURL: 'https://api.timos.design:3000/'
});
