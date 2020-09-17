<template>
  <tc-magic-card
    v-if="recipe"
    :dark="$store.getters.darkmode"
    :src="recipe.thumbnail"
    class="fh-recipe"
  >
    <template slot="thumbnail">
      <fh-recipe-informations :recipe="recipe" />
      <fh-recipe-like-button :recipe="recipe" />
    </template>

    <div class="card-content">
      <!-- <tc-headline :title="recipe.title">
        <tc-button
          name="Link kopieren"
          icon="share"
          background="#fff"
          color="#000"
          variant="opaque"
        />
      </tc-headline> -->
      <fh-pd-recipe :recipe="recipe" />
    </div>
  </tc-magic-card>
</template>

<script lang="ts">
import { IRecipe } from '@/utils/interfaces';
import { Vue, Component, Prop } from 'vue-property-decorator';
import FHPropertyDetailsRecipe from '../propertyDetails/FH-PD-Recipe.vue';
import FHRecipeInformations from './thumbnail/FH-Recipe-Informations.vue';
import FHRecipeLikeButton from './thumbnail/FH-Recipe-LikeButton.vue';

@Component({
  components: {
    'fh-pd-recipe': FHPropertyDetailsRecipe,
    'fh-recipe-informations': FHRecipeInformations,
    'fh-recipe-like-button': FHRecipeLikeButton
  }
})
export default class FHRecipe extends Vue {
  @Prop() recipe!: IRecipe;
}
</script>

<style lang="scss" scoped>
.fh-recipe {
  /deep/ img {
    filter: brightness(60%);
  }
  /deep/ .tc-magic-card--thumbnail {
    color: #fff;
  }
  .card-content {
    padding: 0 5vw;
  }
}
</style>
