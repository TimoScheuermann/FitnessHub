<template>
  <div class="friends" content>
    <fh-user-search v-model="modalOpened" @user="invite" />

    <h1>Anfragen</h1>

    <div class="friend-list">
      <div class="friend" v-for="i in invites" :key="i._id">
        <tl-flow horizontal="space-between">
          <template v-if="i.invitee._id === $store.getters.user._id">
            <tl-flow>
              <fh-avatar :user="i.target" />
              <div class="name">{{ i.target.username }}</div>
            </tl-flow>
            <tl-flow>
              <div class="pending">pending</div>
              <tc-link tfcolor="error" @click="removeFriend(i.target._id)">
                <i class="ti-cross" />
              </tc-link>
            </tl-flow>
          </template>
          <template v-else>
            <tl-flow>
              <fh-avatar :user="i.invitee" />
              <div class="name">{{ i.invitee.username }}</div>
            </tl-flow>
            <tl-flow>
              <tc-link tfcolor="success" @click="acceptInvite(i._id)">
                <i class="ti-checkmark" />
              </tc-link>
              <tc-link tfcolor="error" @click="denyInvite(i._id)">
                <i class="ti-cross" />
              </tc-link>
            </tl-flow>
          </template>
        </tl-flow>
      </div>
    </div>

    <tl-flow horizontal="space-between">
      <h1>Freunde</h1>
      <tc-link @click="modalOpened = true">
        <i class="ti-plus-inverted" /> Freund hinzufügen
      </tc-link>
    </tl-flow>

    <div class="friend-list">
      <div class="friend" v-for="f in friends" :key="f._id">
        <tl-flow horizontal="space-between">
          <tl-flow>
            <fh-avatar :user="f" />
            <div class="name">{{ f.username }}</div>
          </tl-flow>
          <tl-flow>
            <tc-link tfcolor="error" @click="removeFriend(f._id)">
              <i class="ti-trashcan-alt" />
            </tc-link>
          </tl-flow>
        </tl-flow>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { IUserInfo, IPendingFriendship } from '@/utils/interfaces';
import axios from '@/utils/axios';
import FHUserSearch from '@/components/shared/FH-UserSearch.vue';
import FHAvatar from '@/components/shared/FH-Avatar.vue';

@Component({
  components: {
    'fh-user-search': FHUserSearch,
    'fh-avatar': FHAvatar
  }
})
export default class Friends extends Vue {
  public modalOpened = false;

  public friends: IUserInfo[] = [];
  public invites: IPendingFriendship[] = [];

  mounted() {
    this.loadFriends();
    this.loadInvites();
  }

  async loadInvites() {
    this.invites = (await axios.get('friends/invitations')).data;
  }

  async loadFriends() {
    this.friends = (await axios.get('friends')).data;
  }

  public async invite(user: IUserInfo): Promise<void> {
    await axios.post('friends/invite/' + user._id);
    this.loadInvites();
  }

  public async acceptInvite(friendshipId: string): Promise<void> {
    await axios.put('friends/accept/' + friendshipId);
    this.$store.state.notifications.friends--;
    this.loadInvites();
    this.loadFriends();
  }

  public async denyInvite(friendshipId: string): Promise<void> {
    await axios.delete('friends/deny/' + friendshipId);
    this.$store.state.notifications.friends--;
    this.loadInvites();
  }

  public async removeFriend(friendId: string): Promise<void> {
    await axios.delete('friends/remove/' + friendId);
    this.loadFriends();
  }
}
</script>

<style lang="scss" scoped>
.friend-list {
  background: $paragraph;
  padding: 0 10px;
  border-radius: $border-radius;
  .friend {
    padding: 10px 0;
    &:not(:last-child) {
      border-bottom: 1px solid rgba(black, 0.1);
    }
    .tc-avatar {
      height: 30px;
      width: 30px;
    }
    .name {
      margin-left: 10px;
      font-weight: 500;
    }
    .pending {
      opacity: 0.6;
      font-style: italic;
    }
    .tc-link:nth-child(2) {
      margin-left: 10px;
    }
  }
}
</style>
