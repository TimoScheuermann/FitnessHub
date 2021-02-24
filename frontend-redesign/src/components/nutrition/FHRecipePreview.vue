<template>
  <div
    class="fh-recipe-preview"
    cursor
    v-if="recipe"
    @click="handleClick"
    :style="`--thumbnail: url('${recipe.thumbnail}'`"
  >
    <div class="media">
      <FHHeart :recipeId="recipe._id" @click="toggleLike" />
    </div>
    <div class="title">{{ recipe.title }}</div>
    <tl-flow horizontal="space-between">
      <div class="time">
        <i class="ti-clock-simple" />
        <span>{{ recipe.time }} min</span>
      </div>
      <tc-action :dark="$store.getters.darkmode">
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
      </tc-action>
    </tl-flow>
  </div>
</template>

<script lang="ts">
import { openFullscreen } from '@/utils/functions';
import { IRecipe } from '@/utils/interfaces';
import { RecipeManagement } from '@/utils/RecipeManagement';
import { UserManagement } from '@/utils/UserManagement';
import { Vue, Component, Prop } from 'vue-property-decorator';
import FHHeart from './FHHeart.vue';

@Component({
  components: { FHHeart }
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
  border-radius: $border-radius;
  width: 280px;
  height: fit-content;

  background: $paragraph;
  @media #{$isDark} {
    background: $color;
  }
  box-shadow: $shadow-light;

  .media {
    height: 210px;
    background-position: center;
    background-size: cover;

    background-image: linear-gradient(
        to bottom,
        transparent calc(100% - 30px),
        $paragraph
      ),
      var(--thumbnail);
    @media #{$isDark} {
      background-image: linear-gradient(
          to bottom,
          transparent calc(100% - 30px),
          $color
        ),
        var(--thumbnail);
    }

    display: flex;
    justify-content: flex-end;
    border-radius: $border-radius $border-radius 0 0;
  }

  .title {
    margin: -12.5px 20px 0px;
    overflow-wrap: break-word;
    font-weight: bold;
    font-size: 1.4em;
  }
  .tl-flow {
    padding: 10px;
  }
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
