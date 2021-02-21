import store from '@/store';
import backend from './backend';
import { IMessage, IPendingFriendship, IUser, IUserInfo } from './interfaces';

export class UserManagement {
  private static getUser(): IUser | null {
    return store.getters.user;
  }

  public static getUserID(): string | null {
    const user = this.getUser();
    if (!user) return null;
    return user._id;
  }

  public static getMessages(): IMessage[] | null {
    return store.getters.messages;
  }

  public static getMessagesWith(friendId: string): IMessage[] {
    return (this.getMessages() || []).filter(
      x => x.from === friendId || x.to === friendId
    );
  }

  public static async loadMessages(): Promise<void> {
    if (this.getUser() && !this.getMessages()) {
      const { data } = await backend.get('message');
      store.commit('messages', data);
    }
  }

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
    }
    store.commit('messages', messages);
  }

  public static getFriends(): IUserInfo[] | null {
    return store.getters.friends;
  }

  public static async loadFriendRequests(): Promise<void> {
    if (this.getUser() && !store.getters.friendRequests) {
      const { data } = await backend.get('friends/invitations');
      store.commit('friendRequests', data);
    }
  }

  public static async loadFriends(): Promise<void> {
    if (this.getUser() && !this.getFriends()) {
      const { data } = await backend.get('friends');
      store.commit('friends', data);
    }
  }

  public static removeFriend(friendId: string): void {
    const friends = this.getFriends();
    if (this.getUser() && friends) {
      backend.delete('friends/remove/' + friendId);
      store.commit(
        'friends',
        friends.filter(x => x._id !== friendId)
      );
    }
  }

  public static getFriend(id: string): IUserInfo | null {
    const friends = this.getFriends();
    if (!friends) return null;
    const friend = friends.filter(f => f._id === id)[0];
    if (friend) return friend;
    return null;
  }

  public static getInvites(): IPendingFriendship[] {
    return store.getters.friendRequests || [];
  }

  private static getPendingFriendship(
    withUser: string
  ): IPendingFriendship | null {
    return (
      this.getInvites().filter(
        x => x.invitee._id === withUser || x.target._id === withUser
      )[0] || null
    );
  }

  public static acceptInvite(userId: string): void {
    const pending = this.getPendingFriendship(userId);
    if (pending) {
      backend.put('friends/accept/' + pending._id);
    }
  }

  public static cancelInvite(userId: string): void {
    const pending = this.getPendingFriendship(userId);
    if (pending) {
      backend.delete('friends/deny/' + pending._id);
    }
  }

  public static sendInvite(userId: string): void {
    backend.post('friends/invite/' + userId);
  }
}
