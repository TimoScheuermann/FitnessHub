<template>
  <div class="workouts" content>
    <tl-flow horizontal="space-between">
      <h1>Meine Workouts</h1>
      <tc-link tfcolor="success" @click="newWorkout">neu</tc-link>
    </tl-flow>
    <br />
    <tc-list :dark="$store.getters.darkmode">
      <tc-list-item v-for="l in listItems" :key="l" :title="l" />
    </tc-list>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import sortableDirective from '@/utils/draggableDirective';
import { Sortable } from '@shopify/draggable';

@Component({
  directives: { sortableDirective }
})
export default class Workouts extends Vue {
  public listItems = ['Workout 1', 'Workout 2', 'Workout 3'];

  mounted() {
    console.log('Reload complete');
    const sortable = new Sortable(document.querySelectorAll('.tc-list'), {
      draggable: '.tc-list-item'
    });
    sortable.on(
      'sortable:stop',
      (e: { oldIndex: number; newIndex: number }) => {
        const oldI = e.oldIndex;
        const newI = e.newIndex;
        const stored = this.listItems[newI];
        this.listItems[newI] = this.listItems[oldI];
        this.listItems[oldI] = stored;
        this.$forceUpdate();
      }
    );
  }

  public newWorkout(): void {
    //
  }
}
</script>

<style lang="scss" scoped></style>
