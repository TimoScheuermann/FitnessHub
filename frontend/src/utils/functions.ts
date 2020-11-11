import store from '@/store';
import axios from './axios';
import { aHour, days } from './constants';
import {
  IExercise,
  IFHNotification,
  IRecipe,
  IUser,
  IUserInfo,
  IVariable,
  IWorkout
} from './interfaces';

/**
 * copies a string to the clipboard
 * @param data string
 */
export function copyToClipboard(data: string) {
  const el = document.createElement('textarea');
  el.value = data;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
}

/**
 * returns users full name
 * @param user IUser | IUserInfo
 */
export function getUserName(user: IUserInfo | IUser): string | null {
  if (!user) return null;
  if ((user as IUserInfo).username) return (user as IUserInfo).username;
  return [(user as IUser).givenName, (user as IUser).familyName]
    .filter(x => !!x)
    .join(' ');
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
  if (new Date().getTime() - timestamp < 3 * aHour)
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

export function sendNotification(notification: IFHNotification): void {
  store.commit('sendNotification', notification);
}

export function getFriendName(id: string): string {
  const friend = getFriend(id);
  if (friend) return friend.username;
  return 'FitnessHub';
}

export function getFriendAvatar(id: string): string | undefined {
  const friend = getFriend(id);
  if (friend) return friend.avatar;
  return undefined;
}

export function getFriend(id: string): IUserInfo | undefined {
  return (store.getters.friends as IUserInfo[]).filter(x => x._id === id)[0];
}

/**
 * check if a user has liked a specific recipe
 * @param id recipe id
 */
export function hasLikedRecipe(id: string): boolean {
  return (
    (store.getters.favedRecipes as IRecipe[]).filter(x => x._id === id).length >
    0
  );
}

export function getExercise(id: string, callback: Function): void {
  const allLoadedExercises: IExercise[] = [];
  allLoadedExercises.push(store.getters.exercises);
  allLoadedExercises.push(store.getters.recentExercises);
  allLoadedExercises.push(store.getters.trendingExercises);
  allLoadedExercises.push(store.getters.latestExercises);

  const exercise = allLoadedExercises.filter(x => x && x._id === id)[0];
  if (exercise) {
    callback(null);
    return;
  }
  axios
    .get('exercise/' + id)
    .then(res => {
      callback(res.data);
    })
    .catch(() => {
      callback(null);
    });
}

export function getRecipe(id: string, callback: Function): void {
  const allLoadedRecipes: IRecipe[] = [];
  allLoadedRecipes.push(store.getters.favedRecipes);
  allLoadedRecipes.push(store.getters.recipes);

  const recipe = allLoadedRecipes.filter(x => x && x._id === id)[0];
  if (recipe) {
    callback(null);
    return;
  }
  axios
    .get('recipe/' + id)
    .then(res => {
      callback(res.data);
    })
    .catch(() => {
      callback(null);
    });
}

export function getMuscles(): IVariable[] {
  return (store.getters.variables as IVariable[])
    .filter(x => x.type === 'muscle')
    .sort((a, b) => a.title.localeCompare(b.title));
}

export function getMuscle(name: string): IVariable | null {
  return getMuscles().filter(
    x => x.title.toLocaleLowerCase() === name.toLocaleLowerCase()
  )[0];
}

export function getMuscleNames(): string[] {
  return getMuscles().map(x => x.title);
}

export function getCategories(): IVariable[] {
  return (store.getters.variables as IVariable[])
    .filter(x => x.type === 'category')
    .sort((a, b) => a.title.localeCompare(b.title));
}

export function getCategory(name: string): IVariable | null {
  return getCategories().filter(
    x => x.title.toLocaleLowerCase() === name.toLocaleLowerCase()
  )[0];
}

export function getCategoryNames(): string[] {
  return getCategories().map(x => x.title);
}

export function extractInfoFromUrl(
  url: string
): { icon: string; user: string } {
  let icon = 'star';
  let user = url;
  url = url.toLowerCase();
  if (url.includes('instagram')) icon = 'instagram';
  if (url.includes('youtube')) icon = 'youtube';
  if (url.includes('facebook')) icon = 'facebook';

  return {
    icon: icon,
    user: user
  };
}

export function getWorkout(id: string, callback: Function) {
  let workout = (store.getters.latestWorkouts || []).filter(
    (x: IWorkout) => x._id === id
  )[0];

  if (workout) {
    callback(workout);
    return;
  }

  axios
    .get('workout/' + id)
    .then(res => callback(res.data))
    .catch(() => callback(null));
}
