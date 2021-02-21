<template>
  <div class="view-messages" content>
    <div max-width>
      <template v-if="activeChats && inActiveChats">
        <template v-if="activeChats.length === 0 && inActiveChats.length === 0">
          <p>Füge Freunde hinzu, um mit ihnen zu chatten</p>
        </template>
      </template>
      <template v-if="activeChats">
        <h3>Nachrichten</h3>
        <FHList>
          <FHListItem
            v-for="m in activeChats"
            :key="m._id"
            :avatar="m.avatar"
            :title="m.username"
            :subtitle="m.message"
            :description="m.day"
            :routeName="''"
            @click="$oFS('chatroom', { friendId: m._id })"
          />
        </FHList>
      </template>

      <template v-if="inActiveChats">
        <h3>Konversation starten</h3>
        <FHList>
          <FHListItem
            v-for="m in inActiveChats"
            :key="m._id"
            :avatar="m.avatar"
            :title="m.username"
            :description="m.day"
            :routeName="''"
            @click="$oFS('chatroom', { friendId: m._id })"
          />
        </FHList>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import FHList from '@/components/list/FHList.vue';
import FHListItem from '@/components/list/FHListItem.vue';
import { days } from '@/utils/constants';
import { IMessage, IUserInfo } from '@/utils/interfaces';
import { UserManagement } from '@/utils/UserManagement';
import { Vue, Component } from 'vue-property-decorator';

interface MessageListItem {
  _id: string;
  username: string;
  avatar: string;
  message: string | null;
  day: string;
  timestamp: number;
}

@Component({
  components: {
    FHListItem,
    FHList
  }
})
export default class Messages extends Vue {
  get messages(): IMessage[] | null {
    return UserManagement.getMessages();
  }

  get friends(): IUserInfo[] | null {
    return UserManagement.getFriends();
  }

  get messageList(): MessageListItem[] | null {
    if (!this.friends) return null;
    return this.friends
      .map(f => {
        const latest = this.getLatestMessageWith(f._id);
        if (!latest) {
          return {
            ...f,
            message: null,
            day: '',
            timestamp: 0
          };
        } else {
          return {
            ...f,
            message: latest.content,
            day: days[new Date(latest.date).getDay()].substring(0, 2),
            timestamp: latest.date
          };
        }
      })
      .sort((a, b) => b.timestamp - a.timestamp);
  }

  get activeChats(): MessageListItem[] | null {
    const messages = this.messageList;
    if (!messages) return null;
    return messages.filter(x => x.timestamp !== 0);
  }

  get inActiveChats(): MessageListItem[] | null {
    const messages = this.messageList;
    if (!messages) return null;
    return messages
      .filter(x => x.timestamp == 0)
      .sort((a, b) => a.username.localeCompare(b.username));
  }

  public getAmountOfUnread(friendId: string): number {
    if (!this.messages) return 0;
    return this.messages.filter(x => x.from === friendId && !x.read).length;
  }

  public getLatestMessageWith(friend: string): IMessage | null {
    if (!this.messages) return null;
    const message = this.messages
      .filter(x => x.from === friend || x.to === friend)
      .sort((a, b) => a.date - b.date)[0];
    if (message) return message;
    return null;
  }
}
</script>

<style lang="scss" scoped>
.view-messages {
  padding-top: 0;
}
</style>
