<template>
  <div class="nutrition" content>
    <h1>Trinkometer</h1>
    <fh-health-water :onlyToday="true" />
    <h1>Rezepte</h1>
    <fh-carousel>
      <router-link
        v-for="c in Object.keys(categories)"
        :key="c"
        :to="{ name: 'nutrition-category', params: { category: c } }"
        tag="div"
        @click.capture="() => {}"
      >
        <tc-magic-card :src="categories[c]" :dark="true">
          <div class="card-thumbnail" slot="thumbnail">
            <div class="title">{{ c }}</div>
          </div>
        </tc-magic-card>
      </router-link>
    </fh-carousel>
    <h1>Lieblingsrezepte</h1>
    <h1>Ernährungspläne</h1>
  </div>
</template>

<script lang="ts">
import FHHealthWater from '@/components/health/FH-Health-Water.vue';
import axios from '@/utils/axios';
import { IRecipe } from '@/utils/interfaces';
import { Vue, Component } from 'vue-property-decorator';
import { recipeCategories } from '@/utils/recipeCategories';

@Component({
  components: {
    'fh-health-water': FHHealthWater
  }
})
export default class Nutrition extends Vue {
  private recipes: IRecipe[] = [];
  private categories = recipeCategories;

  async mounted() {
    this.recipes = (await axios.get('recipe')).data;
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
