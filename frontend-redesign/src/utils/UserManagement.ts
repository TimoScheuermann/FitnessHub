import router from '@/router';
import store from '@/store';
import backend from './backend';
import { fhBotId } from './constants';
import {
  IMessage,
  IPendingFriendship,
  ITrainingplanFull,
  IUser,
  IUserInfo,
  IWorkout
} from './interfaces';
import { NotificationManagement } from './NotificationManagement';

/**
 * Manage all necessary methods with parameters
 */
export class UserManagement {
  public static getUser(): IUser | null {
    return store.getters.user;
  }

  public static getName(): string | null {
    const user = this.getUser();
    if (!user) return null;
    return [user.givenName, user.familyName].filter(x => !!x).join(' ');
  }

  /**
   * get UserID from current User
   */
  public static getUserID(): string | null {
    const user = this.getUser();
    if (!user) return null;
    return user._id;
  }

  /**
   * get Messages for chat
   */
  public static getMessages(): IMessage[] | null {
    return store.getters.messages;
  }

  /**
   *  get Message from friend
   * @param friendId: get ID from specific friend
   */
  public static getMessagesWith(friendId: string): IMessage[] {
    return (this.getMessages() || []).filter(
      x => x.from === friendId || x.to === friendId
    );
  }

  /**
   * load Message for displaying
   */
  public static async loadMessages(): Promise<void> {
    if (this.getUser() && !this.getMessages()) {
      const { data } = await backend.get('message');
      store.commit('messages', data);
    }
  }

  /**
   * store Message in DB
   * @param message: new message
   */
  public static async storeMessage(message: IMessage): Promise<void> {
    let messages: IMessage[] = this.getMessages() || [];

    let exists = false;
    messages = messages.map(m => {
      if (m._id === message._id) {
        exists = true;
        return message;
      }
      return m;
    });
    if (!exists) {
      messages.push(message);

      const { name, params } = router.currentRoute;
      const isInChat = name === 'chatroom' && params.friendId === message.from;

      if (isInChat) {
        this.markMessagesAsRead(message.from);
      }

      if (message.from !== this.getUserID() && !isInChat) {
        const friend = this.getFriend(message.from);
        if (friend) {
          let content = message.content;
          if (message.type === 'exercisePublish') {
            content =
              'Deine Übung ' +
              JSON.parse(message.content).title +
              ' wurde veröffentlicht!';
          }

          NotificationManagement.sendNotification(
            friend.username + ' schreibt:',
            content,
            { name: 'chatroom', params: { friendId: message.from } },
            friend.avatar
          );
        }
      }
    }
    store.commit('messages', messages);
  }

  public static markMessagesAsRead(friendId: string): void {
    if (!friendId) return;
    if (friendId === fhBotId) {
      backend.put('message/markBotAsRead');
    } else {
      backend.put('message/markAsRead/' + friendId);
    }

    let messages = this.getMessages() || [];
    messages = messages.map(x => {
      if (x.from !== friendId) return x;
      return {
        ...x,
        read: true
      };
    });
    store.commit('messages', messages);
  }

  /**
   * show friends
   */
  public static getFriends(): IUserInfo[] | null {
    return store.getters.friends;
  }

  /**
   * load friensrequest
   */
  public static async loadFriendRequests(): Promise<void> {
    if (this.getUser() && !store.getters.friendRequests) {
      const { data } = await backend.get('friends/invitations');
      store.commit('friendRequests', data);
    }
  }

  /**
   * show friends
   */
  public static async loadFriends(): Promise<void> {
    if (this.getUser() && !this.getFriends()) {
      const friends: IUserInfo[] = (await backend.get('friends')).data;
      friends.push({
        _id: fhBotId,
        avatar: 'pwa/splash/manifest-icon-512.jpg',
        username: 'FitnessHub'
      });
      store.commit('friends', friends);
    }
  }

