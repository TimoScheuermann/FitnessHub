import {
  getFriendAvatar,
  getFriendName,
  sendNotification
} from '@/utils/functions';
import { IMessage } from '@/utils/interfaces';
import { Component, Vue } from 'vue-property-decorator';
import { Socket } from 'vue-socket.io-extended';

@Component
export default class MessageSocketManager extends Vue {
  /**
   * message received
   * @param message IMessage
   */
  @Socket('message')
  messageReceived(message: IMessage) {
    this.$store.commit('addMessage', message);
    if (
      message.from !== this.$store.getters.user._id &&
      !(
        this.$route.name === 'chatroom' &&
        this.$route.params.id === message.from
      )
    ) {
      if (message.type === 'message') {
        sendNotification({
          title: getFriendName(message.from),
          text: message.content,
          to: { name: 'chatroom', params: { id: message.from } },
          img: getFriendAvatar(message.from)
        });
      }
    }
  }
}
