<template>
  <div content class="promote-user">
    <h1>Moderators</h1>
    <fh-user-list>
      <fh-user-list-item v-for="m in moderators" :key="m._id" :user="m">
        {{ m.username }}
        <tc-link slot="action" tfcolor="error" @click="removeModerator(m._id)">
          <i class="ti-trashcan-alt" />
        </tc-link>
      </fh-user-list-item>
    </fh-user-list>

    <tl-flow horizontal="space-between">
      <h1>Promote User</h1>
      <tc-link @click="modalOpened = true">Wählen</tc-link>
    </tl-flow>
    <template v-if="selectedUser">
      <fh-user-list>
        <fh-user-list-item :user="selectedUser" :key="selectedUser._id">
          {{ selectedUser.username }}
        </fh-user-list-item>
      </fh-user-list>
      <tc-button
        name="Promote"
        icon="user-shield"
        @click="addModerator"
        variant="filled"
      />
    </template>

    <fh-user-search v-model="modalOpened" @user="u => (selectedUser = u)" />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { IUserInfo } from '@/utils/interfaces';
import axios from '@/utils/axios';
import FHUserSearch from '@/components/shared/FH-UserSearch.vue';

@Component({
  components: {
    'fh-user-search': FHUserSearch
  }
})
export default class PromoteUser extends Vue {
  public moderators: IUserInfo[] = [];
  public modalOpened = false;
  public selectedUser: IUserInfo | null = null;

  mounted() {
    this.loadModerators();
  }

  public async loadModerators(): Promise<void> {
    this.moderators = (await axios.get('user/moderators')).data;
  }

  public async removeModerator(userId: string) {
    await axios.post('promote/user/' + userId);
    this.loadModerators();
  }

  public async addModerator() {
    if (this.selectedUser) {
      await axios.post('promote/moderator/' + this.selectedUser._id);
      this.loadModerators();
    }
  }
}
</script>

<style lang="scss" scoped>
.moderator-list {
  background: $paragraph;
  padding: 0 10px;
  border-radius: $border-radius;
  .moderator {
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
  }
}
</style>
