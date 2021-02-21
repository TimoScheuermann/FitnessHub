<template>
  <div class="view-Nutrition" content>
    <div max-width>
      <tl-grid minWidth="150" gap="10">
        <FHButton icon="lens" title="Rezept" routeName="search-exercise" />
        <FHButton icon="lightbulb" title="Tipps" routeName="nutrition-tipps" />
      </tl-grid>

      <br />
      <FHHeading subtitle="rezept" title="Kategorien" />
      <FHCarousel> </FHCarousel>

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
    </div>
  </div>
</template>

<script lang="ts">
import FHAppear from '@/components/FHAppear.vue';
import FHButton from '@/components/FHButton.vue';
import FHCarousel from '@/components/FHCarousel.vue';
import FHHeading from '@/components/FHHeading.vue';
import FHRecipePreview from '@/components/nutrition/FHRecipePreview.vue';
import { IRecipe } from '@/utils/interfaces';
import { Vue, Component } from 'vue-property-decorator';

@Component({
  components: {
    FHButton,
    FHHeading,
    FHCarousel,
    FHRecipePreview,
    FHAppear
  }
})
export default class Nutrition extends Vue {
  get latestRecipes(): IRecipe[] | null {
    return this.$store.getters.latestRecipes;
  }
  get belovedRecipes(): IRecipe[] | null {
    return this.$store.getters.belovedRecipes;
  }
}
</script>

<style lang="scss" scoped></style>
