<template>
  <div content class="promote-user">
    <h1>Moderators</h1>
    <div class="moderator-list">
      <div class="moderator" v-for="f in moderators" :key="f._id">
        <tl-flow horizontal="space-between">
          <tl-flow>
            <fh-avatar :user="f" />
            <div class="name">{{ f.username }}</div>
          </tl-flow>
          <tl-flow>
            <tc-link tfcolor="error" @click="removeModerator(f._id)">
              <i class="ti-trashcan-alt" />
            </tc-link>
          </tl-flow>
        </tl-flow>
      </div>
    </div>
    <h1>Promote User</h1>
    <tc-input :dark="$store.getters.darkmode" v-model="inputValue" />
    <tc-button name="Promote" variant="filled" @click="addModerator()" />
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
