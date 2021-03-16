<template>
  <div class="view-nutrition" content>
    <div max-width>
      <tl-grid minWidth="150" gap="10">
        <FHButton icon="lens" title="Rezept" routeName="search-recipe" />
        <FHButton icon="book-filled" title="Wiki" routeName="nutrition-wiki" />
      </tl-grid>

      <FHGraphWater :onlyToday="true" />

      <br />

      <router-link
        :to="{ name: 'food-scanner' }"
        class="fh-graph-card food-scanner"
      >
        <tl-flow>
          <img src="assets/food-scanner-logo.svg" alt="" />
          <FHHeading subtitle="Obst / Gemüse" title="Scanner" />
        </tl-flow>
      </router-link>

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

      <FHAppear>
        <div v-if="nutritionplans && nutritionplans.length > 0">
          <FHHeading subtitle="ausgewogene" title="Ernährungspläne" />
          <FHCarousel>
            <FHNutritionplanPreview
              v-for="p in nutritionplans"
              :key="p._id"
              :plan="p"
            />
          </FHCarousel>
        </div>
      </FHAppear>
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
import FHNutritionplanPreview from '@/components/nutrition/FHNutritionplanPreview.vue';
import FHRecipePreview from '@/components/nutrition/FHRecipePreview.vue';
import { INutritionplan, IRecipe, IVariable } from '@/utils/interfaces';
import { VariableManagement } from '@/utils/VariableManagement';
import { Vue, Component } from 'vue-property-decorator';

@Component({
  components: {
    FHAppear,
    FHButton,
    FHGraphWater,
    FHHeading,
    FHCarousel,
    FHCategoryPreview,
    FHRecipePreview,
    FHNutritionplanPreview
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
    return VariableManagement.getCategories();
  }
  get nutritionplans(): INutritionplan[] | null {
    return this.$store.getters.nutritionplans;
  }
}
</script>

<style lang="scss" scoped>
.view-nutrition {
  .fh-graph-water {
    margin-top: 20px;
  }

  .food-scanner {
    width: fit-content;
    display: block;
    color: inherit;
    text-decoration: none;
    // margin: 0 auto;
    padding-right: 20px;
    img {
      height: 40px;
      width: 40px;
      margin-right: 20px;
    }
    .fh-heading {
      margin-bottom: 0;
    }
  }
}
</style>
