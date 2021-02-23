<template>
  <div class="fh-heart" @click.prevent.stop="handleClick">
    <svg xmlns="http://www.w3.org/2000/svg" width="24.76" height="23.884">
      <path
        :liked="liked"
        d="M17.632 1h-.055a6.225 6.225 0 00-5.2 2.845A6.225 6.225 0 007.177 1h-.052A6.186 6.186 0 001 7.182a13.318 13.318 0 002.615 7.26 45.83 45.83 0 008.765 8.442 45.83 45.83 0 008.765-8.442 13.318 13.318 0 002.615-7.26A6.186 6.186 0 0017.632 1z"
      />
    </svg>
  </div>
</template>

<script lang="ts">
import { RecipeManagement } from '@/utils/RecipeManagement';
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class FHHeart extends Vue {
  @Prop() recipeId!: string;

  get liked(): boolean {
    if (!this.recipeId) return false;
    return RecipeManagement.hasLiked(this.recipeId);
  }

  public handleClick(e: MouseEvent) {
    this.$emit('click', e);
  }
}
</script>

<style lang="scss" scoped>
.fh-heart {
  position: relative;
  z-index: 10;
  padding: 10px;
  border-radius: 0 $border-radius 0 #{2 * $border-radius};

  @include backdrop-blur($color_dark);
  @media #{$isDark} {
    @include backdrop-blur($color);
  }
  height: fit-content;
  svg path {
    transition: all 0.2s ease-in-out;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke: $error;

    fill: rgba($error, 0);
    &[liked] {
      fill: rgba($error, 1);
    }
    stroke-width: 2;
  }
}
</style>
