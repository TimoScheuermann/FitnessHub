<template>
  <div class="view-add-friend">
    <FHFullScreenCloser @click="$cFS('friends')" />
    <FHHeader title="Freund hinzufügen" />

    <div content>
      <div max-width>
        <br />
        <h1 center>Freunde hinzufügen</h1>
        <tl-flow>
          <img src="assets/team.svg" height="100" alt="" />
        </tl-flow>
        <p center>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis esse
          consequuntur unde ad amet deleniti rem ex! Delectus voluptatum sit
          dolor aperiam error similique, in vitae maiores, deserunt fugit et!
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
          <br />
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
            >
              <tc-button
                tfbackground="success"
                name="einladen"
                @click="sendInvite(r._id)"
              />
            </FHListItem>
          </FHList>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import FHFullScreenCloser from '@/components/FHFullScreenCloser.vue';
import FHHeader from '@/components/FHHeader.vue';
import FHList from '@/components/list/FHList.vue';
import FHListItem from '@/components/list/FHListItem.vue';
import backend from '@/utils/backend';
import { closeFullscreen } from '@/utils/functions';
import { IUserInfo } from '@/utils/interfaces';
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

  public sendInvite(userId: string) {
    UserManagement.sendInvite(userId);
    closeFullscreen('friends');
  }

  public async search(): Promise<void> {
    if (this.query.length > 0) {
      const { data } = await backend.post('user/search', { query: this.query });
      if (!data) this.results = [];
      else {
        const friendIds = (UserManagement.getFriends() || []).map(x => x._id);
        const invites = UserManagement.getInvites() || [];
        const inviteIds = invites.map(x => [x.invitee._id, x.target._id]);

        const ids = [...new Set([...friendIds, ...inviteIds.flat()])];
        ids.push(UserManagement.getUserID() || '');
        this.results = (data as IUserInfo[]).filter(x => !ids.includes(x._id));
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.view-add-friend {
  min-height: 100vh;
  // background-image: url('/assets/fs-bg-light.svg');
  // background-repeat: no-repeat;
  // background-size: contain;
  // @include fs-background();

  [max-width] {
    max-width: 500px;
  }
  [content] {
    padding-bottom: calc(20px + env(safe-area-inset-bottom));
  }

  h1 {
    padding-top: env(safe-area-inset-top);
  }
}
</style>
