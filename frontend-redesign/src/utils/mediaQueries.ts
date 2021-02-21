import store from '@/store';

export const mqIsDesktop = window.matchMedia('(min-width: 851px)');
export const mqDarkmode = window.matchMedia('(prefers-color-scheme: dark)');

function mediaListenerDesktop(event: MediaQueryListEvent): void {
  store.commit('isDesktop', event && event.matches);
}

function mediaListenerDarkmode(event: MediaQueryListEvent): void {
  store.commit('darkmode', event && event.matches);
}

export function registerMediaQueries() {
  mqIsDesktop.addListener(mediaListenerDesktop);
  mqDarkmode.addListener(mediaListenerDarkmode);
  store.commit('isDesktop', mqIsDesktop.matches);
  store.commit('darkmode', mqDarkmode.matches);
}

export function unregisterMediaQueries() {
  mqIsDesktop.removeListener(mediaListenerDesktop);
  mqDarkmode.removeListener(mediaListenerDarkmode);
}
