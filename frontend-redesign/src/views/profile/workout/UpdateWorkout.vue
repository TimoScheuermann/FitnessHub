<template>
  <div class="view-update-workout">
    <div content max-width>
      UpdateWorkout
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class UpdateWorkout extends Vue {}
</script>

<style lang="scss" scoped>
.view-update-workout {
  min-height: 100vh;

  [content] {
    padding-bottom: 20px;
  }
}
</style>
