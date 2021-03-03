<template>
  <div class="view-create-workout">
    <div content max-width>
      CreateWorkout
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class CreateWorkout extends Vue {}
</script>

<style lang="scss" scoped>
.view-create-workout {
  min-height: 100vh;

  [content] {
    padding-bottom: 20px;
  }
}
</style>
