<template>
  <div class="fh-exercise-list-item" @click="handleClick">
    <div class="fh-exercise-list-item--front">
      <slot name="front" />
    </div>

    <div class="fh-exercise-list-item--avatar">
      <tc-avatar size="large" border="rounded" :src="exercise.thumbnail" />
    </div>

    <fh-difficulty v-if="showDifficulty" :difficulty="exercise.difficulty" />
    <div v-else />
    <div class="fh-exercise-list-item--container">
      <div class="fh-exercise-list-item--title">
        {{ exercise.title }}
      </div>
      <div class="fh-exercise-list-item--description">
        <slot />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import {
  IExercise,
  IExerciseInfo,
  IExerciseShowcase
} from '@/utils/interfaces';
import FHDifficulty from '@/components/common/FH-Difficulty.vue';

interface FHRoute {
  name: string;
}

@Component({
  components: {
    'fh-difficulty': FHDifficulty
  }
})
export default class FHExerciseListItem extends Vue {
  @Prop() to!: FHRoute;
  @Prop() href!: string;
  @Prop() routeName!: string;
  @Prop() exercise!: IExercise | IExerciseInfo | IExerciseShowcase;
  @Prop({ default: true }) showDifficulty!: boolean;

  public handleClick(e: MouseEvent) {
    this.$emit('click', e);
    this.open();
  }

  public open(target: '_blank' | undefined = undefined) {
    if (this.href) {
      window.open(this.href, target);
    } else {
      let route: FHRoute = this.to;
      if (!route && this.routeName) {
        route = { name: this.routeName };
      }
      if (route && this.$route.name !== route.name) {
        this.$router.push(route);
      }
    }
  }
}
</script>

<style lang="scss" scoped>
$size: 60px;

.fh-exercise-list.dark .fh-exercise-list-item:hover {
  background: rgba(lighten($paragraph_dark, 20%), 0.5);
}
.fh-exercise-list-item {
  display: grid;
  grid-gap: 10px;
  grid-template-columns: auto $size auto 1fr;
  grid-template-rows: minmax($size, 100%);
  border-radius: $border-radius;
  transition: background 0.2s ease-in-out;
  cursor: pointer;

  background: $paragraph;
  @media (prefers-color-scheme: dark) {
    background: $paragraph_dark;
  }

  &:hover {
    background: rgba(darken($paragraph, 15%), 0.5);
  }
  &:not(:last-child) {
    .fh-exercise-list-item--container {
      &::after {
        position: absolute;
        content: '';
        z-index: 10;
        bottom: 0;
        right: 0;
        left: 0;
        height: 1px;
        background: currentColor;
        opacity: 0.2;
      }
    }
  }

  .fh-exercise-list-item--avatar {
    display: grid;
    place-content: center;
    .tc-avatar {
      height: #{$size / 1.3};
      width: #{$size / 1.3};
    }
  }
  .fh-exercise-list-item--container {
    position: relative;
    display: grid;
    grid-template-columns: minmax(0px, 1fr) auto;
    .fh-exercise-list-item--title,
    .fh-exercise-list-item--description {
      display: grid;
      place-content: center left;
    }
    .fh-exercise-list-item--title {
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .fh-exercise-list-item--description {
      padding: 0 5px;
    }
  }
}
</style>
