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
          pattern=".{2,}"
          v-model="query"
          icon="lens"
          :frosted="true"
          :dark="true"
          placeholder="Suchbegriff eingeben"
        />
      </form>

      <FHAppear>
        <div v-if="categories">
          <h3 center>oder Kategorie wählen</h3>
          <FHVarList>
            <FHVarListItem
              v-for="c in categories"
              :key="c._id"
              :title="c.title"
              :to="{ name: 'recipe-category', params: { category: c.title } }"
            />
          </FHVarList>
        </div>
      </FHAppear>
    </div>
  </div>
</template>

<script lang="ts">
import FHAppear from '@/components/FHAppear.vue';
import FHFullScreenCloser from '@/components/FHFullScreenCloser.vue';
import FHHeader from '@/components/FHHeader.vue';
import FHVarList from '@/components/variable-list/FHVarList.vue';
import FHVarListItem from '@/components/variable-list/FHVarListItem.vue';
import { IVariable } from '@/utils/interfaces';
import { VariableManagement } from '@/utils/VariableManagement';
import { Vue, Component } from 'vue-property-decorator';

@Component({
  components: {
    FHFullScreenCloser,
    FHHeader,
    FHVarList,
    FHVarListItem,
    FHAppear
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

  get categories(): IVariable[] | null {
    return VariableManagement.getCategories();
  }
}
</script>

<style lang="scss" scoped>
.view-SearchRecipe {
  min-height: 100vh;
  color: #fff;

  background: linear-gradient(rgba($color, 0.6), rgba($success, 0.08)),
    url('/assets/recipe-search-bg.webp');
  background-size: cover;
  background-position: center center;

  [content] {
    padding-bottom: 20px;
  }

  form {
    margin: 0 auto;
    max-width: 400px;
    margin-top: 20px;
    .tc-input {
      padding: 10px 20px;
    }
  }

  .fh-var-list {
    margin: 0 auto;
    margin-top: 40px;
    max-width: 400px;

    .fh-var-list-item {
      @include backdrop-blur(lighten($color, 10%));
      color: #fff;
      border: 1px solid hsla(0, 0%, 100%, 0.1);
      padding: 7.5px 15px;
      margin: 0 5px 10px;

      &:hover,
      &:active {
        border-color: hsla(0, 0%, 100%, 0.4);
      }
    }
  }
}
</style>
