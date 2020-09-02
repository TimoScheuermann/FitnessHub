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

    <h1>Promote User</h1>
    <tc-input :dark="$store.getters.darkmode" v-model="inputValue" />
    <tc-button
      :background="$store.state.primaryColor"
      name="Promote"
      variant="filled"
      @click="addModerator()"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { IUserInfo } from '@/utils/interfaces';
import axios from '@/utils/axios';

@Component
export default class PromoteUser extends Vue {
  public moderators: IUserInfo[] = [];
  public inputValue = '';

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

  public async addModerator(userId: string = this.inputValue) {
    if (userId.length < 5) return;
    await axios.post('promote/moderator/' + userId);
    this.loadModerators();
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
