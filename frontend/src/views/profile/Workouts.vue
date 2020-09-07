<template>
  <div class="workouts" content>
    <tl-flow horizontal="space-between">
      <h1>Meine Workouts</h1>
      <tc-link tfcolor="success" @click="newWorkout">neu</tc-link>
    </tl-flow>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
@Component
export default class Workouts extends Vue {
  public newWorkout(): void {
    //
  }
}
</script>

<style lang="scss" scoped></style>
