<template>
  <div class="view-Recipe">
    <FHFullScreenCloser @click="$cFS('nutrition')" />
    <FHSwipeable @swipeDown="$cFS('nutrition')">
      <tc-hero :dark="$store.getters.darkmode">
        <img v-if="recipe" :src="recipe.thumbnail" slot="background" />
        <tl-flow v-else-if="!error" flow="column">
          <tc-spinner
            variant="dots-spin"
            size="30"
            :dark="$store.getters.darkmode"
          />
          <p>Rezept wird geladen...</p>
        </tl-flow>
        <tl-flow v-else flow="column">
          <i huge error class="ti-exclamation-triangle" />
          <p>Rezept konnte nicht geladen werden</p>
        </tl-flow>
      </tc-hero>
    </FHSwipeable>
    <div content v-if="recipe">
      <h1 center>{{ recipe.title }}</h1>
      <div max-width></div>
    </div>
  </div>
</template>

<script lang="ts">
import FHButton from '@/components/FHButton.vue';
import FHFullScreenCloser from '@/components/FHFullScreenCloser.vue';
import FHSwipeable from '@/components/FHSwipeable.vue';
import backend from '@/utils/backend';
import { closeFullscreen } from '@/utils/functions';
import { IRecipe } from '@/utils/interfaces';
import { Vue, Component } from 'vue-property-decorator';

@Component({
  components: {
    FHFullScreenCloser,
    FHSwipeable,
    FHButton
  }
})
export default class Recipe extends Vue {
  public recipe: IRecipe | null = null;
  public error = false;

  mounted() {
    backend
      .get('recipe/' + this.$route.params.id)
      .then(res => {
        this.recipe = res.data;
      })
      .catch(() => {
        this.error = true;
        closeFullscreen('nutrition');
      });
  }
}
</script>

<style lang="scss" scoped>
.view-Recipe {
  min-height: 100vh;

  [content] {
    padding-top: 0;
  }
}
</style>
