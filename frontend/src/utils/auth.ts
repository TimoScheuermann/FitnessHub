import router from '@/router';
import store from '@/store';
import { IUser } from './interfaces';

/**
 * returns saved login token
 */
export function getToken(): string | null {
  return localStorage.getItem('fitnesshub-auth');
}

/**
 * returns user data from jwt
 */
export function getUserFromJWT(): IUser {
  const base64Url = (getToken() || 'A.B.C').split('.')[1];
  const base64 = base64Url.replace('-', '+').replace('_', '/');
  return JSON.parse(window.atob(base64));
}

/**
 * login via
 * @param provider google, github, steam, etc..
 */
export function signIn(provider = 'google') {
  localStorage.removeItem('fitnesshub-auth');
  window.location.replace('https://api.timos.design:3000/auth/' + provider);
}

/**
 * sign user out
 */
export function signOut() {
  localStorage.removeItem('fitnesshub-auth');
  store.commit('signOut');
  router.push({ name: 'home' });
}

/**
 * verfiy a users login
 */
export async function verfiyUser(): Promise<boolean> {
  const token: string | null = getToken();

  // if no token provided he's not authenticated
  if (!token) return false;

  const options = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  };

  // check token
  const res = await fetch(
    'https://api.timos.design:3000/user/verify',
    options
  ).then(res => res.json());

  // token not accepted => sign out
  if (res.statusCode && res.statusCode === 401) {
    localStorage.removeItem('fitnesshub-auth');
    store.commit('signOut');
    return false;
  }

  // token accepted
  return true;
}

// store token in local storage
export function persistLogin(token: string): void {
  localStorage.setItem('fitnesshub-auth', token);
}
