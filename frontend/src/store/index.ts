/* eslint-disable */
import router from '@/router';
import axios from '@/utils/axios';
import { fhBotId } from '@/utils/constants';
import { EventBus } from '@/utils/eventbus';
import {
  IExercise,
  IFHNotification,
  IMessage,
  IPendingFriendship,
  IUser,
  IUserInfo
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
    exercises: [] as IExercise[],
    submittedExercises: [] as IExercise[]
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
        getters.exerciseSubmissions
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
    submittedExercises: (state: any): IExercise[] => {
      return state.submittedExercises;
    },
    exerciseSubmissions: (state: any): number => {
      return (state.submittedExercises as IExercise[]).filter(
        x => !x.reviewed || x.editedData
      ).length;
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
    addExercise(state: any, exercise: IExercise) {
      state.exercises = (state.exercises as IExercise[]).filter(
        x => x._id !== exercise._id
      );
      state.exercises.push(exercise);
    },
    removeExercise(state: any, exercise: IExercise) {
      state.exercises = (state.exercises as IExercise[]).filter(
        x => x._id !== exercise._id
      );
    },
    addSubmittedExercise(state: any, exercise: IExercise) {
      state.submittedExercises = (state.submittedExercises as IExercise[]).filter(
        x => x._id !== exercise._id
      );
      state.submittedExercises.push(exercise);
    },
    removeSubmittedExercise(state: any, exercise: IExercise) {
      state.submittedExercises = (state.submittedExercises as IExercise[]).filter(
        x => x._id !== exercise._id
      );
    }
  }
});
