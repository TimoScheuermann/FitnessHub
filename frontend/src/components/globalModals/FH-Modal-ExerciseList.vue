<template>
  <transition name="appaer">
    <div class="fh-modal-exercise-list" v-if="exercises.length > 0">
      <div class="exercise-list" :class="{ expanded: expanded }">
        <div class="exercise" v-for="(e, i) in exercises" :key="e._id + i">
          <div class="position">{{ i + 1 }}.</div>
          <fh-showcase :src="e.thumbnail" :title="e.title" />
          <tl-flow>
            <tc-button
              @click="remove(i)"
              icon="minus"
              variant="filled"
              tfbackground="error"
            />
          </tl-flow>
        </div>
      </div>

      <tl-flow horizontal="space-between" class="footer">
        <div class="title" @click="toggleExpand">
          {{ exercises.length }} Übungen ausgewählt
        </div>
        <div
          class="expand"
          :class="{ expanded: expanded }"
          @click="toggleExpand"
        >
          <i class="ti-chevron-up" />
        </div>
      </tl-flow>
      <tl-grid minWidth="100">
        <tc-button
          name="Workout starten"
          variant="filled"
          tfbackground="success"
          @click="startWorkout"
        />
      </tl-grid>
    </div>
  </transition>
</template>

<script lang="ts">
import { EventBus } from '@/utils/eventbus';
import { IExerciseShowcase } from '@/utils/interfaces';
import { Vue, Component } from 'vue-property-decorator';
import FHShowcase from '../common/FH-Showcase.vue';

@Component({
  components: {
    'fh-showcase': FHShowcase
  }
})
export default class FHModalExerciseList extends Vue {
  public expanded = false;
  public exercises: IExerciseShowcase[] = [];

  mounted() {
    EventBus.$on('modal-exercise-list', (x: IExerciseShowcase) => {
      this.exercises.push(x);
    });
  }

  public toggleExpand() {
    this.expanded = !this.expanded;
  }

  public remove(index: number) {
    this.exercises.splice(index, 1);
  }

  public startWorkout() {
    EventBus.$emit('modals-close');
    EventBus.$emit('modal-start-workout', [...this.exercises]);
    this.expanded = false;
    this.exercises.splice(0, this.exercises.length);
  }
}
</script>

<style lang="scss" scoped>
.fh-modal-exercise-list {
  &,
  * {
    user-select: none;
  }
  position: fixed;
  z-index: 500;
  @media #{$isMobile} {
    bottom: calc(70px + env(safe-area-inset-bottom));
    left: 20px;
    right: 20px;
  }
  @media #{$isDesktop} {
    bottom: 20px;
    right: 20px;
    width: 300px;
  }
  box-shadow: $shadow;
  background: $paragraph;
  border-radius: 20px;
  padding: 10px 20px;
  @media (prefers-color-scheme: dark) {
    background: $paragraph_dark;
  }
  .footer {
    flex-wrap: nowrap;
    font-weight: bold;
    cursor: pointer;
    opacity: 0.75;
    margin: 0 5px 7px;
    transition: all 0.2s ease-in-out;
    &:hover {
      opacity: 1;
    }
    .title {
      flex-grow: 1;
    }
    .expand {
      transition: inherit;
      &.expanded {
        opacity: 1;
        transform: rotate(180deg);
      }
    }
  }
  .exercise-list {
    max-height: 0px;
    overflow: hidden;
    transition: all 0.3s ease-in-out;
    @include custom-scrollbar__light();
    @media (prefers-color-scheme: dark) {
      @include custom-scrollbar__dark();
    }
    &.expanded {
      overflow: auto;
      max-height: 500px;
      padding-top: 10px;
      margin-bottom: 10px;
    }
    .exercise {
      display: grid;
      grid-template-columns: auto 1fr auto;
      grid-gap: 10px;
      margin: 10px 0;
      .position {
        display: flex;
        align-items: center;
        font-weight: bolder;
        font-size: 1.3em;
      }
    }
  }
}
.appaer-enter-active,
.appaer-leave-active {
  transition: all 0.5s ease;
}
.appaer-enter,
.appaer-leave-to {
  margin-top: -30px;
  transform: scale(0.9);
  opacity: 0;
}
</style>
