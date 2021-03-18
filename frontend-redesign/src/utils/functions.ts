import router from '@/router';
import store from '@/store';
import { Route } from 'vue-router';
import { Dictionary } from 'vue-router/types/router';
import { anHour, backendURL, days } from './constants';
import { FHEventBus } from './FHEventbus';
import { IExercise, INutritionplan, IRecipe, IWorkout } from './interfaces';
import { NotificationManagement } from './NotificationManagement';

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
  query?: Query,
  destination?: Route
): void {
  if ((destination || getCurrentRoute()).name !== name) {
    store.commit('storeRoute', {
      key: name,
      route: destination || getCurrentRoute()
    });
    router.push({ name: name, params: params, query: query });
  }
}

export function closeFullscreen(fallback: string, replaceQuery?: Query): void {
  const key = getCurrentRoute().name || '';
  const storedRoute: Route | null = { ...store.state.storedRoutes[key] };

  store.commit('storeRoute', { key: key, route: null });

  if (storedRoute) {
    const { name, params, query } = storedRoute;

    if (name && name !== getCurrentRoute().name) {
      router.push({ name: name, params: params, query: replaceQuery || query });
      return;
    }
  }

  if (fallback && getCurrentRoute().name !== fallback) {
    router.push({ name: fallback });
  }
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

export function addToList(exercise: IExercise) {
  if (!exercise) return;
  if (!store.getters.valid) {
    openFullscreen('login');
    return;
  }
  FHEventBus.$emit('add-to-list', exercise);
}

function share(
  prefix: string,
  id: string,
  name: string,
  title: string,
  image: string | undefined
) {
  const url = `https://fitnesshub.app/${prefix}/${id}`;
  const share: ShareData = {
    title: 'FitnessHub',
    text: name + ': ' + title,
    url: url
  };

  navigator
    .share(share)
    .then(() => {})
    .catch(() => {
      copyToClipboard(url);
      NotificationManagement.sendNotification(
        name + ' teilen',
        'Der Link zum Teilen wurde in deine Ablage kopiert',
        undefined,
        image
      );
    });
}

export function shareWorkout(workout: IWorkout) {
  if (workout) {
    const { _id, title, exercises } = workout;
    share('w', _id, 'Workout', title, exercises[0].thumbnail);
  }
}

export function shareExercise(exercise: IExercise) {
  if (exercise) {
    const { _id, title, thumbnail } = exercise;
    share('e', _id, 'Übung', title, thumbnail);
  }
}

export function shareRecipe(recipe: IRecipe) {
  if (recipe) {
    const { _id, title, thumbnail } = recipe;
    share('r', _id, 'Rezept', title, thumbnail);
  }
}

export function shareNutritionplan(plan: INutritionplan) {
  if (plan && plan._id) {
    const { _id, title, monday } = plan;
    share('p', _id, 'Ernährungsplan', title, monday.lunch?.thumbnail);
  }
}

export function handleDetailViewPreload(
  id: string,
  endpoint: string,
  prefix: string
) {
  fetch(`${backendURL}${endpoint}/${id}`)
    .then(res => res.json())
    .then(data => {
      if (data) {
        let title = data.title;
        let description = '';
        let thumbnail = '';

        if (data.thumbnail) {
          thumbnail = data.thumbnail;
          if (data.reviewed) {
            description =
              'Sieh dir diese Übung auf der FitnessHub an, um mehr darüber zu erfahren';
          } else {
            description =
              'Sieh dir dieses Rezept auf der FitnessHub an, um mehr darüber zu erfahren';
          }
        } else if (data.exercises) {
          thumbnail = data.exercises[0].thumbnail;
          description =
            'Sieh dir dieses Workout auf der FitnessHub an, um mehr darüber zu erfahren';
        } else if (data.monday) {
          thumbnail = data.monday.lunch.thumbnail;
          description =
            'Sieh dir diesen Ernährungsplan auf der FitnessHub an, um mehr darüber zu erfahren';
        }

        const options = {
          title: title,
          description: description,
          image: thumbnail,
          url: `https://fitnesshub.app/${prefix}/${id}`
        };

        [
          'meta[name="%"]',
          'meta[property="og:%"]',
          'meta[property="twitter:%"]'
        ].forEach(type => {
          for (const [key, value] of Object.entries(options)) {
            const element = document.querySelector(type.replace('%', key));
            if (element) {
              element.setAttribute('content', value);
            }
          }
        });
      }
    });
}
