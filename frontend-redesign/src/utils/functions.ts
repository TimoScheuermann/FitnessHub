import router from '@/router';
import store from '@/store';
import { Route } from 'vue-router';
import { Dictionary } from 'vue-router/types/router';

function getCurrentRoute(): Route {
  return router.currentRoute;
}

export function copyToClipboard(text: string) {
  const dummy = document.createElement('textarea');
  document.body.appendChild(dummy);
  dummy.value = text;
  dummy.select();
  document.execCommand('copy');
  document.body.removeChild(dummy);
}

export function getDepth(route: Route): number {
  let path = route.fullPath;
  if (path.endsWith('/')) path = path.slice(0, -1);
  return path.split('/').length;
}

type Query =
  | Dictionary<string | (string | null)[] | null | undefined>
  | undefined;

export function openFullscreen(
  name: string,
  params?: Dictionary<string> | undefined,
  query?: Query
): void {
  if (getCurrentRoute().name !== name) {
    store.commit('storeRoute', { key: name, route: getCurrentRoute() });
    router.push({ name: name, params: params, query: query });
  }
}

export function closeFullscreen(fallback: string): void {
  const key = getCurrentRoute().name || '';
  const storedRoute: Route | null = { ...store.state.storedRoutes[key] };

  store.commit('storeRoute', { key: key, route: null });

  if (storedRoute) {
    const { name, params, query } = storedRoute;

    if (name && name !== getCurrentRoute().name) {
      router.push({ name: name, params: params, query: query });
      return;
    }
  }

  if (fallback && getCurrentRoute().name !== fallback) {
    router.push({ name: fallback });
  }
}

export async function addExerciseToWorkout(id: string): Promise<void> {
  if (!store.getters.valid) {
    openFullscreen('login');
    return;
  }
  console.log(id);
}
