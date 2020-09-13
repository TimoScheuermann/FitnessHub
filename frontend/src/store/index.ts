/* eslint-disable */
import router from '@/router';
import axios from '@/utils/axios';
import { fhBotId } from '@/utils/constants';
import { EventBus } from '@/utils/eventbus';
import {
  IExercise,
  IFHNotification,
  IHealth,
  IMessage,
  IPendingFriendship,
  IRecipe,
  ITrainingplanFull,
  IUser,
  IUserInfo,
  IWorkout
} from '@/utils/interfaces';
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: {} as IUser,
    userValidated: false,
    notifications: [] as IFHNotification[],
    fixedHeader: false,
    darkmode: false,
    routeTransition: 'slide-left',
    messages: [] as IMessage[],
    friends: [] as IUserInfo[],
    friendRequests: [] as IPendingFriendship[],
    primaryColor: '#25ca49',
    openRequests: 0,
    trendingExercises: null,
    latestExercises: null,
    latestWorkouts: null,
    exercises: [] as IExercise[],
    exerciseSubmissions: [] as IExercise[],
    workouts: [] as IWorkout[],
    chartWorkouts: Array.from({ length: 28 }, () => []),
    recipes: [] as IRecipe[],
    favedRecipes: [] as IRecipe[],
    weight: null,
    water: null,
    trainingplan: null
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
    totalNotifications: (state: any, getters: any): number => {
      return (
        getters.unreadMessages +
        getters.unansweredFriendRequests +
        getters.exerciseSubmissions.length
      );
    },
    fixedHeader: (state: any): boolean => {
      return state.fixedHeader;
    },
    darkmode: (state: any): boolean => {
      return state.darkmode;
    },
    routeTransition: (state: any): string => {
      return state.routeTransition;
    },
    messages: (state: any): IMessage[] => {
      return state.messages;
    },
    unreadMessages: (state: any, getters: any): number => {
      return (state.messages as IMessage[]).filter(
        x => !x.read && x.to === getters.user._id
      ).length;
    },
    friends: (state: any): IUserInfo[] => {
      return state.friends;
    },
    friendRequests: (state: any): IPendingFriendship[] => {
      return state.friendRequests;
    },
    unansweredFriendRequests: (state: any, getters: any): number => {
      return (state.friendRequests as IPendingFriendship[]).filter(
        x => x.target._id === getters.user._id
      ).length;
    },
    nextNotification: (state: any): IFHNotification | null => {
      const not = state.notifications.shift();
      state.notifications = state.notifications.filter(
        (x: IFHNotification, i: number) => i !== 0
      );
      return not || null;
    },
    loading: (state: any): boolean => {
      return state.openRequests !== 0;
    },
    exercises: (state: any): IExercise[] => {
      return state.exercises;
    },
    exerciseSubmissions: (state: any): IExercise[] => {
      return state.exerciseSubmissions;
    },
    workouts: (state: any): IWorkout[] => {
      return state.workouts;
    },
    chartWorkouts: (state: any): number[] => {
      return state.chartWorkouts;
    },
    recipes: (state: any): IRecipe[] => {
      return state.recipes;
    },
    favedRecipes: (state: any): IRecipe[] => {
      return state.favedRecipes;
    },
    weight: (state: any): IHealth[] => {
      return state.weight;
    },
    water: (state: any): IHealth[] => {
      return state.water;
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
    trainingplan: (state: any): ITrainingplanFull | null => {
      return state.trainingplan;
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
      state.user.familyName = user.familyName.split('Ã¼').join('ü');
    },
    fixedHeader(state: any, fixedHeader: boolean) {
      state.fixedHeader = fixedHeader;
    },
    darkmode(state: any, darkmode: boolean) {
      state.darkmode = darkmode;
    },
    routeTransition(state: any, trans: string) {
      state.routeTransition = trans;
    },
    async addMessage(state: any, message: IMessage) {
      if (
        router.currentRoute.name === 'chatroom' &&
        router.currentRoute.params.id === message.from
      ) {
        if (message.from === fhBotId) {
          await axios.put('message/markBotAsRead');
        } else {
          await axios.put('message/markAsRead/' + message.from);
        }
        message.read = true;
      }
      if (
        (state.messages as IMessage[]).filter(x => x._id === message._id)
          .length === 0
      ) {
        state.messages.push(message);
      }
    },
    addFriend(state: any, friend: IUserInfo) {
      if (
        (state.friends as IUserInfo[]).filter(x => x._id === friend._id)
          .length === 0
      ) {
        state.friends.push(friend);
      }
    },
    removeFriend(state: any, friendId: string) {
      state.friends = (state.friends as IUserInfo[]).filter(
        x => x._id !== friendId
      );
    },
    addFriendRequest(state: any, friendRequest: IPendingFriendship) {
      if (
        (state.friendRequests as IPendingFriendship[]).filter(
          x => x._id === friendRequest._id
        ).length === 0
      ) {
        state.friendRequests.push(friendRequest);
      }
    },
    removeFriendRequest(state: any, friendRequestId: string) {
      state.friendRequests = (state.friendRequests as IPendingFriendship[]).filter(
        x => x._id !== friendRequestId
      );
    },
    async markAsRead(state: any, fromId: string) {
      state.messages = (state.messages as IMessage[]).map(x => {
        if (x.from !== fromId) return x;
        return {
          ...x,
          read: true
        };
      });
      if (fromId === fhBotId) {
        await axios.put('message/markBotAsRead');
      } else {
        await axios.put('message/markAsRead/' + fromId);
      }
    },
    sendNotification(state: any, notification: IFHNotification) {
      state.notifications.push(notification);
      EventBus.$emit('message');
    },
    manageExercise(state: any, exercise: IExercise) {
      let matched = false;
      state.exercises = state.exercises.map((x: IExercise) => {
        if (x._id === exercise._id) {
          matched = true;
          return exercise;
        }
        return x;
      });

      if (!matched) state.exercises.push(exercise);
    },
    removeExercise(state: any, id: string) {
      state.exercises = state.exercises.filter((x: IExercise) => x._id !== id);
    },
    manageExerciseSubmission(state: any, exercise: IExercise) {
      let matched = false;
      state.exerciseSubmissions = state.exerciseSubmissions.map(
        (x: IExercise) => {
          if (x._id === exercise._id) {
            matched = true;
            return exercise;
          }
          return x;
        }
      );
      if (!matched) state.exerciseSubmissions.push(exercise);
    },
    removeExerciseSubmission(state: any, id: string) {
      state.exerciseSubmissions = state.exerciseSubmissions.filter(
        (x: IExercise) => x._id !== id
      );
    },
    manageWorkout(state: any, workout: IWorkout) {
      let matched = false;
      state.workouts = state.workouts.map((x: IWorkout) => {
        if (x._id === workout._id) {
          matched = true;
          return workout;
        }
        return x;
      });
      if (!matched) state.workouts.push(workout);
    },
    removeWorkout(state: any, id: string) {
      state.workouts = state.workouts.filter((x: IWorkout) => x._id !== id);
    },
    addWorkout(state: any, time: number) {
      state.chartWorkouts[27]++;
      state.chartTimes[27] += time;
    },
    setWorkoutCharts(state: any, data: number[][]) {
      state.chartWorkouts = data;
    },
    addRecipe(state: any, recipe: IRecipe) {
      let matched = false;
      state.recipes = state.recipes.map((x: IRecipe) => {
        if (x._id == recipe._id) {
          matched = true;
          return recipe;
        }
        return x;
      });
      if (!matched) state.recipes.push(recipe);
    },
    addFavedRecipe(state: any, recipe: IRecipe) {
      let matched = false;
      state.favedRecipes = state.favedRecipes.map((x: IRecipe) => {
        if (x._id == recipe._id) {
          matched = true;
          return recipe;
        }
        return x;
      });
      if (!matched) state.favedRecipes.push(recipe);
    },
    removeRecipe(state: any, id: string) {
      state.recipes = state.recipes.filter((x: IRecipe) => x._id !== id);
    },
    removeFavedRecipe(state: any, id: string) {
      state.favedRecipes = state.favedRecipes.filter(
        (x: IRecipe) => x._id !== id
      );
    },
    addWeight(state: any, weight: IHealth) {
      if (!state.weight) state.weight = [];
      state.weight.push(weight);
    },
    addWater(state: any, water: IHealth) {
      if (!state.water) state.water = [];
      let matched = false;
      state.water = state.water.map((x: IHealth) => {
        if (x._id === water._id) {
          matched = true;
          return water;
        }
        return x;
      });
      if (!matched) state.water.push(water);
    },
    setTrendingExercise(state: any, exercises: IExercise[]) {
      state.trendingExercises = exercises;
    },
    setLatestExercise(state: any, exercises: IExercise[]) {
      state.latestExercises = exercises;
    },
    setLatestWorkouts(state: any, workouts: IWorkout[]) {
      state.latestWorkouts = workouts;
    },
    setTrainingplan(state: any, trainingplan: ITrainingplanFull) {
      state.trainingplan = trainingplan;
    }
  }
});
