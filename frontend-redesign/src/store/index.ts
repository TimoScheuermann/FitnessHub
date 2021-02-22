/* eslint-disable */
import { socket } from '@/main';
import { getUserFromJWT } from '@/utils/auth';
import {
  IExercise,
  IMessage,
  IPendingFriendship,
  IRecipe,
  IUser,
  IUserInfo,
  IVariable,
  IWorkout
} from '@/utils/interfaces';
import { UserManagement } from '@/utils/UserManagement';
import Vue from 'vue';
import { Route } from 'vue-router';
import Vuex from 'vuex';

Vue.use(Vuex);
const store = new Vuex.Store({
  state: {
    userValidated: false,
    user: {} as IUser,
    isDesktop: false,
    darkmode: false,
    routeTransition: 'slide-left',
    storedRoutes: {},
    variables: null,
    trendingExercises: null,
    latestExercises: null,
    latestWorkouts: null,
    latestRecipes: null,
    belovedRecipes: null,
    messages: null,
    friends: null,
    friendRequests: null
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
    isDesktop: (state: any): boolean => {
      return state.isDesktop;
    },
    isFullscreen: (state: any): boolean => {
      return state.isFullscreen;
    },
    darkmode: (state: any): boolean => {
      return state.darkmode;
    },
    routeTransition: (state: any): string => {
      return state.routeTransition;
    },
    variables: (state: any): IVariable[] | null => {
      return state.variables;
    },
    trendingExercises: (state: any): IExercise[] | null => {
      return state.trendingExercises;
    },
    latestExercises: (state: any): IExercise[] | null => {
      return state.latestExercises;
    },
    latestWorkouts: (state: any): IWorkout[] | null => {
      return state.latestWorkouts;
    },
    latestRecipes: (state: any): IRecipe[] | null => {
      return state.latestRecipes;
    },
    belovedRecipes: (state: any): IRecipe[] | null => {
      return state.belovedRecipes;
    },
    messages: (state: any): IMessage[] | null => {
      return state.messages;
    },
    friends: (state: any): IUserInfo[] | null => {
      return state.friends;
    },
    friendRequests: (state: any): IPendingFriendship[] | null => {
      return state.friendRequests;
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
      if (user.familyName)
        state.user.familyName = user.familyName.split('Ã¼').join('ü');

      socket.emit('join', getUserFromJWT()._id);
      UserManagement.loadMessages();
      UserManagement.loadFriends();
      UserManagement.loadFriendRequests();
    },
    isDesktop(state: any, isDesktop: boolean) {
      state.isDesktop = isDesktop;
    },
    darkmode(state: any, darkmode: boolean) {
      state.darkmode = darkmode;
    },
    routeTransition(state: any, trans: string) {
      state.routeTransition = trans;
    },
    storeRoute(state: any, data: { key: string; route: Route }) {
      state.storedRoutes[data.key] = data.route;
    },
    variables(state: any, vars: IVariable) {
      state.variables = vars;
    },
    trendingExercises(state: any, exercises: IExercise[]) {
      state.trendingExercises = exercises;
    },
    latestExercises(state: any, exercises: IExercise[]) {
      state.latestExercises = exercises;
    },
    latestWorkouts(state: any, workouts: IWorkout[]) {
      state.latestWorkouts = workouts;
    },
    latestRecipes(state: any, recipes: IRecipe[]) {
      state.latestRecipes = recipes;
    },
    belovedRecipes(state: any, recipes: IRecipe[]) {
      state.belovedRecipes = recipes;
    },
    messages(state: any, messages: IMessage[]) {
      state.messages = messages;
    },
    friends(state: any, friends: IUserInfo[]) {
      state.friends = friends.filter(x => x._id !== UserManagement.getUserID());
    },
    friendRequests(state: any, friendRequests: IPendingFriendship[]) {
      state.friendRequests = friendRequests;
    }
  }
});

export default store;
