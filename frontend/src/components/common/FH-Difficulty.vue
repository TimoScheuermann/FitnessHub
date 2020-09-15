<template>
  <tl-flow class="fh-difficulty" :diff="totals + (half ? 1 : 0)">
    <div class="fh-difficulty--icon" v-for="(x, i) in Array(totals)" :key="i">
      <i :class="'ti-' + icon" />
    </div>
    <div v-if="half" class="fh-difficulty--icon" half>
      <i :class="'ti-' + icon" />
    </div>
  </tl-flow>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class FHDifficulty extends Vue {
  @Prop() difficulty!: number;
  @Prop({ default: 'circle' }) icon!: string;

  get totals(): number {
    return Math.floor(this.difficulty);
  }

  get half(): boolean {
    return Math.round(this.difficulty % 1) > 0;
  }
}
</script>

<style lang="scss" scoped>
.fh-difficulty {
  width: fit-content;
  .fh-difficulty--icon {
    margin: 0 2.5px;
    display: grid;
    place-content: center;
    &[half] {
      i {
        font-size: 8px;
      }
    }
  }
  $colors: (
    '1': $success,
    '2': $alarm,
    '3': $error
  );
  @each $index, $color in $colors {
    &[diff='#{$index}'] .fh-difficulty--icon i {
      color: $color;
    }
  }
}
</style>
