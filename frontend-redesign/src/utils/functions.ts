import router from '@/router';
import store from '@/store';
import { Route } from 'vue-router';
import { Dictionary } from 'vue-router/types/router';
import backend from './backend';
import { anHour, days } from './constants';

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

/**
 * returns formatted time string
 * @param time seconds or timestamp
 */
/* eslint-disable */
export function formatDate(time: any): string {
  switch (typeof time) {
    case 'number':
      break;
    case 'string':
      time = +new Date(time);
      break;
    case 'object':
      if (time.constructor === Date) time = time.getTime();
      break;
    default:
      time = +new Date();
  }
  const time_formats = [
    [60, 'seconds', 1], // 60
    [120, '1 minute ago', '1 minute from now'], // 60*2
    [3600, 'minutes', 60], // 60*60, 60
    [7200, '1 hour ago', '1 hour from now'], // 60*60*2
    [86400, 'hours', 3600], // 60*60*24, 60*60
    [172800, 'Yesterday', 'Tomorrow'], // 60*60*24*2
    [604800, 'days', 86400], // 60*60*24*7, 60*60*24
    [1209600, 'Last week', 'Next week'], // 60*60*24*7*4*2
    [2419200, 'weeks', 604800], // 60*60*24*7*4, 60*60*24*7
    [4838400, 'Last month', 'Next month'], // 60*60*24*7*4*2
    [29030400, 'months', 2419200], // 60*60*24*7*4*12, 60*60*24*7*4
    [58060800, 'Last year', 'Next year'], // 60*60*24*7*4*12*2
    [2903040000, 'years', 29030400], // 60*60*24*7*4*12*100, 60*60*24*7*4*12
    [5806080000, 'Last century', 'Next century'], // 60*60*24*7*4*12*100*2
    [58060800000, 'centuries', 2903040000] // 60*60*24*7*4*12*100*20, 60*60*24*7*4*12*100
  ];
  let seconds = (+new Date() - time) / 1000,
    token = 'ago',
    list_choice = 1;

  if (seconds == 0) {
    return 'Just now';
  }
  if (seconds < 0) {
    seconds = Math.abs(seconds);
    token = 'from now';
    list_choice = 2;
  }
  let i = 0,
    format;
  while ((format = time_formats[i++]))
    if (seconds < format[0]) {
      if (typeof format[2] == 'string') return (format as any)[list_choice];
      else
        return Math.floor(seconds / +format[2]) + ' ' + format[1] + ' ' + token;
    }
  return time;
}

/**
 * returns date or XX minutes ago, depending on time.
 * @param timestamp number
 */
export function formatTimeForMessage(timestamp: number): string {
  if (new Date().getTime() - timestamp < 3 * anHour)
    return formatDate(timestamp);
  return (
    days[new Date(timestamp).getDay()].substring(0, 2) +
    ' ' +
    [
      { day: 'numeric' },
      { month: 'short' },
      { hour: 'numeric', hour12: false },
      { minute: 'numeric' }
    ]
      .map(x => new Intl.DateTimeFormat('en-US', x).format(timestamp))
      .map(
        (x, i) =>
          (i === 3 ? (+x < 10 ? '0' + x : x) : x) +
          (i === 1 ? ', ' : i === 2 ? ':' : ' ')
      )
      .join('')
  );
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

export async function loadVariables(): Promise<void> {
  if (store.getters.variables) return;
  const { data } = await backend.get('variables');
  store.commit('variables', data);
}

export function extractInfoFromUrl(
  url: string
): { icon: string; name: string } | null {
  if (!url) return null;
  url = url.toLowerCase();
  if (url.includes('instagram')) {
    return {
      icon: 'instagram',
      name: 'Instagram'
    };
  }
  if (url.includes('youtube')) {
    return {
      icon: 'youtube',
      name: 'YouTube'
    };
  }
  if (url.includes('facebook')) {
    return {
      icon: 'facebook',
      name: 'FaceBook'
    };
  }
  return {
    icon: 'star',
    name: 'Original'
  };
}
