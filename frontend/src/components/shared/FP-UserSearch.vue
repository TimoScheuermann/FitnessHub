<template>
  <tc-modal title="Finde einen Champion" v-model="innerValue" @close="close">
    <tc-input icon="lens" v-model="query" />
    <div class="found-users">
      <div class="user" v-for="u in results" :key="u._id" @click="selected(u)">
        <fp-avatar size="tiny" :user="u" />
        <h3>{{ u.username }}</h3>
      </div>
    </div>
  </tc-modal>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { IUserInfo } from '@/utils/interfaces';
import FPAvatar from './FP-Avatar.vue';
import axios from '@/utils/axios';

@Component({
  components: {
    'fp-avatar': FPAvatar
  }
})
export default class FPUserSearch extends Vue {
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
      const { data } = await axios.post(
        'https://api.timos.design:3000/user/search',
        {
          query: this.query
        }
      );
      this.results = data;
    }
  }
}
</script>

<style lang="scss" scoped>
.found-users {
  margin-bottom: 20px;
  .user {
    display: flex;
    align-items: center;
    h3 {
      margin-left: 10px;
    }
    &:not(:last-child) {
      border-bottom: 1px solid rgba(black, 0.2);
    }
    cursor: pointer;
    transition: 0.2s ease-in-out;
    &:hover {
      background: $paragraph;
    }
  }
}
</style>
