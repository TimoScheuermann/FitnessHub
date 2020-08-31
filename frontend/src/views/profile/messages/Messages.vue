<template>
  <div class="inbox" content>
    <tl-flow horizontal="space-between">
      <h1>Nachrichten</h1>
      <tc-link @click="modalOpened = true">neu</tc-link>
    </tl-flow>

    <p v-if="messages.length === 0">Du hast noch keine Nachrichten</p>
    <transition-group
      v-else-if="messages"
      tag="div"
      name="friend-list"
      class="friend-list"
    >
      <div
        class="friend"
        v-for="c in chatPartners"
        :key="c._id"
        @click="openChat(c._id)"
      >
        <tl-flow horizontal="space-between">
          <tl-flow>
            <fh-avatar :user="c" />
            <div class="info">
              <div class="name">{{ c.username }}</div>
              <div class="message">
                {{ getLatestMessageWith(c._id).content }}
              </div>
            </div>
          </tl-flow>
          <div class="date">
            {{ transformDate(new Date(getLatestMessageWith(c._id).date)) }}
          </div>
        </tl-flow>
      </div>
    </transition-group>

    <tc-modal
      v-if="modalAvailable"
      v-model="modalOpened"
      title="Freund auswählen"
    >
      <template v-if="$store.getters.friends.length === 0">
        <tl-flow flow="column">
          Füge Freunde hinzu, um ihnen Nachrichten zu schicken.
          <tc-button
            icon="users"
            name="Freund hinzufügen"
            routeName="friends"
          />
        </tl-flow>
      </template>
      <template v-else>
        <div class="friend-list">
          <div
            class="friend"
            v-for="f in $store.getters.friends"
            :key="f._id"
            @click="openChat(f._id)"
          >
            <tl-flow horizontal="space-between">
              <fh-avatar :user="f" />
              <div class="name">{{ f.username }}</div>
            </tl-flow>
          </div>
        </div>
      </template>
    </tc-modal>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { formatDate } from '@/utils/functions';
import FHAvatar from '@/components/shared/FH-Avatar.vue';
import { IMessage, IUserInfo } from '@/utils/interfaces';

@Component({
  components: {
    'fh-avatar': FHAvatar
  }
})
export default class Messages extends Vue {
  public modalOpened = false;
  public modalAvailable = false;

  async mounted() {
    setTimeout(() => {
      this.modalAvailable = true;
    }, 700);
  }

  public transformDate(date: number): string {
    return formatDate(date);
  }

  get messages(): IMessage[] {
    return this.$store.getters.messages;
  }

  public getFriendById(id: string): IUserInfo {
    return this.$store.getters.friends.filter(
      (x: IUserInfo) => x._id === id
    )[0];
  }

  public getLatestMessageWith(id: string): IMessage {
    return this.messages
      .filter(x => x.to === id || x.from === id)
      .sort((a, b) => b.date - a.date)[0];
  }

  get chatPartners(): IUserInfo[] {
    const unique: string[] = [];
    this.messages
      .sort((a, b) => b.date - a.date)
      .forEach(x => {
        const room = x.from === this.$store.getters.user._id ? x.to : x.from;
        if (!unique.includes(room)) {
          unique.push(room);
        }
      });
    return unique.map(x => this.getFriendById(x));
  }

  public openChat(id: string) {
    this.modalOpened = false;
    this.$router.push({ name: 'chatroom', params: { id: id } });
  }
}
</script>

<style lang="scss" scoped>
.friend-list {
  background: $paragraph;
  padding: 0 10px;
  border-radius: $border-radius;
  position: relative;
  .friend {
    padding: 10px 0;
    cursor: pointer;
    &:not(:last-child) {
      border-bottom: 1px solid rgba(black, 0.1);
    }
    .tc-avatar {
      height: 30px;
      width: 30px;
    }
    .info {
      margin-left: 10px;
      font-size: 14px;
      .name {
        font-weight: 600;
      }
    }
  }
}
.friend-list-move {
  transition: transform 0.5s;
}
</style>
