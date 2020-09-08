<template>
  <div class="Muscle">
    <fh-mobile-header :title="muscle" />
    <tc-hero :dark="true" :hasFixedHeader="$store.getters.fixedHeader" :height="200">
      <img
        src="https://images.unsplash.com/photo-1549060279-7e168fcee0c2?q=25"
        slot="background"
        alt
      />
      <h1>{{ muscle }}</h1>
    </tc-hero>
    <div content>
      <h2>Übungen</h2>
      <tl-grid>
        <fh-exercise class="fh-exercise" v-for="ex in exercises" :key="ex._id" :exercise="ex"></fh-exercise>
      </tl-grid>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { component } from 'vue/types/umd';
import { IExercise } from '../../../../backend/src/exercise/interfaces/IExercise';
import FHExercise from '../../components/shared/FH-Exercise.vue';
import axios from '../../utils/axios';
import { muscles } from '../../utils/muscles';

@Component({ components: { 'fh-exercise': FHExercise } })
export default class Muscle extends Vue {
  private exercises: IExercise[] = [];
  async mounted() {
    this.exercises = (await axios.get('exercise')).data;
  }
  get muscle(): string {
    return this.$route.params.muscle;
  }
}
</script>

<style lang="scss" scoped>
</style>