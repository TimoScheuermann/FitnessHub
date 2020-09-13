<template>
  <div class="messages" content>
    <div class="messages-wrapper">
      <tl-flow horizontal="space-between">
        <h1>Nachrichten</h1>
        <tc-link @click="modalOpened = true" tfcolor="success">neu</tc-link>
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
            <div class="name">
              <span v-if="unreadMessages(c._id) > 0">
                ({{ unreadMessages(c._id) }})
              </span>
              {{ c.username }}
            </div>
            <div
              class="message"
              v-if="getLatestMessageWith(c._id).type === 'message'"
            >
              {{ getLatestMessageWith(c._id).content }}
            </div>
            <div class="message" v-else>Neue Nachricht!</div>
          </div>
          <div slot="action" class="date">
            {{ transformDate(new Date(getLatestMessageWith(c._id).date)) }}
          </div>
        </fh-user-list-item>
      </fh-user-list>
    </div>

    <tc-modal
      v-if="modalAvailable"
      v-model="modalOpened"
      title="Freund auswählen"
      :dark="$store.getters.darkmode"
    >
      <tl-flow flow="column" v-if="$store.getters.friends.length === 0">
        Füge Freunde hinzu, um ihnen Nachrichten zu schicken.
        <tc-button
          :disabled="$store.getters.loading"
          icon="users"
          name="Freund hinzufügen"
          routeName="friends"
        />
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
import { formatDate, getFriend } from '@/utils/functions';
import { IMessage, IUserInfo } from '@/utils/interfaces';
import { aDay, days, fhBotId } from '@/utils/constants';

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
    if (new Date().getTime() - date > aDay)
      return days[new Date(date).getDay()];
    return formatDate(date);
  }

  get messages(): IMessage[] {
    return this.$store.getters.messages;
  }

  public unreadMessages(id: string): number {
    return this.messages.filter(x => x.from === id && !x.read).length;
  }

  public getFriendById(id: string): IUserInfo | undefined {
    return getFriend(id);
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
    return unique
      .map(x => {
        if (x === fhBotId) {
          return {
            _id: x,
            username: 'FitnessHub',
            avatar: 'pwa/splash/apple-icon-180.jpg'
          };
        }
        return this.getFriendById(x);
      })
      .filter(x => !!x)
      .map(x => x as IUserInfo);
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
    font-weight: 700;
    margin-top: 7.5px;
    span {
      color: $error;
    }
  }
  .message {
    opacity: 0.7;
    margin-bottom: 7.5px;
  }
}
.date {
  white-space: nowrap;
  font-size: 14px;
}
.messages-wrapper {
  position: relative;
  max-width: 800px;
  left: 50%;
  transform: translateX(-50%);
}
</style>
