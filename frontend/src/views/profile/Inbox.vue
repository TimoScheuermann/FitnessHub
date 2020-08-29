<template>
  <div class="inbox" content>
    <tl-flow horizontal="space-between">
      <h1>Inbox</h1>
      <tc-spinner v-if="!inbox" size="20" />
    </tl-flow>

    <template v-if="inbox">
      <p v-if="inbox.length == 0">
        Es liegen keine Nachrichten in deiner Inbox
      </p>
      <div v-else class="inbox-items">
        <div class="inbox-item" v-for="i in inbox" :key="i._id">
          <tl-flow horizontal="start">
            <fp-avatar :user="i.from" size="tiny" />
            <tl-flow flow="column" vertical="start" id="info">
              <div class="name">{{ i.from.username }}</div>
              <div class="date">{{ transformDate(i.date) }}</div>
            </tl-flow>
          </tl-flow>
          <tc-link tfcolor="error" @click="removeFromInbox(i._id)">
            <i class="ti-cross-inverted" />
          </tc-link>
          <tc-divider />
          <div class="message">{{ i.message }}</div>
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { IInbox } from '@/utils/interfaces';
import axios from '@/utils/axios';
import { formatDate } from '@/utils/functions';
import FPAvatar from '@/components/shared/FP-Avatar.vue';

@Component({
  components: {
    'fp-avatar': FPAvatar
  }
})
export default class Inbox extends Vue {
  public inbox: IInbox[] | null = null;

  async mounted() {
    this.inbox = (await axios.get('inbox')).data;
  }

  public transformDate(date: number): string {
    return formatDate(date);
  }

  public async removeFromInbox(id: string) {
    if (this.inbox) {
      this.inbox = this.inbox.filter(x => x._id !== id);
    }
    this.$store.state.notifications.inbox--;
    await axios.delete('inbox/' + id);
  }
}
</script>

<style lang="scss" scoped>
.inbox-items {
  .inbox-item {
    background: $paragraph;
    border-radius: $border-radius;
    padding: 20px;
    &:not(:first-child) {
      margin-top: 20px;
    }
    position: relative;

    .tc-link {
      position: absolute;
      top: 5px;
      right: 5px;
      font-size: 24px;
    }

    #info {
      margin-left: 10px;
      .name {
        font-weight: 500;
      }
      .date {
        opacity: 0.5;
        font-size: 0.9em;
      }
    }
    .message {
      margin-top: 0px;
    }
  }
}
</style>
