<template>
  <div class="edit-workout" content v-if="workout">
    <h1>Name</h1>
    <tc-input v-model="workout.title" :dark="$store.getters.darkmode" />
    <tl-flow horizontal="space-between">
      <h1>Übungen</h1>
      <tc-checkbox :dark="$store.getters.darkmode" title="Löschmodus" />
    </tl-flow>
    <!-- <p>{{ names }}</p> -->
    <tc-list :key="key" :dark="$store.getters.darkmode">
      <tc-list-item
        v-for="e in workout.exercises"
        :key="e._id"
        :title="e.title"
        @click="() => {}"
        icon="align-justify"
      />
    </tc-list>
  </div>
</template>

<script lang="ts">
import { IWorkout } from '@/utils/interfaces';
import { Vue, Component } from 'vue-property-decorator';
import { Sortable } from '@shopify/draggable';
import sortableDirective from '@/utils/draggableDirective';

@Component({
  directives: { sortableDirective }
})
export default class EditWorkout extends Vue {
  public key = new Date().getTime();
  get workout(): IWorkout {
    return this.$store.getters.workouts.filter(
      (x: IWorkout) => x._id === this.$route.params.id
    )[0];
  }

  get names(): string[] {
    return this.workout.exercises.map(x => x.title);
  }

  mounted() {
    setTimeout(() => {
      this.startDrag();
    }, 100);
  }

  public startDrag(): void {
    const sortable = new Sortable(document.querySelectorAll('.tc-list'), {
      draggable: '.tc-list-item'
    });
    sortable.on(
      'sortable:stop',
      (e: { oldIndex: number; newIndex: number }) => {
        const oldI = e.oldIndex;
        const newI = e.newIndex;
        const update = { ...this.workout };
        const save = update.exercises.splice(oldI, 1)[0];
        update.exercises.splice(newI, 0, save);
        this.$store.commit('manageWorkout', update);
        this.key = new Date().getTime();
        setTimeout(() => {
          this.startDrag();
        }, 100);
      }
    );
  }
}
</script>

<style lang="scss" scoped></style>
