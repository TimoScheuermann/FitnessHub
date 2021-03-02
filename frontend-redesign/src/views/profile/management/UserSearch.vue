<template>
  <div class="view-user-search">
    <div content max-width>
      <FHHeader title="Nutzer finden">
        <FHFullScreenCloser @click="$cFS('profile')" />
      </FHHeader>
      <br />
      <h1 center>Nutzer finden</h1>

      <form @submit.prevent="submit">
        <tc-input
          pattern=".{2,}"
          v-model="query"
          icon="lens"
          :frosted="true"
          :dark="true"
          placeholder="Namen eingeben"
          @input="submit"
        />
      </form>

      <tl-flow v-if="results && results.length === 0" flow="column">
        <br />
        <i error huge class="ti-exclamation-triangle" />
        <p>Die Suche ergab keine Treffer</p>
      </tl-flow>
      <template v-else-if="results">
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
              name="wählen"
              @click="select(r)"
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
import { closeFullscreen } from '@/utils/functions';
import { IUserInfo } from '@/utils/interfaces';
import { Vue, Component } from 'vue-property-decorator';

@Component({
  components: {
    FHHeader,
    FHFullScreenCloser,
    FHList,
    FHListItem
  }
})
export default class UserSearch extends Vue {
  public query = '';
  public results: IUserInfo[] | null = null;

  public async submit(): Promise<void> {
    if (this.query.length > 0) {
      const { data } = await backend.post('user/search', { query: this.query });
      if (!data) this.results = [];
      else {
        this.results = data;
      }
    }
  }

  public select(user: IUserInfo): void {
    if (!user) return;
    closeFullscreen('profile', { user: encodeURI(JSON.stringify(user)) });
  }
}
</script>

<style lang="scss" scoped>
.view-user-search {
  min-height: 100vh;
  color: #fff;

  background: url('/assets/user-search-bg.webp');
  background-size: cover;
  background-position: center center;

  [content] {
    padding-bottom: 20px;
  }

  [max-width] {
    max-width: 400px;
  }

  form {
    margin: 0 auto;
    max-width: 400px;
    margin-top: 20px;
    .tc-input {
      padding: 10px 20px;
    }
  }

  .tc-button {
    border-radius: 50px;
    margin-right: -5px;
  }

  .fh-list-item {
    @include backdrop-blur($color);
    color: #fff;
  }
}
</style>
