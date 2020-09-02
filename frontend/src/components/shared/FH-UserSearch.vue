<template>
  <tc-modal
    :dark="$store.getters.darkmode"
    title="Finde einen Champion"
    v-model="innerValue"
    @close="close"
  >
    <tc-input :dark="$store.getters.darkmode" icon="lens" v-model="query" />
    <fh-user-list>
      <fh-user-list-item
        v-for="u in results"
        :key="u._id"
        @click="selected(u)"
        :user="u"
      >
        {{ u.username }}
      </fh-user-list-item>
    </fh-user-list>
  </tc-modal>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { IUserInfo } from '@/utils/interfaces';
import axios from '@/utils/axios';

@Component
export default class FHUserSearch extends Vue {
  @Prop() value!: boolean;

  public results: IUserInfo[] = [];
  public query = '';
  public innerValue = this.value;

  @Watch('value')
  public valueChanged(): void {
    this.innerValue = this.value;
  }

  public selected(selected: IUserInfo): void {
    this.$emit('user', selected);
    this.close();
  }

  public close(): void {
    this.innerValue = false;
    this.$emit('input', this.innerValue);
  }

  @Watch('query')
  public async queryChanged(): Promise<void> {
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
