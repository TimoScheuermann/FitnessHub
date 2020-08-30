/* eslint-disable */
import { ITotalMessages, IUser } from '@/utils/interfaces';
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: {} as IUser,
    userValidated: false,
    notifications: null as ITotalMessages | null,
    fixedHeader: false,
    routeTransition: 'slide-left'
  },
  getters: {
    valid: (state: any): boolean => {
      return state.userValidated;
    },
    user: (state: any): IUser => {
      return state.user;
    },
    name: (state: any): string => {
      return [state.user.givenName, state.user.familyName]
        .filter(x => !!x)
        .join(' ');
    },
    totalNotifications: (state: any): number => {
      if (!state.notifications) {
        return 0;
      }
      const total = (Object.values(state.notifications) as []).reduce(
        (a, b) => a + b,
        0
      );
      return Math.max(0, total);
    },
    fixedHeader: (state: any): boolean => {
      return state.fixedHeader;
    },
    routeTransition: (state: any): string => {
      return state.routeTransition;
    }
  },
  mutations: {
    signOut(state: any) {
      state.userValidated = false;
      state.user = undefined;
    },
    signIn(state: any, user: IUser) {
      state.user = user;
      state.userValidated = true;
    },
    setNotifications(state: any, notifications: ITotalMessages) {
      state.notifications = notifications;
    },
    fixedHeader(state: any, fixedHeader: boolean) {
      state.fixedHeader = fixedHeader;
    },
    routeTransition(state: any, trans: string) {
      state.routeTransition = trans;
    }
  }
});
