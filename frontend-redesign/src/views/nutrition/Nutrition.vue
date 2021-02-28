<template>
  <div class="view-nutrition" content>
    <div max-width>
      <tl-grid minWidth="150" gap="10">
        <FHButton icon="lens" title="Rezept" routeName="search-recipe" />
        <FHButton icon="lightbulb" title="Tipps" routeName="nutrition-tipps" />
      </tl-grid>

      <FHGraphWater :onlyToday="true" />

      <br />

      <FHAppear>
        <div v-if="categories && categories.length > 0">
          <FHHeading subtitle="rezept" title="Kategorien" />
          <FHCarousel>
            <FHCategoryPreview
              v-for="c in categories"
              :key="c._id"
              :category="c"
            />
          </FHCarousel>
        </div>
      </FHAppear>

      <FHAppear>
        <div v-if="belovedRecipes && belovedRecipes.length > 0">
          <FHHeading title="Rezepte" subtitle="Beliebte" />
          <FHCarousel>
            <FHRecipePreview
              v-for="r in belovedRecipes"
              :key="r._id"
              :recipe="r"
            />
          </FHCarousel>
        </div>
      </FHAppear>

      <FHAppear>
        <div v-if="latestRecipes && latestRecipes.length > 0">
          <FHHeading title="Rezepte" subtitle="Neueste" />
          <FHCarousel>
            <FHRecipePreview
              v-for="r in latestRecipes"
              :key="r._id"
              :recipe="r"
            />
          </FHCarousel>
        </div>
      </FHAppear>

      <FHHeading subtitle="ausgewogene" title="Ernährungspläne" />
      <p>Bald verfügbar!</p>
    </div>
  </div>
</template>

<script lang="ts">
import FHAppear from '@/components/FHAppear.vue';
import FHButton from '@/components/FHButton.vue';
import FHCarousel from '@/components/FHCarousel.vue';
import FHHeading from '@/components/FHHeading.vue';
import FHGraphWater from '@/components/graphs/FHGraphWater.vue';
import FHCategoryPreview from '@/components/nutrition/FHCategoryPreview.vue';
import FHRecipePreview from '@/components/nutrition/FHRecipePreview.vue';
import { IRecipe, IVariable } from '@/utils/interfaces';
import { Vue, Component } from 'vue-property-decorator';

@Component({
  components: {
    FHButton,
    FHHeading,
    FHCarousel,
    FHRecipePreview,
    FHAppear,
    FHCategoryPreview,
    FHGraphWater
  }
})
export default class Nutrition extends Vue {
  get latestRecipes(): IRecipe[] | null {
    return this.$store.getters.latestRecipes;
  }
  get belovedRecipes(): IRecipe[] | null {
    return this.$store.getters.belovedRecipes;
  }
  get categories(): IVariable[] | null {
    const vars: IVariable[] | null = this.$store.getters.variables;
    if (!vars) return null;
    return vars
      .filter(x => x.type === 'category')
      .sort((a, b) => a.title.localeCompare(b.title));
  }
}
</script>

<style lang="scss" scoped>
.view-nutrition {
  .fh-graph-water {
    margin-top: 20px;
  }
}
</style>
