<template>
  <div class="friends">
    <tc-header-button
      slot="button"
      color="#fff"
      routeName="profile"
      name="Profil"
    />
    <tc-hero :hasFixedHeader="false" :height="200">
      <img
        src="https://images.unsplash.com/photo-1597075933405-a06cb4d6cecb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80"
        slot="background"
        alt=""
      />
      <h1>Freunde</h1>
    </tc-hero>

    <div content>
      <fp-user-search v-model="modalOpened" @user="invite" />
      <h1>Anfragen</h1>

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

      <tl-flow horizontal="space-between">
        <h1>Freunde</h1>
        <tc-link @click="modalOpened = true">Freund hinzufügen</tc-link>
      </tl-flow>
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
.tc-hero {
  img {
    filter: brightness(60%);
  }
  h1 {
    margin: 0px;
    margin-top: env(safe-area-inset-top);
    color: #fff;
  }
}
.tc-header-button {
  position: absolute;
  z-index: 10;
  left: 5vw;
  top: calc(20px + env(safe-area-inset-top));
}
</style>
