<template>
  <div class="playground">
    <tc-hero>
      <h1>Playground</h1>
    </tc-hero>
    <div content>
      <tc-button
        name="Find a user"
        icon="lens"
        variant="filled"
        tfbackground="error"
        @click="modalOpened = true"
      />
      <fp-user-search v-model="modalOpened" @user="invite" />

      <p>Friends: {{ friends }}</p>
      <p>Invites: {{ invites }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { IUserInfo } from '@/utils/interfaces';
import FPUserSearch from '@/components/shared/FP-UserSearch.vue';
import axios from '@/utils/axios';

@Component({
  components: {
    'fp-user-search': FPUserSearch
  }
})
export default class Playground extends Vue {
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

  public async invite(user: IUserInfo) {
    console.log('inv', user.username);
    const { data } = await axios.post('friends', { targetId: user._id });
    console.log('Res', data);
    this.loadInvites();
  }
}
</script>

<style lang="scss" scoped></style>