  public static addFriend(friend: IUserInfo): void {
    if (friend._id === this.getUserID()) return;
    let friends: IUserInfo[] = this.getFriends() || [];

    let exists = false;
    friends = friends.map(m => {
      if (m._id === friend._id) {
        exists = true;
        return friend;
      }
      return m;
    });
    if (!exists) {
      friends.push(friend);
      if (friend._id !== this.getUserID()) {
        NotificationManagement.sendNotification(
          'Freundschaft',
          'mit ' + friend.username + ' geschlossen',
          { name: 'friends' },
          friend.avatar
        );
      }
    }
    store.commit('friends', friends);
  }

  /**
   * remove friends
   * @param friendId: ID  of frined to be removed
   */
  public static removeFriend(friendId: string): void {
    backend.delete('friends/remove/' + friendId);
  }

  public static removeFriendFromList(friendId: string): void {
    const friends = this.getFriends() || [];
    store.commit(
      'friends',
      friends.filter(x => x._id !== friendId)
    );
  }

  /**
   * search friend
   * @param id: id of searched person
   */
  public static getFriend(id: string): IUserInfo | null {
    const friends = this.getFriends();
    if (!friends) return null;
    const friend = friends.filter(f => f._id === id)[0];
    if (friend) return friend;
    return null;
  }

  /**
   * get friendrequest
   */
  public static getInvites(): IPendingFriendship[] {
    return store.getters.friendRequests || [];
  }

  public static addPendingFriendship(friendship: IPendingFriendship): void {
    const invites: IPendingFriendship[] = this.getInvites() || [];
    invites.push(friendship);
    const { _id, username, avatar } = friendship.invitee;
    if (_id !== this.getUserID()) {
      NotificationManagement.sendNotification(
        'Freundschaftsanfrage',
        username + ' möchte dein Freund werden.',
        { name: 'friends' },
        avatar
      );
    }
    store.commit('friendRequests', invites);
  }

  public static acceptInvite(pendingId: string): void {
    backend.put('friends/accept/' + pendingId);
  }

  public static cancelInvite(inviteId: string): void {
    backend.delete('friends/deny/' + inviteId);
  }

  public static removeFriendInvite(inviteId: string): void {
    const invites = this.getInvites();
    store.commit(
      'friendRequests',
      invites.filter(x => x._id !== inviteId)
    );
  }

  /**
   * send Invite
   * @param userId: ID of User to send request to
   */
  public static sendInvite(userId: string): void {
    backend.post('friends/invite/' + userId);
  }

  public static getWorkouts(): IWorkout[] | null {
    return store.getters.workouts;
  }

  public static getWorkout(id: string): IWorkout | null {
    return (this.getWorkouts() || []).filter(x => x._id == id)[0] || null;
  }

  public static setWorkouts(workouts: IWorkout[]): void {
    if (workouts) {
      store.commit('workouts', workouts);
    }
  }

  public static async loadWorkouts(): Promise<void> {
    if (!this.getWorkouts() && this.getUser()) {
      const { data } = await backend.get('workout');
      this.setWorkouts(data);
    }
  }

  public static addWorkout(workout: IWorkout): void {
    let workouts = this.getWorkouts() || [];
    let exists = false;
    workouts = workouts.map(x => {
      if (x._id === workout._id) {
        exists = true;
        return workout;
      }
      return x;
    });
    if (!exists) workouts.push(workout);
    this.setWorkouts(workouts);
  }

  public static removeWorkout(id: string): void {
    const workouts = this.getWorkouts() || [];
    this.setWorkouts(workouts.filter(x => x._id !== id));
  }

  public static async loadTrainingplan(): Promise<void> {
    const { data } = await backend.get('trainingplan/full');
    this.setTrainingplan(data);
  }

  public static setTrainingplan(plan: ITrainingplanFull): void {
    if (!plan) return;
    store.commit('trainingplan', plan);
  }

  public static getTrainingplan(): ITrainingplanFull | null {
    return store.getters.trainingplan;
  }
}
