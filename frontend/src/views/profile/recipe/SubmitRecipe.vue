<template>
  <div class="submit-recipe" content>
    <fh-recipe-form />
  </div>
</template>

<script lang="ts">
import FHRecipeForm from '@/components/recipe/FH-RecipeForm.vue';
import { Vue, Component } from 'vue-property-decorator';

@Component({
  components: {
    'fh-recipe-form': FHRecipeForm
  }
})
export default class SubmitRecipe extends Vue {}
</script>

<style lang="scss" scoped></style>
