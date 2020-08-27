<template>
  <div class="friends">
    <tc-hero
      color="#fff"
      gradient="linear-gradient(90deg, rgb(243, 114, 209) 0%,rgb(44, 19, 241) 100%);"
    >
      <h1>Freunde</h1>
    </tc-hero>
    <div content>
      <fp-user-search v-model="modalOpened" @user="invite" />
      <tc-headline title="Anfragen" />

      <tc-table>
        <template slot="head">
          <tc-th></tc-th>
          <tc-th>Username</tc-th>
          <tc-th></tc-th>
          <tc-th></tc-th>
        </template>
        <tc-tr v-for="u in invites" :key="u._id">
          <template v-if="u.invitee === $store.getters.user._id">
            <tc-td>
              <fp-avatar :user="u.targetUser" size="tiny" />
            </tc-td>
            <tc-td>{{ u.targetUser.username }}</tc-td>
            <tc-td>warte auf Antwort...</tc-td>
            <tc-td>
              <tc-link tfcolor="error">abbrechen</tc-link>
            </tc-td>
          </template>
          <template v-else>
            <tc-td>
              <fp-avatar :user="u.inviteeUser" size="tiny" />
            </tc-td>
            <tc-td>{{ u.inviteeUser.username }}</tc-td>
            <tc-td>
              <tc-link tfcolor="success" @click="acceptInvite(u._id)">
                annehmen
              </tc-link>
            </tc-td>
            <tc-td>
              <tc-link tfcolor="error" @click="denyInvite(u._id)">
                ablehnen
              </tc-link>
            </tc-td>
          </template>
        </tc-tr>
      </tc-table>

      <tc-headline title="Freunde">
        <tc-link @click="modalOpened = true">Freund hinzufügen</tc-link>
      </tc-headline>
      <tc-table>
        <template slot="head">
          <tc-th></tc-th>
          <tc-th>Username</tc-th>
          <tc-th></tc-th>
        </template>
        <tc-tr v-for="u in friends" :key="u._id">
          <tc-td>
            <fp-avatar :user="u" size="tiny" />
          </tc-td>
          <tc-td>{{ u.username }}</tc-td>
          <tc-td>
            <tc-link tfcolor="error" @click="removeFriend(u._id)">
              remove
            </tc-link>
          </tc-td>
        </tc-tr>
      </tc-table>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { IUserInfo } from '@/utils/interfaces';
import axios from '@/utils/axios';
import FPUserSearch from '@/components/shared/FP-UserSearch.vue';
import FPAvatar from '@/components/shared/FP-Avatar.vue';

@Component({
  components: {
    'fp-user-search': FPUserSearch,
    'fp-avatar': FPAvatar
  }
})
export default class Friends extends Vue {
  public modalOpened = false;

  public friends: IUserInfo[] = [];
  public invites: IUserInfo[] = [];

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
    await axios.post('friends', { targetId: user._id });
    this.loadInvites();
  }

  public async acceptInvite(id: string): Promise<void> {
    await axios.put('friends', { friendshipId: id });
    this.loadInvites();
    this.loadFriends();
  }

  public async denyInvite(id: string): Promise<void> {
    await axios.delete('friends/deny/' + id);
    this.loadInvites();
  }

  public async removeFriend(id: string): Promise<void> {
    await axios.delete('friends/remove/' + id);
    this.loadFriends();
  }
}
</script>

<style lang="scss" scoped>
.friends {
  h1 {
    margin: 0px;
  }
}
</style>
