<template>
  <div class="recipes" content>
    <tl-flow horizontal="space-between">
      <h1>Meine Rezepte</h1>
      <tc-link tfcolor="success" routeName="submitRecipe">neu</tc-link>
    </tl-flow>

    <fh-carousel v-if="recipes.length > 0">
      <fh-recipe v-for="r in recipes" :key="r._id" :recipe="r" />
    </fh-carousel>
    <p v-else>
      Du hast noch kein eigenes Rezept veröffentlicht
    </p>

    <h3>Lieblingsrezepte</h3>
    <fh-carousel v-if="favedRecipes.length > 0">
      <fh-recipe v-for="r in favedRecipes" :key="r._id" :recipe="r" />
    </fh-carousel>
    <p v-else>
      Du hast noch kein Rezept zu deinem Favoriten hinzugefügt
    </p>
  </div>
</template>

<script lang="ts">
import FHRecipe from '@/components/recipe/FH-Recipe.vue';
import { IRecipe } from '@/utils/interfaces';
import { Vue, Component } from 'vue-property-decorator';

@Component({
  components: {
    'fh-recipe': FHRecipe
  }
})
export default class Recipes extends Vue {
  get recipes(): IRecipe[] {
    return this.$store.getters.recipes;
  }
  get favedRecipes(): IRecipe[] {
    return this.$store.getters.favedRecipes;
  }
}
</script>

<style lang="scss" scoped></style>
