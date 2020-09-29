import { sendNotification } from '@/utils/functions';
import { Component, Vue } from 'vue-property-decorator';
import { Socket } from 'vue-socket.io-extended';

@Component
export default class TelegramSocketManager extends Vue {
  @Socket('telegram.chat')
  telegramChat(chat: number) {
    this.$store.state.telegramChat = chat;
  }

  @Socket('telegram.errorMessage')
  telegramErrorMessage(message: string) {
    sendNotification({
      text: message,
      title: 'Telegram',
      to: { name: 'telegram' }
    });
  }
}
