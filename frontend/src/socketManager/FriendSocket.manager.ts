import { sendNotification } from '@/utils/functions';
import { IPendingFriendship, IUserInfo } from '@/utils/interfaces';
import { Component, Vue } from 'vue-property-decorator';
import { Socket } from 'vue-socket.io-extended';

@Component
export default class FriendSocketManager extends Vue {
  /**
   * new friend request received
   * @param request
   */
  @Socket('newFriendRequest')
  newFriendRequest(request: IPendingFriendship) {
    this.$store.commit('addFriendRequest', request);
    if (request.invitee._id !== this.$store.getters.user._id) {
      sendNotification({
        title: 'Freundschaftsanfrage',
        text: request.invitee.username + ' möchte dein Freund werden.',
        to: { name: 'friends' },
        img: request.invitee.avatar
      });
    }
  }

  /**
   * friend request rejected
   * @param id
   */
  @Socket('removeFriendRequest')
  removeFriendRequest(id: string) {
    this.$store.commit('removeFriendRequest', id);
  }

  /**
   * friend request sent
   * @param friend IUserInfo
   */
  @Socket('addFriend')
  addFriend(friend: IUserInfo) {
    this.$store.commit('addFriend', friend);
    if (friend._id !== this.$store.getters.user._id) {
      sendNotification({
        title: 'Freundschaft',
        text: 'mit ' + friend.username + ' geschlossen',
        to: { name: 'friends' },
        img: friend.avatar
      });
    }
  }

  /**
   * friend removed
   * @param id friendId
   */
  @Socket('removeFriend')
  removeFriend(id: string) {
    this.$store.commit('removeFriend', id);
  }
}
