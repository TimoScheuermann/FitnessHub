<template>
  <div class="view-recipe-category" content>
    <tl-flow v-if="!recipes" flow="column">
      <tc-spinner
        variant="dots-spin"
        size="30"
        :dark="$store.getters.darkmode"
      />
      <p>Rezepte werden geladen...</p>
    </tl-flow>
    <tl-flow v-else-if="recipes.length === 0" flow="column">
      <i huge error class="ti-exclamation-triangle" />
      <p>Es wurde keine Rezept gefunden</p>
    </tl-flow>

    <div v-else max-width>
      <FHHeading
        subtitle="Ergebnisse für"
        :title="this.$route.params.category"
      />
      <br />
      <masonry :cols="{ default: 3, 750: 2, 500: 1 }" gutter="20px">
        <FHRecipePreview
          v-scroll-reveal
          v-for="r in recipes"
          :key="r._id"
          :recipe="r"
        />
      </masonry>
    </div>
  </div>
</template>

<script lang="ts">
import FHHeading from '@/components/FHHeading.vue';
import FHRecipePreview from '@/components/nutrition/FHRecipePreview.vue';
import backend from '@/utils/backend';
import { IRecipe } from '@/utils/interfaces';
import { Vue, Component } from 'vue-property-decorator';

@Component({
  components: {
    FHRecipePreview,
    FHHeading
  }
})
export default class RecipeCategory extends Vue {
  public recipes: IRecipe[] | null = null;

  mounted() {
    backend
      .get('recipe/category/' + this.$route.params.category)
      .then(res => {
        this.recipes = res.data;
      })
      .catch(() => {
        this.$router.push({ name: 'nutrition' });
      });
  }
}
</script>
<style lang="scss" scoped>
.view-recipe-category {
  .fh-recipe-preview {
    margin-bottom: 20px;
  }
}
</style>
