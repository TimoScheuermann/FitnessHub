<template>
  <tc-magic-card
    v-if="recipe"
    :dark="$store.getters.darkmode"
    :src="recipe.thumbnail"
    class="fh-recipe"
  >
    <div class="card-thumbnail" slot="thumbnail">
      <div class="time">
        <i class="ti-clock-simple" />
        <span>{{ recipe.time }} min</span>
      </div>
      <div class="title">{{ recipe.title }}</div>
    </div>
    <div class="fav-button" slot="thumbnail" v-if="$store.getters.valid">
      <tc-button
        :disabled="$store.getters.loading"
        @click.stop="like"
        icon="heart"
        :variant="hasLiked ? 'filled' : 'opaque'"
        tfbackground="error"
        :name="hasLiked ? 'gefällt dir' : undefined"
      />
    </div>

    <div class="card-content">
      <fh-pd-recipe :recipe="recipe" />
    </div>
  </tc-magic-card>
</template>

<script lang="ts">
import axios from '@/utils/axios';
import { hasLikedRecipe } from '@/utils/functions';
import { IRecipe } from '@/utils/interfaces';
import { Vue, Component, Prop } from 'vue-property-decorator';
import FHPropertyDetailsRecipe from '../propertyDetails/FH-PD-Recipe.vue';

@Component({
  components: {
    'fh-pd-recipe': FHPropertyDetailsRecipe
  }
})
export default class FHRecipe extends Vue {
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

  public showRecipesOf(category: string) {
    this.$router.push({
      name: 'nutrition-category',
      params: { category: category }
    });
  }
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
  .card-thumbnail {
    position: absolute;
    top: 0px;
    left: 0px;
    padding: 20px;
    color: #fff;
    .time {
      i {
        position: static;
        cursor: default;
        font-size: inherit;
        opacity: inherit;
      }
      span {
        margin-left: 5px;
      }
    }
    .title {
      font-size: 1.3em;
      font-weight: 500;
      margin-top: 5px;
    }
  }
  .fav-button {
    position: absolute;
    bottom: 17px;
    right: 17px;
  }

  .card-content {
    padding: 0 5vw;
  }
}
</style>
