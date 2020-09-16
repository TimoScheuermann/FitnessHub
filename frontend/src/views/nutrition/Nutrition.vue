<template>
  <div class="nutrition" content>
    <template v-if="$store.getters.valid">
      <h1>Trinkometer</h1>
      <fh-health-water :onlyToday="true" />
    </template>

    <h1>Kategorien</h1>
    <fh-carousel>
      <router-link
        v-for="c in Object.keys(categories)"
        :key="c"
        :to="{ name: 'nutrition-category', params: { category: c } }"
        tag="div"
        @click.capture.stop=""
      >
        <tc-magic-card :src="categories[c]" :dark="true">
          <div class="card-thumbnail" slot="thumbnail">
            <div class="title">{{ c }}</div>
          </div>
        </tc-magic-card>
      </router-link>
    </fh-carousel>

    <template v-if="belovedRecipes && belovedRecipes.length > 0">
      <h1>Beliebte Rezepte</h1>
      <fh-carousel>
        <fh-recipe v-for="r in belovedRecipes" :key="r._id" :recipe="r" />
      </fh-carousel>
    </template>

    <template v-if="latestRecipes && latestRecipes.length > 0">
      <h1>Neuesten Rezepte</h1>
      <fh-carousel>
        <fh-recipe v-for="r in latestRecipes" :key="r._id" :recipe="r" />
      </fh-carousel>
    </template>

    <h1>Ernährungspläne</h1>
    <p>soon</p>
  </div>
</template>

<script lang="ts">
import FHHealthWater from '@/components/health/FH-Health-Water.vue';
import axios from '@/utils/axios';
import { IRecipe } from '@/utils/interfaces';
import { Vue, Component } from 'vue-property-decorator';
import { recipeCategories } from '@/utils/recipeCategories';
import FHRecipe from '@/components/recipe/FH-Recipe.vue';

@Component({
  components: {
    'fh-health-water': FHHealthWater,
    'fh-recipe': FHRecipe
  }
})
export default class Nutrition extends Vue {
  private categories = recipeCategories;
  public latestRecipes: IRecipe[] | null =
    this.$store.state.latestRecipes || null;
  public belovedRecipes: IRecipe[] | null =
    this.$store.state.belovedRecipes || null;

  async mounted() {
    if (!this.latestRecipes) {
      this.latestRecipes = (await axios.get('recipe/latest')).data;
      this.$store.state.latestRecipes = this.latestRecipes;
      this.$forceUpdate();
    }
    if (!this.belovedRecipes) {
      this.belovedRecipes = (await axios.get('recipe/beloved')).data;
      this.$store.state.belovedRecipes = this.belovedRecipes;
      this.$forceUpdate();
    }
  }
}
</script>

<style lang="scss" scoped>
.tc-hero img {
  filter: brightness(80%);
}
.tc-magic-card /deep/ .tc-magic-card--thumbnail img {
  filter: brightness(70%);
}
.card-thumbnail {
  position: absolute;
  top: 0;
  left: 0;
  padding: 20px;
  position: flex;
  flex-direction: column;

  .title {
    margin: 5px 0;
    font-weight: 500;
    font-size: 1.3em;
  }
}
</style>
