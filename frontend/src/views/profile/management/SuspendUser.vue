<template>
  <div class="suspend-user" content>
    <tl-flow horizontal="space-between">
      <h1>Gesperrte Nutzer</h1>
      <tc-spinner v-if="!suspended" :dark="$store.getters.darkmode" />
    </tl-flow>

    <fh-user-list>
      <fh-user-list-item v-for="s in suspended" :key="s._id" :user="s">
        {{ s.username }}
        <tc-link slot="action" tfcolor="error" @click="pardonUser(s._id)">
          entsperren
        </tc-link>
      </fh-user-list-item>
    </fh-user-list>
    <p v-if="suspended.length === 0">Aktuell ist kein Nutzer gesperrt</p>

    <tl-flow horizontal="space-between">
      <h1>User sperren</h1>
      <tc-link tfcolor="success" @click="openUserSearch">Wählen</tc-link>
    </tl-flow>
    <template v-if="selectedUser">
      <fh-user-list>
        <fh-user-list-item :user="selectedUser" :key="selectedUser._id">
          {{ selectedUser.username }}
        </fh-user-list-item>
      </fh-user-list>
      <br />
      <tl-grid minWidth="100" gap="10">
        <tc-input
          type="datetime-local"
          :dark="$store.getters.darkmode"
          v-model="date"
        />
        <tc-button
          :disabled="$store.getters.loading"
          tfbackground="error"
          name="Sperren"
          icon="blocked"
          @click="suspendUser"
          variant="filled"
        />
      </tl-grid>
    </template>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { IUserInfo } from '@/utils/interfaces';
import axios from '@/utils/axios';
import { EventBus } from '@/utils/eventbus';

@Component
export default class SuspendUser extends Vue {
  public suspended: IUserInfo[] = [];
  public modalOpened = false;
  public date = '';
  public selectedUser: IUserInfo | null = null;

  mounted() {
    this.loadSuspendedUsers();

    EventBus.$on(
      'promoteUser-us',
      (user: IUserInfo) => (this.selectedUser = user)
    );
  }

  public openUserSearch(): void {
    EventBus.$emit('modal-user-search', 'promoteUser-us');
  }

  public async loadSuspendedUsers(): Promise<void> {
    this.suspended = (await axios.get('user/suspended')).data;
  }

  public async pardonUser(id: string) {
    await axios.delete('user/suspend/' + id);
    await this.loadSuspendedUsers();
  }

  public async suspendUser() {
    if (this.selectedUser && this.date.length > 0) {
      await axios.post(
        'user/suspend/' +
          this.selectedUser._id +
          '/' +
          new Date(this.date).getTime()
      );
      await this.loadSuspendedUsers();
    }
  }
}
</script>

<style lang="scss" scoped></style>
