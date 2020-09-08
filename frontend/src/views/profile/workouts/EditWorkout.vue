<template>
  <div class="edit-workout" content v-if="workout">
    <h1>Name</h1>
    <tc-input v-model="workout.title" :dark="$store.getters.darkmode" />
    <tl-flow horizontal="space-between">
      <h1>Übungen</h1>
      <tl-flow flow="column" vertical="end">
        <tc-checkbox
          v-model="deleteMode"
          :dark="$store.getters.darkmode"
          @input="arrangeMode = false"
          title="löschen"
        />
        <tc-checkbox
          v-model="arrangeMode"
          :dark="$store.getters.darkmode"
          @input="deleteMode = false"
          title="verschieben"
        />
      </tl-flow>
    </tl-flow>
    <tc-list :dark="$store.getters.darkmode">
      <tc-list-item
        v-for="(e, index) in workout.exercises"
        :key="e._id"
        :user="{ username: e.title }"
        :class="{ deleteMode: deleteMode, drag: arrangeMode }"
        :title="e.title"
        :icon="deleteMode ? 'trashcan-alt' : 'align-justify'"
        @click="handleClick(index)"
        :to="
          deleteMode
            ? undefined
            : { name: 'exercise-details', params: { id: e._id } }
        "
      />
    </tc-list>
  </div>
</template>

<script lang="ts">
import { IWorkout } from '@/utils/interfaces';
import { Vue, Component } from 'vue-property-decorator';
import { Sortable } from '@shopify/draggable';
import axios from '@/utils/axios';
import { CreateWorkoutDTO } from '@/utils/dtos';

@Component
export default class EditWorkout extends Vue {
  public deleteMode = false;
  public arrangeMode = false;

  get workout(): IWorkout {
    return this.$store.getters.workouts.filter(
      (x: IWorkout) => x._id === this.$route.params.id
    )[0];
  }

  get names(): string[] {
    return this.workout.exercises.map(x => x.title);
  }

  public async handleClick(index: number): Promise<void> {
    if (this.deleteMode) {
      const update = { ...this.workout };
      update.exercises.splice(index, 1);
      await axios.put('workout/' + this.workout._id, {
        title: this.workout.title,
        exercises: update.exercises.map(x => x._id)
      } as CreateWorkoutDTO);
    }
  }

  mounted() {
    setTimeout(() => {
      this.startDrag();
    }, 100);
  }

  public startDrag(): void {
    const sortable = new Sortable(document.querySelectorAll('.tc-list'), {
      draggable: '.tc-list-item.drag'
    });
    sortable.on(
      'sortable:stop',
      async (e: { oldIndex: number; newIndex: number }) => {
        const update = { ...this.workout };
        const save = update.exercises.splice(e.oldIndex, 1)[0];
        update.exercises.splice(e.newIndex, 0, save);
        await axios.put('workout/' + this.workout._id, {
          title: this.workout.title,
          exercises: update.exercises.map(x => x._id)
        } as CreateWorkoutDTO);
      }
    );
  }
}
</script>

<style lang="scss" scoped>
.tc-list-item {
  background: $paragraph;
  @media (prefers-color-scheme: dark) {
    background: $paragraph_dark;
  }
  &.deleteMode {
    animation: shake-horizontal 2s cubic-bezier(0.455, 0.03, 0.515, 0.955)
      infinite both;
  }
}
@keyframes shake-horizontal {
  0%,
  20%,
  90%,
  100% {
    transform: translateX(0);
  }
  30%,
  50% {
    transform: translateX(-5px);
  }
  20%,
  40% {
    transform: translateX(5px);
  }
  70% {
    transform: translateX(4px);
  }
  80% {
    transform: translateX(-4px);
  }
}
</style>
