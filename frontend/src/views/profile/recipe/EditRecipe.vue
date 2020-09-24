<template>
  <div class="edit-recipe" content>
    <fh-recipe-form mode="edit" :recipeInput="recipe" />
  </div>
</template>

<script lang="ts">
import FHRecipeForm from '@/components/recipe/FH-RecipeForm.vue';
import { IRecipe } from '@/utils/interfaces';
import { Vue, Component } from 'vue-property-decorator';

@Component({
  components: {
    'fh-recipe-form': FHRecipeForm
  }
})
export default class EditRecipe extends Vue {
  get recipe(): IRecipe {
    return (this.$store.getters.recipes as IRecipe[]).filter(
      x => x._id === this.$route.params.id
    )[0];
  }
}
</script>
