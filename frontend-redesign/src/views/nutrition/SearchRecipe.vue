<template>
  <div class="view-SearchRecipe">
    <div content max-width>
      <FHHeader title="Rezept suchen">
        <FHFullScreenCloser @click="$cFS('nutrition')" />
      </FHHeader>
      <br />
      <h1 center>Rezept suchen</h1>
      <form @submit.prevent="submit">
        <tc-input
          pattern=".{3,}"
          v-model="query"
          icon="lens"
          :frosted="true"
          :dark="true"
          placeholder="Suchbegriff eingeben"
        />
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import FHFullScreenCloser from '@/components/FHFullScreenCloser.vue';
import FHHeader from '@/components/FHHeader.vue';
import { Vue, Component } from 'vue-property-decorator';

@Component({
  components: {
    FHFullScreenCloser,
    FHHeader
  }
})
export default class SearchRecipe extends Vue {
  public query = '';

  public submit(): void {
    if (this.query.length < 2) return;

    this.$router.push({
      name: 'recipe-search-results',
      query: { q: this.query }
    });
  }
}
</script>

<style lang="scss" scoped>
.view-SearchRecipe {
  min-height: 100vh;
  background: url('/assets/recipe-search-bg.webp');
  background-size: cover;
  background-position: center center;

  form {
    margin-top: 100px;
    .tc-input {
      padding: 10px 20px;
    }
  }
}
</style>
