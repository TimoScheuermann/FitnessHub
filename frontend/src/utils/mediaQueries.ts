import store from '@/store';

const mqIsDesktop = window.matchMedia('(min-width: 851px)');
const mqIsFullscreen = window.matchMedia('(min-width: 1250px)');
const mqDarkmode = window.matchMedia('(prefers-color-scheme: dark)');

function mediaListenerHeader(event: MediaQueryListEvent): void {
  store.commit('isDesktop', event && event.matches);
}

function mediaListenerFullscreen(event: MediaQueryListEvent): void {
  store.commit('isFullscreen', event && event.matches);
}

function mediaListenerDarkmode(event: MediaQueryListEvent): void {
  const matches = event && event.matches;
  document.documentElement.classList[matches ? 'add' : 'remove']('dark');
  store.commit('darkmode', matches);
}

export function registerMediaQueries() {
  mqIsDesktop.addListener(mediaListenerHeader);
  mqIsFullscreen.addListener(mediaListenerFullscreen);
  mqDarkmode.addListener(mediaListenerDarkmode);
  store.commit('isDesktop', mqIsDesktop.matches);
  store.commit('isFullscreen', mqIsFullscreen.matches);
  store.commit('darkmode', mqDarkmode.matches);

  document.documentElement.classList[mqDarkmode.matches ? 'add' : 'remove'](
    'dark'
  );
}

export function unregisterMediaQueries() {
  mqIsDesktop.removeListener(mediaListenerHeader);
  mqIsFullscreen.removeListener(mediaListenerFullscreen);
  mqDarkmode.removeListener(mediaListenerDarkmode);
}
