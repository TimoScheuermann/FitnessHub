<template>
  <div class="nutrition-category" content>
    <div v-if="!recipes">
      <tl-flow>
        <tc-spinner :dark="$store.getters.darkmode" />
      </tl-flow>
    </div>
    <div v-else>
      <p v-if="filteredRecipes.length == 0">Keine Suchergebnisse</p>
      <transition-group name="recipe" class="recipes" tag="div">
        <fh-recipe v-for="r in filteredRecipes" :key="r._id" :recipe="r" />
      </transition-group>
    </div>
  </div>
</template>

<script lang="ts">
import FHRecipe from '@/components/recipe/FH-Recipe.vue';
import axios from '@/utils/axios';
import { getCategory } from '@/utils/functions';
import { IRecipe } from '@/utils/interfaces';
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component({
  components: {
    'fh-recipe': FHRecipe
  }
})
export default class NutritionCategory extends Vue {
  @Prop() query!: string;

  public recipes: IRecipe[] | null = null;

  mounted() {
    if (!this.recipes) {
      axios.get('recipe/category/' + this.category).then(res => {
        this.recipes = res.data;
      });
    }
  }

  get category(): string {
    const cat = getCategory(this.$route.params.category);
    if (cat) return cat.title;
    return '';
  }

  get filteredRecipes(): IRecipe[] {
    if (!this.recipes || !this.query || this.query.length == 0) {
      return this.recipes || [];
    }
    return this.recipes.filter(x =>
      JSON.stringify(x)
        .toLowerCase()
        .includes(this.query.toLowerCase())
    );
  }
}
</script>

<style lang="scss" scoped>
[content] {
  padding-top: 20px;
}
.recipes {
  display: grid;
  grid-gap: 30px;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
}
.recipe-move {
  transition: transform 1s;
}
.recipe-item {
  margin-right: 10px;
}
.recipe-enter-active,
.recipe-leave-active {
  transition: all 0.5s;
}
.recipe-enter, .recipe-leave-to /* .list-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(30px);
}
</style>
