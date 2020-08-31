import Axios from 'axios';
import { getToken } from './auth';
import { backendURL } from './constants';

export default Axios.create({
  timeout: 5000,
  headers: {
    Authorization: `Bearer ${getToken()}`
  },
  baseURL: backendURL
});
