<template>
  <div class="view-add-friend">
    <FHFullScreenCloser @click="$cFS('friends')" />
    <FHHeader title="Freund hinzufügen" />

    <div max-width content>
      <br />
      <h1 center>Freunde hinzufügen</h1>
      <tl-flow>
        <img src="assets/team.svg" height="100" alt="" />
      </tl-flow>
      <p center>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis esse
        consequuntur unde ad amet deleniti rem ex! Delectus voluptatum sit dolor
        aperiam error similique, in vitae maiores, deserunt fugit et!
      </p>
      <br />
      <tc-input
        v-model="query"
        @input="search"
        :dark="$store.getters.darkmode"
        title="Name"
      />

      <p v-if="!results" center>
        Suche nach einem Nutzer, um ihm eine Anfrage zu schicken.
      </p>
      <tl-flow v-else-if="results.length === 0" flow="column">
        <i error huge class="ti-exclamation-triangle" />
        <p>Die Suche ergab keine Treffer</p>
      </tl-flow>
      <template v-else>
        <br />
        <FHList>
          <FHListItem
            v-for="r in results"
            :key="r._id"
            :avatar="r.avatar"
            :title="r.username"
            :description="isFriend(r._id) ? 'befreundet' : null"
          >
            <tc-button
              v-if="!isFriend(r._id) && !isInvited(r._id)"
              tfbackground="success"
              name="einladen"
              @click="sendInvite(r._id)"
            />
            <tc-button
              v-if="isInvited(r._id)"
              tfbackground="error"
              name="abbrechen"
              @click="cancelInvite(r._id)"
            />
            <tc-button
              v-if="hasBeenInvitedBy(r._id)"
              tfbackground="alarm"
              name="annehmen"
              @click="acceptInvite(r._id)"
            />
          </FHListItem>
        </FHList>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import FHFullScreenCloser from '@/components/FHFullScreenCloser.vue';
import FHHeader from '@/components/FHHeader.vue';
import FHList from '@/components/list/FHList.vue';
import FHListItem from '@/components/list/FHListItem.vue';
import backend from '@/utils/backend';
import { IPendingFriendship, IUserInfo } from '@/utils/interfaces';
import { UserManagement } from '@/utils/UserManagement';
import { Vue, Component } from 'vue-property-decorator';

@Component({
  components: {
    FHFullScreenCloser,
    FHHeader,
    FHList,
    FHListItem
  }
})
export default class AddFriend extends Vue {
  public query = '';
  public results: IUserInfo[] | null = null;

  mounted() {
    this.query = 'Jea';
    this.search();
  }

  public isFriend(user: string): boolean {
    const friends = UserManagement.getFriends();
    if (!friends) return false;
    return friends.filter(x => x._id === user).length === 1;
  }

  public isInvited(user: string): boolean {
    const invites: IPendingFriendship[] =
      this.$store.getters.friendRequests || [];
    if (!invites) return false;
    return invites.filter(x => x.target._id === user).length === 1;
  }

  public hasBeenInvitedBy(user: string): boolean {
    const invites: IPendingFriendship[] =
      this.$store.getters.friendRequests || [];
    if (!invites) return false;
    return invites.filter(x => x.invitee._id === user).length === 1;
  }

  public cancelInvite(userId: string) {
    UserManagement.cancelInvite(userId);
  }
  public acceptInvite(userId: string) {
    UserManagement.acceptInvite(userId);
  }
  public sendInvite(userId: string) {
    UserManagement.sendInvite(userId);
  }

  public search(): void {
    if (this.query.length > 0) {
      backend.post('user/search', { query: this.query }).then(res => {
        this.results = res.data;
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.view-add-friend {
  min-height: 100vh;
}
</style>
