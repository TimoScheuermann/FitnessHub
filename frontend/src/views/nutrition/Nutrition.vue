<template>
  <div class="nutrition" content>
    <tl-grid buttons minWidth="50">
      <fh-button icon="lens" title="Rezept" />
      <fh-button routeName="nutrition-wiki" icon="lightbulb" title="Tipps" />
    </tl-grid>
    <template v-if="$store.getters.valid">
      <br />
      <fh-health-water :onlyToday="true" />
    </template>

    <h2>Kategorien</h2>

    <fh-carousel>
      <fh-preview
        v-for="c in categories"
        :key="c.title"
        :to="{
          name: 'nutrition-category',
          params: { category: c.title }
        }"
        :title="c.title"
        :thumbnail="c.thumbnail"
      />
    </fh-carousel>

    <template v-if="belovedRecipes && belovedRecipes.length > 0">
      <h2>Beliebte Rezepte</h2>
      <fh-carousel>
        <fh-recipe v-for="r in belovedRecipes" :key="r._id" :recipe="r" />
      </fh-carousel>
    </template>

    <template v-if="latestRecipes && latestRecipes.length > 0">
      <h2>Neuesten Rezepte</h2>
      <fh-carousel>
        <fh-recipe v-for="r in latestRecipes" :key="r._id" :recipe="r" />
      </fh-carousel>
    </template>

    <h2>Ernährungspläne</h2>
    <p>soon</p>
  </div>
</template>

<script lang="ts">
import FHHealthWater from '@/components/health/FH-Health-Water.vue';
import axios from '@/utils/axios';
import { IRecipe, IVariable } from '@/utils/interfaces';
import { Vue, Component } from 'vue-property-decorator';
import FHRecipe from '@/components/recipe/FH-Recipe.vue';
import { getCategories } from '@/utils/functions';
import FHPreview from '@/components/common/FH-Preview.vue';
import FHButton from '@/components/shared/FH-Button.vue';

@Component({
  components: {
    'fh-health-water': FHHealthWater,
    'fh-recipe': FHRecipe,
    'fh-preview': FHPreview,
    'fh-button': FHButton
  }
})
export default class Nutrition extends Vue {
  private categories: IVariable[] = getCategories();
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
.tl-grid[buttons] {
  margin-top: 20px;
  .fh-button {
    background: $paragraph;
    box-shadow: $shadow-light;
    @media (prefers-color-scheme: dark) {
      background: $paragraph_dark;
    }
  }
}

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
