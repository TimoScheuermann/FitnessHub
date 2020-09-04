<template>
  <div class="friend-detail" content>
    <tc-list :dark="$store.getters.darkmode">
      <tc-list-item
        icon="chat-bubbles"
        title="Nachricht senden"
        :to="chatRoute"
      />
      <tc-list-item icon="trophy" title="Herausfordern" />
      <tc-list-item
        red
        icon="trashcan-alt"
        title="Freund entfernen"
        @click="removeFriend"
      />
    </tc-list>

    <h1>Workouts</h1>
    <p>soon.</p>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import axios from '@/utils/axios';

@Component
export default class FriendDetail extends Vue {
  @Prop() friendInfo!: object;

  public async removeFriend(): Promise<void> {
    await axios.delete('friends/remove/' + this.$route.params.id);
    this.$router.push({ name: 'friends' });
  }

  get chatRoute(): object {
    return { name: 'chatroom', params: this.$route.params };
  }
}
</script>

<style lang="scss" scoped>
.tc-list {
  margin-top: 20px;
}
.tc-list-item[red] /deep/ {
  i,
  .tc-list-item--title {
    color: $error;
  }
}
</style>
