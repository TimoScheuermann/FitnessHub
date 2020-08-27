import Axios from 'axios';
import { getToken } from './auth';

export default Axios.create({
  timeout: 2000,
  headers: {
    Authorization: `Bearer ${getToken()}`
  },
  baseURL: 'https://api.timos.design:3000/'
});
