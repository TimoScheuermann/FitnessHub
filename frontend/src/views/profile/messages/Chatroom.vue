<template>
  <div class="chatroom" content>
    <h1>Chatroom</h1>

    <div class="messages">
      <div
        class="message"
        v-for="m in messages"
        :key="m.id"
        :class="{ received: m.to === $store.getters.user._id }"
      >
        <div class="content">
          {{ m.content }}
        </div>
        <div class="date">{{ transformDate(m.date) }}</div>
      </div>
    </div>
    <div class="newMessage">
      <form @submit.prevent="sendMessage">
        <tc-input pattern="*" v-model="newMessage" />
      </form>
      <tc-button name="send" @click="sendMessage" variant="filled" />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { IMessage } from '@/utils/interfaces';
import { formatDate } from '@/utils/functions';
import axios from '@/utils/axios';

@Component
export default class Chatroom extends Vue {
  public newMessage = '';

  get messages(): IMessage[] {
    const room = this.$route.params.id;
    return (this.$store.getters.messages as IMessage[])
      .filter(x => x.from === room || x.to === room)
      .sort((a, b) => a.date - b.date);
  }

  public transformDate(timestamp: number): string {
    return formatDate(timestamp);
  }

  public async sendMessage(): Promise<void> {
    if (this.newMessage.length > 0) {
      axios.post('message/' + this.$route.params.id, {
        message: this.newMessage
      });
      this.newMessage = '';
    }
  }
}
</script>

<style lang="scss" scoped>
.chatroom {
  .messages {
    display: flex;
    flex-direction: column;
    .message {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      width: fit-content;
      background: $success;
      color: #fff;
      align-self: flex-end;
      &.received {
        background: $paragraph;
        color: $color;
        align-self: flex-start;
      }
      margin-bottom: 10px;
      padding: 5px 10px;
      border-radius: $border-radius;
      .date {
        opacity: 0.7;
        font-size: 13px;
      }
    }
  }
  .newMessage {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(100px, auto);
    grid-gap: 0;
    background: #fff;
    padding: 10px;
    position: sticky;
    bottom: 0;
    left: 0;
    right: 0;
    border-radius: $border-radius;
    margin-top: 10px;
    box-shadow: $shadow;
  }
}
</style>
