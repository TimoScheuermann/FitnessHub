<template>
  <div class="view-chat-room">
    <FHSwipeable class="chat-header" @swipeDown="$cFS('messages')">
      <tl-flow horizontal="start">
        <tc-header-button name="" tfcolor="success" @click="$cFS('messages')" />
      </tl-flow>
      <template v-if="friend">
        <tl-flow flow="column">
          <tc-avatar size="tiny" :src="friend.avatar" />
          <span>{{ friend.username }}</span>
        </tl-flow>
        <tl-flow horizontal="end">
          <tc-action :dark="$store.getters.darkmode">
            <tc-action-item title="Training planen" icon="calendar-alt" />
            <tc-action-item title="Herausfordern" icon="tropy" />
            <tc-action-item success title="Profil ansehen" icon="lens" />
          </tc-action>
        </tl-flow>
      </template>
    </FHSwipeable>

    <tl-flow v-if="!friend" flow="column">
      <br />
      <tc-spinner
        variant="dots-spin"
        size="30"
        :dark="$store.getters.darkmode"
      />
      <p>Freund wird geladen...</p>
    </tl-flow>

    <div class="input-wrapper" v-if="!this.isBotPartner">
      <form @submit.prevent="sendMessage">
        <textarea
          v-model="newMessage"
          required
          placeholder="Nachricht"
          :rows="numberOfLineBreaks"
        />
        <tl-flow>
          <label for="submit" cursor><i class="ti-reply"/></label>
        </tl-flow>
        <input id="submit" type="submit" />
      </form>
    </div>

    <div content>
      <div max-width>
        <tl-flow v-if="!messages" flow="column">
          <br />
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
    UserManagement.markMessagesAsRead(this.$route.params.friendId);
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

  .chat-header {
    position: sticky;
    display: grid;
    grid-template-columns: 30px 1fr 30px;
    padding: env(safe-area-inset-top) 5vw 0;
    min-height: 50px;
    top: 0;
    z-index: 10;

    border-bottom: 1px solid rgba($color, 0.1);
    @include backdrop-blur($background);

    @media #{$isDark} {
      border-color: rgba($color_dark, 0.1);
      @include backdrop-blur($background_dark);
    }
    .tc-avatar {
      transform: scale(0.8);
    }
    span {
      margin: 5px;
      font-weight: 500;
    }
    .tc-action {
      z-index: 100;
      /deep/ .actions-wrapper {
        bottom: unset;
        top: 0px;
        z-index: 110;
      }
    }
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

/deep/ .wrapper-enter,
/deep/ .wrapper-leave-to {
  opacity: 0 !important;
  transform-origin: top right !important;
  transform: scale(0) !important;
}
</style>
