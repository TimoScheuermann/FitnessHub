/* eslint-disable */
import {
  IExercise,
  IRecipe,
  IUser,
  IVariable,
  IWorkout
} from '@/utils/interfaces';
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
    belovedRecipes: null
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
    }
  }
});

export default store;
