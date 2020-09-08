<template>
  <div class="exercise-details" content>
    <h1>Tomorrow</h1>
    <p>{{ exercise }}</p>
  </div>
</template>

<script lang="ts">
import axios from '@/utils/axios';
import { IExercise } from '@/utils/interfaces';
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class ExerciseDetails extends Vue {
  public exercise: IExercise | null = null;

  mounted() {
    const id = this.$route.params.id;
    this.exercise = this.$store.getters.exercises.filter(
      (x: IExercise) => x._id === id
    )[0];
    if (!this.exercise) {
      this.loadExercise(id);
    }
  }

  public async loadExercise(id: string) {
    axios.get('exercise/' + id).then(res => {
      this.exercise = res.data;
    });
  }
}
</script>

<style lang="scss" scoped></style>
