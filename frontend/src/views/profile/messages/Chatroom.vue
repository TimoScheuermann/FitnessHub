<template>
  <div class="chatroom" content>
    <tl-flow v-if="messages.length === 0">
      <p><em>Beginn des Chats...</em></p>
    </tl-flow>

    <transition-group v-else name="message-list" tag="div" class="messages">
      <div
        v-for="(m, i) in messages"
        :key="m._id"
        class="message"
        :class="{
          received: m.to === $store.getters.user._id,
          dark: $store.getters.darkmode
        }"
      >
        <tc-divider
          v-if="displayDate(i)"
          :dark="$store.getters.darkmode"
          :name="transformDate(m.date)"
        />

        <div class="content" v-if="m.type === 'message'">{{ m.content }}</div>
        <div
          class="exercise-published"
          v-else-if="m.type === 'exercisePublish'"
        >
          <div class="title">
            Deine Übung: "{{ JSON.parse(m.content).title }}" wurde
            veröffentlicht!
          </div>
          <tl-flow>
            <tc-button
              variant="opaque"
              tfbackground="success"
              name="Übung ansehen"
              icon="gym"
            />
          </tl-flow>
        </div>
      </div>
    </transition-group>

    <div
      class="newMessage"
      v-if="!isBotPartner"
      :class="{ dark: $store.getters.darkmode }"
    >
      <form @submit.prevent="sendMessage">
        <tc-input
          :dark="$store.getters.darkmode"
          pattern=".{0,}"
          v-model="newMessage"
        />
      </form>
      <tc-button icon="reply" @click="sendMessage" variant="filled" />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { IMessage } from '@/utils/interfaces';
import { formatTimeForMessage } from '@/utils/functions';
import axios from '@/utils/axios';
import { aHour, fhBotId } from '@/utils/constants';

@Component
export default class Chatroom extends Vue {
  public newMessage = '';

  get isBotPartner(): boolean {
    return this.partnerId === fhBotId;
  }

  get partnerId(): string {
    return this.$route.params.id;
  }

  get messages(): IMessage[] {
    window.scrollTo(0, document.body.scrollHeight);
    setTimeout(() => {
      window.scrollTo(0, document.body.scrollHeight);
    }, 100);

    return (this.$store.getters.messages as IMessage[])
      .filter(x => x.from === this.partnerId || x.to === this.partnerId)
      .sort((a, b) => a.date - b.date);
  }

  mounted() {
    this.$store.commit('markAsRead', this.partnerId);
  }

  public transformDate(timestamp: number): string {
    return formatTimeForMessage(timestamp);
  }

  public displayDate(messageNumber: number): boolean {
    if (messageNumber === 0) return true;
    if (this.messages.length > messageNumber + 1) {
      const next = this.messages[messageNumber + 1];
      const current = this.messages[messageNumber];
      if (next.date - current.date > aHour) return true;
      return false;
    }
    return true;
  }

  public async sendMessage(): Promise<void> {
    if (this.newMessage.length > 0 && !this.isBotPartner) {
      axios.post('message/' + this.partnerId, {
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
    position: relative;
    max-width: 800px;
    left: 50%;
    transform: translateX(-50%);
    padding-bottom: 50px;

    .message {
      display: flex;
      flex-direction: column;
      .content {
        padding: 5px 10px;
        background: $success;
        width: fit-content;
        align-self: flex-end;
        box-shadow: $shadow-light;
        border-radius: $border-radius;
        max-width: 75%;
        margin-bottom: 10px;
      }
      .exercise-published {
        padding: 10px;

        background: $paragraph_dark;
        color: $color_dark;
        @media (prefers-color-scheme: dark) {
          background: rgba($paragraph, 0.25);
          color: $color;
        }
        box-shadow: $shadow-light;
        margin-top: 10px;
        border-radius: $border-radius;
        margin-bottom: 20px;
        .title {
          text-align: center;
          font-size: 18px;
          font-weight: 600;
          margin: 3px;
        }
      }
      &:not(.received) .content {
        color: #fff;
      }

      &.received .content {
        align-self: flex-start;
        background: $paragraph;
      }
      &.received.dark .content {
        background: $paragraph_dark;
      }
      .tc-divider {
        margin: 20px 0 10px;
        opacity: 0.4;
        font-size: 13px;
      }
    }
  }

  .newMessage {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(70px, auto);
    grid-gap: 0;
    background: $paragraph;
    transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);

    &.dark {
      background: $paragraph_dark;
    }
    padding: 10px 5vw;
    position: fixed;
    bottom: calc(50px + env(safe-area-inset-bottom));
    @media #{$isDesktop} {
      bottom: 0px;
    }
    left: 0;
    right: 0;
    border-radius: $border-radius $border-radius 0 0;
    margin-top: 10px;
    box-shadow: $shadow;
    animation: newMessageAnim 0.25s ease 0.5s both;
  }

  @keyframes newMessageAnim {
    0% {
      opacity: 0;
      margin-bottom: -50px;
    }
    100% {
      opacity: 1;
      margin-bottom: 0;
    }
  }
}

.message-list-enter-active,
.message-list-leave-active {
  transition: all 1s ease;
}
.message-list-enter, .message-list-leave-to /* .message-list-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(30px);
}
</style>
