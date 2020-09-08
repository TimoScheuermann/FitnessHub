<template>
  <div class="workouts" content>
    <tl-flow horizontal="space-between">
      <h1>Meine Workouts</h1>
      <tc-link tfcolor="success" @click="newWorkout">neu</tc-link>
    </tl-flow>
    <br />
    <fh-drag-list>
      <fh-drag-list-item v-for="(l, i) in listItems" :key="l" :index="i">
        {{ l }}
      </fh-drag-list-item>
    </fh-drag-list>
  </div>
</template>

<script lang="ts">
import FHDragListItem from '@/components/shared/drag-list/FH-Drag-List-Item.vue';
import FHDragList from '@/components/shared/drag-list/FH-Drag-List.vue';
import { Vue, Component } from 'vue-property-decorator';

@Component({
  components: {
    'fh-drag-list': FHDragList,
    'fh-drag-list-item': FHDragListItem
  }
})
export default class Workouts extends Vue {
  public listItems = ['Workout 1', 'Workout 2', 'Workout 3'];

  public newWorkout(): void {
    //
  }
}
</script>

<style lang="scss" scoped></style>
