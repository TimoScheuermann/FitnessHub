<template>
  <div class="view-recipes" content>
    <div max-width>
      <tl-flow horizontal="space-between">
        <h3>Meine Rezepte</h3>
        <tc-link routeName="submit-recipe" tfcolor="success">
          Rezept erstellen
        </tc-link>
      </tl-flow>

      <FHAppear>
        <p v-if="!submitted || (submitted.length === 0 && query.length === 0)">
          Du hast noch kein eigenes Rezept veröffentlicht
        </p>

        <div v-else>
          <FHSearchBar v-model="query" />
          <tl-grid arrangement="auto-fill" minWidth="200">
            <FHRecipePreview v-for="s in submitted" :key="s._id" :recipe="s" />
          </tl-grid>
        </div>
      </FHAppear>

      <FHAppear>
        <div v-if="liked">
          <br />
          <h3>Lieblingsrezepte</h3>
          <p v-if="liked.length === 0">
            Du hast noch kein Rezept zu deinem Favoriten hinzugefügt
          </p>
          <FHCarousel v-else>
            <FHRecipePreview v-for="l in liked" :key="l._id" :recipe="l" />
          </FHCarousel>
        </div>
      </FHAppear>
    </div>
  </div>
</template>

<script lang="ts">
import { IRecipe } from '@/utils/interfaces';
import { Vue, Component } from 'vue-property-decorator';
import { RecipeManagement } from '@/utils/RecipeManagement';
import FHAppear from '@/components/FHAppear.vue';
import FHCarousel from '@/components/FHCarousel.vue';
import FHRecipePreview from '@/components/nutrition/FHRecipePreview.vue';
import FHSearchBar from '@/components/FHSearchBar.vue';

@Component({
  components: {
    FHAppear,
    FHCarousel,
    FHRecipePreview,
    FHSearchBar
  }
})
export default class Recipes extends Vue {
  public query = '';
  get liked(): IRecipe[] | null {
    return RecipeManagement.getLikedRecipes();
  }

  get submitted(): IRecipe[] | null {
    const submitted: IRecipe[] | null = RecipeManagement.getCreated();
    if (!submitted) return null;
    else if (this.query.length > 2) {
      return submitted.filter(x =>
        JSON.stringify(x)
          .toLowerCase()
          .includes(this.query.toLowerCase())
      );
    } else {
      return submitted;
    }
  }
}
</script>

<style lang="scss" scoped>
.view-recipes {
  padding-top: 0;

  .fh-search-bar {
    margin-top: -10px;
    margin-bottom: 10px;
  }
}
</style>
