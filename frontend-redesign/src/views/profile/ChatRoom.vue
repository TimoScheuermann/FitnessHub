<template>
  <div class="view-chat-room">
    <FHFullScreenCloser @click="$cFS('messages')" />
    <FHHeader v-if="friend" :title="friend.username" />

    <tc-hero :dark="true">
      <img src="assets/hero/home.webp" slot="background" alt="" />
      <tl-flow flow="column">
        <template v-if="!friend">
          <tc-spinner
            variant="dots-spin"
            size="30"
            :dark="$store.getters.darkmode"
          />
          <p>Freund wird geladen...</p>
        </template>
        <template v-else>
          <tc-avatar :src="friend.avatar" />
          <tc-link color="#fff">
            {{ friend.username }}
          </tc-link>
        </template>
      </tl-flow>
    </tc-hero>

    <div class="input-wrapper" v-if="!this.isBotPartner">
      <div class="action-wrapper">
        <tc-action :dark="$store.getters.darkmode">
          <tc-action-item icon="trophy" title="Herausfordern" />
          <tc-action-item icon="calendar-alt" title="Training planen" />
          <tc-action-item success icon="lens" title="Profil ansehen" />
        </tc-action>
      </div>
      <form @submit.prevent="sendMessage">
        <textarea
          v-model="newMessage"
          required
          placeholder="Nachricht"
          :rows="numberOfLineBreaks"
        />
        <tl-flow>
          <label for="submit" cursor>
            <i class="ti-reply"></i>
          </label>
        </tl-flow>
        <input id="submit" type="submit" />
      </form>
    </div>

    <div content>
      <div max-width>
        <tl-flow v-if="!messages" flow="column">
          <tc-spinner
            variant="dots-spin"
            size="30"
            :dark="$store.getters.darkmode"
          />
          <p>Nachrichten werden geladen...</p>
        </tl-flow>

        <template v-else>
          <FHChatMessage
            v-for="(m, i) in messages"
            :key="m._id"
            :message="m"
            :prev="i === 0 ? null : messages[i - 1]"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import FHChatMessage from '@/components/chatroom/ChatMessage.vue';
import FHFullScreenCloser from '@/components/FHFullScreenCloser.vue';
import FHHeader from '@/components/FHHeader.vue';
import FHSwipeable from '@/components/FHSwipeable.vue';
import backend from '@/utils/backend';
import { fhBotId } from '@/utils/constants';
import { closeFullscreen } from '@/utils/functions';
import { IMessage, IUserInfo } from '@/utils/interfaces';
import { UserManagement } from '@/utils/UserManagement';
import { Vue, Component } from 'vue-property-decorator';

@Component({
  components: {
    FHFullScreenCloser,
    FHHeader,
    FHSwipeable,
    FHChatMessage
  }
})
export default class ChatRoom extends Vue {
  public newMessage = '';

  async mounted() {
    if (!this.friend) {
      await UserManagement.loadFriends();
      if (!this.friend) {
        closeFullscreen('messages');
      }
    }
    UserManagement.loadMessages();
  }

  get isBotPartner(): boolean {
    return this.$route.params.friendId === fhBotId;
  }

  get friend(): IUserInfo | null {
    return UserManagement.getFriend(this.$route.params.friendId);
  }

  get numberOfLineBreaks(): number {
    const amount = this.newMessage.match(/\n/g || [])?.length || 0;
    return Math.min(Math.max(amount, 1), 3);
  }

  get messages(): IMessage[] | null {
    if (!this.friend) return null;
    return UserManagement.getMessagesWith(this.friend._id);
  }

  public sendMessage(): void {
    if (this.newMessage.length > 0 && !this.isBotPartner) {
      backend.post('message/' + this.friend?._id, { message: this.newMessage });
      this.newMessage = '';
    }
  }
}
</script>

<style lang="scss" scoped>
.view-chat-room {
  min-height: 100vh;
  padding-bottom: calc(100px + env(safe-area-inset-bottom));

  [max-width] {
    max-width: 420px;
  }

  .tc-hero {
    img[src='assets/hero/home.webp'] {
      filter: blur(10px) brightness(80%);
    }
  }

  .tc-avatar {
    transform: scale(0.8);
  }
  .tc-link {
    margin-top: 10px;
  }

  /deep/ .actions-wrapper {
    right: unset;
    left: 40px;
    bottom: 0px;
  }
  .input-wrapper {
    position: fixed;
    z-index: 10;
    bottom: calc(20px + env(safe-area-inset-bottom));
    left: 50%;
    transform: translateX(-50%);
    width: 90vw;
    max-width: 400px;

    background: $paragraph;
    box-shadow: $shadow-light;
    @media #{$isDark} {
      background: $color;
    }
    padding: 10px;
    border-radius: 30px;

    .action-wrapper {
      display: none;
      position: absolute;
      padding: 5px;
      background: $success;
      border-radius: 30px;
      right: -10px;
      top: -30px;
      transform: translate(-50%, -50%);
    }

    form {
      display: grid;
      grid-gap: 5px;
      grid-template-columns: 1fr auto;
      textarea {
        font: inherit;
        color: inherit;
        background: none;
        outline: none;
        border: none;
        border-radius: $border-radius;
        padding: 10px;
        width: calc(100% - 20px);
        resize: none;
        height: auto;

        @include custom-scrollbar__light();
        @media #{$isDark} {
          @include custom-scrollbar__dark();
        }
      }
      input[type='submit'] {
        transform: scale(0);
        opacity: 0;
        position: fixed;
        top: -1000px;
        left: -1000px;
      }
    }
    label {
      display: grid;
      place-content: center;
      background: $success;
      color: #fff;
      height: 40px;
      width: 40px;
      border-radius: 40px;
    }
  }
}
</style>
