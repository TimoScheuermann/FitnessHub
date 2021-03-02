<template>
  <div class="view-promote-user" content>
    <div max-width>
      <h3>Moderatoren</h3>

      <tc-spinner
        v-if="!moderators"
        size="20"
        :dark="$store.getters.darkmode"
      />
      <p v-else-if="moderators.length === 0">Es gibt noch keine Moderatoren</p>
      <FHList v-else>
        <FHListItem
          v-for="m in moderators"
          :key="m._id"
          :avatar="m.avatar"
          :title="m.username"
        >
          <tc-button tfbackground="error" name="demote" @click="demote(m)" />
        </FHListItem>
      </FHList>

      <br />
      <h3>Nutzer befördern</h3>

      <br />
      <tl-flow flow="column" v-if="!user">
        <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50">
          <path
            d="M25 0a25 25 0 1025 25A25 25 0 0025 0zm0 9.677a8.871 8.871 0 11-8.871 8.871A8.871 8.871 0 0125 9.678zm0 34.677a19.317 19.317 0 01-14.768-6.875 11.239 11.239 0 019.929-6.028 2.467 2.467 0 01.716.111 13.347 13.347 0 004.123.7 13.3 13.3 0 004.123-.7 2.467 2.467 0 01.716-.111 11.239 11.239 0 019.929 6.028A19.317 19.317 0 0125 44.355z"
            fill="#2ed573"
          />
        </svg>
        <br />
        <tc-link tfcolor="success" @click="$oFS('mgmt-user-search')">
          Nutzer wählen
        </tc-link>
      </tl-flow>

      <div v-else>
        <tl-flow>
          <tc-avatar size="tiny" :src="user.avatar" />
          <b name>{{ user.username }}</b>
        </tl-flow>
        <br />
        <tl-flow>
          <tc-button
            @click="$oFS('mgmt-user-search')"
            icon="swap"
            name="Nutzer ändern"
            tfbackground="alarm"
          />
          <tc-button
            @click="promote"
            icon="user-shield-duo"
            name="Nutzer befördern"
            tfbackground="success"
          />
        </tl-flow>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import FHList from '@/components/list/FHList.vue';
import FHListItem from '@/components/list/FHListItem.vue';
import backend from '@/utils/backend';
import { IUserInfo } from '@/utils/interfaces';
import { Vue, Component } from 'vue-property-decorator';

@Component({
  components: {
    FHList,
    FHListItem
  }
})
export default class PromoteUser extends Vue {
  public moderators: IUserInfo[] | null = null;

  mounted() {
    this.loadModerators();
  }

  get user(): IUserInfo | null {
    const query = this.$route.query.user;
    if (!query) return null;
    return JSON.parse(decodeURI(query as string)) || null;
  }

  public async loadModerators(): Promise<void> {
    this.moderators = (await backend.get('user/moderators')).data;
  }

  public async demote(user: IUserInfo): Promise<void> {
    await backend.post('promote/user/' + user._id);
    this.loadModerators();
  }

  public async promote(): Promise<void> {
    const user = this.user;
    if (!user || !user._id) return;
    await backend.post('promote/moderator/' + user._id);
    this.loadModerators();
    this.$router.replace({ name: this.$route.name || '' });
  }
}
</script>

<style lang="scss" scoped>
.view-promote-user {
  padding-top: 0;

  b[name] {
    margin: 0 20px;
  }

  .fh-list-item {
    .tc-button {
      border-radius: 50px;
      margin-right: -5px;
    }
  }
}
</style>
