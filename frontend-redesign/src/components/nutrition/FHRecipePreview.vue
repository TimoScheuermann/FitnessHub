<template>
  <FHPreview
    v-if="recipe"
    class="fh-recipe-preview"
    @click="handleClick"
    :title="recipe.title"
  >
    <template slot="media">
      <FHHeart :recipeId="recipe._id" @click="toggleLike" />
      <img :src="recipe.thumbnail" alt="" />
    </template>

    <div class="time">
      <i class="ti-clock-simple" />
      <span>{{ recipe.time }} min</span>
    </div>

    <template slot="action">
      <tc-action-item success icon="share" title="Teilen" />
      <tc-action-item
        icon="i-circle-filled"
        title="Details"
        @click="handleClick"
      />
      <tc-action-item
        v-if="$store.getters.valid && $route.name !== 'recipes'"
        icon="heart"
        title="Lieblingsrezepte"
        @click="openRecipes"
      />
      <tc-action-item
        v-if="isAuthor"
        icon="pencil"
        title="Bearbeiten"
        alarm
        @click="$oFS('update-recipe', { id: recipe._id })"
      />
    </template>
  </FHPreview>
</template>

<script lang="ts">
import { openFullscreen } from '@/utils/functions';
import { IRecipe } from '@/utils/interfaces';
import { RecipeManagement } from '@/utils/RecipeManagement';
import { UserManagement } from '@/utils/UserManagement';
import { Vue, Component, Prop } from 'vue-property-decorator';
import FHPreview from '../FHPreview.vue';
import FHHeart from './FHHeart.vue';

@Component({
  components: {
    FHHeart,
    FHPreview
  }
})
export default class FHRecipePreview extends Vue {
  @Prop() recipe!: IRecipe;

  get isAuthor(): boolean {
    if (!this.recipe) return false;
    return UserManagement.getUserID() === this.recipe.author;
  }

  public handleClick(e: Event) {
    this.$emit('click', e);
    if (this.recipe) {
      openFullscreen('recipe-details', { id: this.recipe._id });
    }
  }

  public openRecipes() {
    this.$router.push({ name: 'recipes' });
  }

  public toggleLike() {
    if (!UserManagement.getUserID()) {
      openFullscreen('login');
      return;
    } else if (this.recipe) {
      RecipeManagement.toggleLike(this.recipe);
    }
  }
}
</script>

<style lang="scss" scoped>
.fh-recipe-preview {
  .time {
    margin-left: 10px;
    opacity: 0.7;
    i {
      font-size: 12px;
    }
    span {
      font-size: 14px;
      margin-left: 5px;
    }
  }
}
</style>
