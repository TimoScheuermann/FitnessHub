<template>
  <div class="view-messages" content>
    <div max-width>
      <template v-if="activeChats && inActiveChats">
        <template v-if="activeChats.length === 0 && inActiveChats.length === 0">
          <p>Füge Freunde hinzu, um mit ihnen zu chatten</p>
        </template>
      </template>
      <template v-if="activeChats && activeChats.length > 0">
        <h3>Nachrichten</h3>
        <FHList>
          <FHListItem
            v-for="m in activeChats"
            :key="m.friend._id"
            :avatar="m.friend.avatar"
            :title="m.friend.username"
            :subtitle="m.message"
            :routeName="''"
            @click="$oFS('chatroom', { friendId: m.friend._id })"
          >
            <div :space="m.unread > 0">{{ getDay(m.timestamp) }}</div>
            <tc-badge tfcolor="success" position="inside" :value="m.unread" />
          </FHListItem>
        </FHList>
      </template>

      <template v-if="inActiveChats && inActiveChats.length > 0">
        <h3>Konversation starten</h3>
        <FHList>
          <FHListItem
            v-for="m in inActiveChats"
            :key="m._id"
            :avatar="m.avatar"
            :title="m.username"
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

interface ActiveChat {
  friend: IUserInfo;
  message: string;
  timestamp: number;
  unread: number;
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

  get activeChats(): ActiveChat[] | null {
    if (!this.friends) return null;
    if (!this.messages) return null;
    return (this.friends
      .map(f => {
        const message = this.getLatestMessageWith(f._id);
        if (!message) return null;
        let content = message.content;
        if (message.type === 'exercisePublish') {
          content =
            'Deine Übung ' +
            JSON.parse(message.content).title +
            ' wurde veröffentlicht!';
        }
        return {
          friend: f,
          message: content,
          timestamp: message.date,
          unread: this.getAmountOfUnread(f._id)
        };
      })
      .filter(x => !!x) as ActiveChat[]).sort(
      (a, b) => b.timestamp - a.timestamp
    );
  }

  get inActiveChats(): IUserInfo[] | null {
    if (!this.messages) return this.friends;
    if (!this.friends) return null;
    return this.friends.filter(f => !this.getLatestMessageWith(f._id));
  }

  public getDay(timestamp: number): string {
    return days[new Date(timestamp).getDay()].substring(0, 2);
  }

  public getAmountOfUnread(friendId: string): number {
    if (!this.messages) return 0;
    return this.messages.filter(x => x.from === friendId && !x.read).length;
  }

  public getLatestMessageWith(friend: string): IMessage | null {
    if (!this.messages) return null;
    const message = this.messages
      .filter(x => x.from === friend || x.to === friend)
      .sort((a, b) => b.date - a.date)[0];
    if (message) return message;
    return null;
  }
}
</script>

<style lang="scss" scoped>
.view-messages {
  padding-top: 0;

  [space] {
    margin-right: 30px;
  }
}
</style>
