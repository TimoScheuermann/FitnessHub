<template>
  <div class="inbox" content>
    <tl-flow horizontal="space-between">
      <h1>Nachrichten</h1>
      <tc-link @click="modalOpened = true" :color="$store.state.primaryColor"
        >neu</tc-link
      >
    </tl-flow>

    <p v-if="messages.length === 0">Du hast noch keine Nachrichten</p>

    <fh-user-list v-else-if="messages">
      <fh-user-list-item
        v-for="c in chatPartners"
        :key="c._id"
        @click="openChat(c._id)"
        :user="c"
      >
        <div class="info">
          <div class="name">{{ c.username }}</div>
          <div class="message">
            {{ getLatestMessageWith(c._id).content }}
          </div>
        </div>
        <div slot="action" class="date">
          {{ transformDate(new Date(getLatestMessageWith(c._id).date)) }}
          <i class="ti-circle" v-if="!latestMessageRead(c._id)" />
        </div>
      </fh-user-list-item>
    </fh-user-list>

    <tc-modal
      v-if="modalAvailable"
      v-model="modalOpened"
      title="Freund auswählen"
      :dark="$store.getters.darkmode"
    >
      <tl-flow flow="column" v-if="$store.getters.friends.length === 0">
        Füge Freunde hinzu, um ihnen Nachrichten zu schicken.
        <tc-button icon="users" name="Freund hinzufügen" routeName="friends" />
      </tl-flow>
      <fh-user-list v-else>
        <fh-user-list-item
          v-for="f in $store.getters.friends"
          :key="f._id"
          @click="openChat(f._id)"
          :user="f"
        >
          {{ f.username }}
        </fh-user-list-item>
      </fh-user-list>
    </tc-modal>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { formatDate } from '@/utils/functions';
import { IMessage, IUserInfo } from '@/utils/interfaces';

@Component
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

  public latestMessageRead(id: string): boolean {
    const m = this.messages
      .filter(x => x.from === id)
      .sort((a, b) => b.date - a.date)[0];
    if (m) return m.read;
    return true;
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
.info {
  font-size: 14px;
  .name {
    font-weight: 600;
  }
}
.date {
  font-style: italic;
  i {
    color: $error;
    margin-left: 5px;
  }
}
</style>
