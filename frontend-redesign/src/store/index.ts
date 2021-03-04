/* eslint-disable */
import { socket } from '@/main';
import { getUserFromJWT } from '@/utils/auth';
import { ExerciseManagement } from '@/utils/ExerciseManagement';
import { openFullscreen } from '@/utils/functions';
import {
  IExercise,
  IHealth,
  IMessage,
  IPendingFriendship,
  IRecipe,
  IUser,
  IUserInfo,
  IVariable,
  IWorkout
} from '@/utils/interfaces';
import { RecipeManagement } from '@/utils/RecipeManagement';
import { TrainingStatistics } from '@/utils/Trainingstatistics';
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
    storedRoutes: {},
    variables: null,

    latestWorkouts: null,
    workouts: null,
    addToWorkout: null,

    latestExercises: null,
    trendingExercises: null,
    createdExercises: null,
    submittedExercises: null,
    recentExercises: null,

    latestRecipes: null,
    belovedRecipes: null,
    likedRecipes: null,
    createdRecipes: null,

    messages: null,
    friends: null,
    friendRequests: null,

    trainingStats: null,
    weight: null,
    water: null,
    height: null
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
    variables: (state: any): IVariable[] | null => {
      return state.variables;
    },

    latestWorkouts: (state: any): IWorkout[] | null => {
      return state.latestWorkouts;
    },
    workouts: (state: any): IWorkout[] | null => {
      return state.workouts;
    },
    addToWorkout: (state: any): IExercise | null => {
      return state.addToWorkout;
    },

    trendingExercises: (state: any): IExercise[] | null => {
      return state.trendingExercises;
    },
    latestExercises: (state: any): IExercise[] | null => {
      return state.latestExercises;
    },
    createdExercises: (state: any): IExercise[] | null => {
      return state.createdExercises;
    },
    submittedExercises: (state: any): IExercise[] | null => {
      return state.submittedExercises;
    },
    recentExercises: (state: any): IExercise[] | null => {
      return state.recentExercises;
    },

    latestRecipes: (state: any): IRecipe[] | null => {
      return state.latestRecipes;
    },
    belovedRecipes: (state: any): IRecipe[] | null => {
      return state.belovedRecipes;
    },
    likedRecipes: (state: any): IRecipe[] | null => {
      return state.likedRecipes;
    },
    createdRecipes: (state: any): IRecipe[] | null => {
      return state.createdRecipes;
    },

    messages: (state: any): IMessage[] | null => {
      return state.messages;
    },
    friends: (state: any): IUserInfo[] | null => {
      return state.friends;
    },
    friendRequests: (state: any): IPendingFriendship[] | null => {
      return state.friendRequests;
    },

    trainingStats: (state: any): number[][] | null => {
      return state.trainingStats;
    },
    weight: (state: any): IHealth[] | null => {
      return state.weight;
    },
    water: (state: any): IHealth[] | null => {
      return state.water;
    },
    height: (state: any): IHealth | null => {
      return state.height;
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
      UserManagement.loadWorkouts();
      RecipeManagement.loadLiked();
      RecipeManagement.loadCreated();
      ExerciseManagement.loadSubmissions();
      ExerciseManagement.loadCreated();
      TrainingStatistics.loadCharts();
      TrainingStatistics.loadWater();
      TrainingStatistics.loadHeights();
      TrainingStatistics.loadWeights();
    },
    isDesktop(state: any, isDesktop: boolean) {
      state.isDesktop = isDesktop;
    },
    darkmode(state: any, darkmode: boolean) {
      state.darkmode = darkmode;
    },
    storeRoute(state: any, data: { key: string; route: Route }) {
      state.storedRoutes[data.key] = data.route;
    },
    variables(state: any, vars: IVariable) {
      state.variables = vars;
    },

    latestWorkouts(state: any, workouts: IWorkout[]) {
      state.latestWorkouts = workouts;
    },
    workouts(state: any, workouts: IWorkout[]) {
      state.workouts = workouts;
    },
    addToWorkout(state: any, exercise: IExercise) {
      state.addToWorkout = exercise;
      if (exercise) {
        openFullscreen('add-to-workout');
      }
    },

    trendingExercises(state: any, exercises: IExercise[]) {
      state.trendingExercises = exercises;
    },
    latestExercises(state: any, exercises: IExercise[]) {
      state.latestExercises = exercises;
    },
    createdExercises(state: any, exercises: IExercise[]) {
      state.createdExercises = exercises;
    },
    submittedExercises(state: any, exercises: IExercise[]) {
      state.submittedExercises = exercises;
    },
    recentExercises(state: any, exercises: IExercise[]) {
      state.submittedExercises = exercises;
    },

    latestRecipes(state: any, recipes: IRecipe[]) {
      state.latestRecipes = recipes;
    },
    belovedRecipes(state: any, recipes: IRecipe[]) {
      state.belovedRecipes = recipes;
    },
    likedRecipes(state: any, recipes: IRecipe[]) {
      state.likedRecipes = recipes;
    },
    createdRecipes(state: any, recipes: IRecipe[]) {
      state.createdRecipes = recipes;
    },

    messages(state: any, messages: IMessage[]) {
      state.messages = messages;
    },
    friends(state: any, friends: IUserInfo[]) {
      state.friends = friends.filter(x => x._id !== UserManagement.getUserID());
    },
    friendRequests(state: any, friendRequests: IPendingFriendship[]) {
      state.friendRequests = friendRequests;
    },

    trainingStats(state: any, trainingStats: number[][]) {
      state.trainingStats = trainingStats;
    },
    weight(state: any, weight: IHealth[]) {
      return (state.weight = weight);
    },
    water(state: any, water: IHealth[]) {
      return (state.water = water);
    },
    height(state: any, height: IHealth) {
      return (state.height = height);
    }
  }
});

export default store;
