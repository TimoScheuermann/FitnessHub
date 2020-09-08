<template>
  <tc-modal
    v-if="display"
    :dark="$store.getters.darkmode"
    title="Finde einen Champion"
    v-model="modalOpened"
  >
    <tc-input
      :dark="$store.getters.darkmode"
      icon="lens"
      v-model="query"
      @input="search"
    />
    <fh-user-list>
      <fh-user-list-item
        v-for="u in results"
        :key="u._id"
        :user="u"
        @click="selected(u)"
      >
        {{ u.username }}
      </fh-user-list-item>
    </fh-user-list>
  </tc-modal>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { IUserInfo } from '@/utils/interfaces';
import axios from '@/utils/axios';
import { EventBus } from '@/utils/eventbus';

@Component
export default class FHUserSearch extends Vue {
  public results: IUserInfo[] = [];
  public query = '';
  public display = false;
  public modalOpened = false;
  public returnSocket = '';

  mounted() {
    setTimeout(() => {
      this.display = true;
    }, 500);
    EventBus.$on('usersearch', (returnSocket: string) => {
      this.returnSocket = returnSocket;
      this.modalOpened = true;
    });
  }

  public selected(selected: IUserInfo): void {
    EventBus.$emit(this.returnSocket, selected);
    this.modalOpened = false;
  }

  public async search(): Promise<void> {
    if (this.query.length > 0) {
      const { data } = await axios.post('user/search', {
        query: this.query
      });
      this.results = data;
    }
  }
}
</script>

<style lang="scss" scoped>
.fh-user-list {
  margin-top: 20px;
  @media #{$isDesktop} {
    margin-bottom: 20px;
  }
}
</style>
