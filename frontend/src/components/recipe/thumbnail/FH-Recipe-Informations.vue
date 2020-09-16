<template>
  <div class="fh-recipe-thumbnail" v-if="recipe">
    <div class="time">
      <i class="ti-clock-simple" />
      <span>{{ recipe.time }} min</span>
    </div>
    <div class="title">{{ recipe.title }}</div>
  </div>
</template>

<script lang="ts">
import { IRecipe } from '@/utils/interfaces';
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class FHRecipeInformations extends Vue {
  @Prop() recipe!: IRecipe;
}
</script>

<style lang="scss" scoped>
.fh-recipe-thumbnail {
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
</style>
