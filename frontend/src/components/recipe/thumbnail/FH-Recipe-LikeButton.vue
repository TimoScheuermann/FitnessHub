<template>
  <div class="fh-recipe-like-button" v-if="recipe && $store.getters.valid">
    <tc-button
      @click.stop="like"
      icon="heart"
      tfbackground="error"
      :variant="hasLiked ? 'filled' : 'opaque'"
      :name="hasLiked ? 'gefällt dir' : undefined"
      :disabled="$store.getters.loading"
    />
  </div>
</template>

<script lang="ts">
import axios from '@/utils/axios';
import { hasLikedRecipe } from '@/utils/functions';
import { IRecipe } from '@/utils/interfaces';
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class FHRecipeLikeButton extends Vue {
  @Prop() recipe!: IRecipe;

  get hasLiked(): boolean {
    if (!this.recipe) return false;
    return hasLikedRecipe(this.recipe._id);
  }

  public async like(): Promise<void> {
    if (this.recipe) {
      if (this.hasLiked) {
        this.$store.commit('removeFavedRecipe', this.recipe._id);
        await axios.delete('recipe/like/' + this.recipe._id);
      } else {
        this.$store.commit('addFavedRecipe', this.recipe);
        await axios.put('recipe/like/' + this.recipe._id);
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.fh-recipe-like-button {
  position: absolute;
  bottom: 17px;
  right: 17px;
}
</style>
