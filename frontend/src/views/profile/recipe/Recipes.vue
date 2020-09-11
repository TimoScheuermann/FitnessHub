<template>
  <div class="recipes" content>
    <h1>Meine Rezepte</h1>
    <fh-carousel>
      <fh-recipe />
      <fh-recipe />
      <fh-recipe />
    </fh-carousel>
    <h1>Lieblingsrezepte</h1>
  </div>
</template>

<script lang="ts">
import FHRecipe from '@/components/recipe/FH-Recipe.vue';
import { Vue, Component } from 'vue-property-decorator';

@Component({
  components: {
    'fh-recipe': FHRecipe
  }
})
export default class Recipes extends Vue {}
</script>

<style lang="scss" scoped></style>
