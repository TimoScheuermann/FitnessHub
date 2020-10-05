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
        <template v-if="m.type === 'message'">
          <div class="content">
            {{ m.content }}
            <svg width="16" height="12" viewBox="0 0 16 12">
              <path
                d="M-3682.307-2357.992l4.191-6.117v3.3c0,6.08,2.14,7.8,2.81,8.44s-6.3,0-8.181-2.715c-2.048,2.748-5.979,2.974-7.774,2.974l1.417-3.885Z"
                transform="translate(3691.26 2364.109)"
              />
              <path
                d="M-3676-2354h-15.724c3.491-.048,6.084-1.075,7.5-2.972,1.455,2.1,5.939,2.945,7.564,2.945.421,0,.656-.052.661-.147v.174Zm0-.193a.146.146,0,0,0-.043-.064l-.066-.063-.034-.032a7.275,7.275,0,0,1-2.143-3.647h2.29v3.806Z"
                transform="translate(3692 2366)"
              />
            </svg>
          </div>
        </template>
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
              :disabled="$store.getters.loading"
              variant="opaque"
              tfbackground="success"
              name="Übung ansehen"
              icon="gym"
              @click="openExercise(JSON.parse(m.content).id)"
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
          placeholder="Nachricht eingeben"
        />
      </form>
      <tc-select
        :onlyIcon="true"
        icon="dots"
        variant="filled"
        tfbackground="success"
      >
        <tc-select-item title="Herausfordern" icon="trophy" />
        <tc-select-item title="Training planen" icon="calendar-alt" />
      </tc-select>
      <tc-button tfbackground="success" icon="reply" @click="sendMessage" />
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

  public openExercise(id: string): void {
    this.$router.push({ name: 'training-exercise', params: { id: id } });
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
      .exercise-published {
        padding: 10px;
        border: 5px solid $paragraph;
        box-sizing: border-box;
        color: $color;
        width: 80%;
        align-self: center;
        @media (prefers-color-scheme: dark) {
          border-color: $paragraph_dark;
          color: $color_dark;
        }
        margin-top: 10px;
        border-radius: $border-radius;
        margin-bottom: 20px;
        .title {
          text-align: center;
          font-weight: 600;
          margin: 3px {
            bottom: 8px;
          }
        }
      }

      .content {
        position: relative;
        padding: 5px 10px;
        background: $success;
        width: fit-content;
        align-self: flex-end;
        border-radius: $border-radius;
        max-width: 75%;
        margin-bottom: 10px;
        svg {
          position: absolute;
          right: -2.22px;
          bottom: 0;
          path {
            fill: $success;
            &:nth-child(2) {
              fill: $background;
              @media (prefers-color-scheme: dark) {
                fill: $background_dark;
              }
            }
          }
        }
      }
      &.received svg {
        transform: scaleX(-1);

        left: -2.22px;
        path:first-child {
          fill: $paragraph;
          @media (prefers-color-scheme: dark) {
            fill: $paragraph_dark;
          }
        }
      }

      &:not(.received) .content {
        color: #fff;
      }

      &.received .content {
        align-self: flex-start;
        background: $paragraph;
        @media (prefers-color-scheme: dark) {
          background: $paragraph_dark;
        }
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
    grid-template-columns: minmax(0, 1fr) minmax(0px, auto) minmax(70px, auto);
    grid-gap: 0;
    background: $paragraph;
    transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);

    &.dark {
      background: $paragraph_dark;
    }
    padding: 10px 5vw;
    position: fixed;
    bottom: calc(50px + env(safe-area-inset-bottom));
    left: 0;
    right: 0;
    @media #{$isDesktop} {
      bottom: 0px;
      left: 210px;
    }
    @media #{$isFullscreen} {
      right: 315px;
    }
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
