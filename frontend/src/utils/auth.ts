import store from '@/store';
import { IUser } from './interfaces';

export function getToken(): string | null {
  return localStorage.getItem('fitness-planner-auth');
}
export function getUserFromJWT(): IUser {
  const base64Url = (getToken() || 'A.B.C').split('.')[1];
  const base64 = base64Url.replace('-', '+').replace('_', '/');
  return JSON.parse(window.atob(base64));
}

export function signIn(provider = 'google') {
  localStorage.removeItem('fitness-planner-auth');
  window.location.replace('https://api.timos.design:3000/auth/' + provider);
}

export function signOut() {
  localStorage.removeItem('fitness-planner-auth');
  store.commit('signOut');
}

export async function verfiyUser(): Promise<boolean> {
  const token: string | null = getToken();
  if (!token) return false;

  const options = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  };

  const res = await fetch(
    'https://api.timos.design:3000/user/verify',
    options
  ).then(res => res.json());

  if (res.error) return false;
  return true;
}

export function persistLogin(token: string): void {
  localStorage.setItem('fitness-planner-auth', token);
}
