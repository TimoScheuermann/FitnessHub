import router from '@/router';
import store from '@/store';
import { IUser } from './interfaces';

export function getToken(): string | null {
  return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZjQ2NjhjMGUwMGMyODBlM2E2OGM5NWMiLCJhdmF0YXIiOiJodHRwczovL2F2YXRhcnMwLmdpdGh1YnVzZXJjb250ZW50LmNvbS91LzQ4OTg2NTAzP3Y9NCIsImZhbWlseU5hbWUiOiIiLCJnaXZlbk5hbWUiOiJUaW1vU2NoZXVlcm1hbm4iLCJ0aGlyZFBhcnR5SWQiOiI0ODk4NjUwMyIsInByb3ZpZGVyIjoiZ2l0aHViIiwiZGF0ZSI6MTU5ODQ0OTg1Njk4OSwiZ3JvdXAiOiJBZG1pbiIsIl9fdiI6MCwiaWF0IjoxNTk4Njg5NzMwLCJleHAiOjE1OTg3MDc3MzB9.vKAIV47bhqkYscIpDspMPag0PHpx8wHbV5XReK0TYDg';
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
  router.push({ name: 'home' });
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
