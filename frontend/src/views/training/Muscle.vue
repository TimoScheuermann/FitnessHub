<template>
  <div class="Muscle">
    <fh-mobile-header :title="muscle" />
    <tc-hero
      :dark="true"
      :hasFixedHeader="$store.getters.fixedHeader"
      :height="200"
    >
      <img
        src="https://images.unsplash.com/photo-1549060279-7e168fcee0c2?q=25"
        slot="background"
        alt
      />
      <h1>{{ muscle }}</h1>
    </tc-hero>
    <div content>
      <h1>Übungen</h1>
      <tl-grid>
        <fh-exercise v-for="ex in exercises" :key="ex._id" :exercise="ex" />
      </tl-grid>
    </div>
  </div>
</template>

<script lang="ts">
import { IExercise } from '@/utils/interfaces';
import { Vue, Component } from 'vue-property-decorator';
import FHExercise from '@/components/shared/FH-Exercise.vue';
import axios from '@/utils/axios';

@Component({ components: { 'fh-exercise': FHExercise } })
export default class Muscle extends Vue {
  private exercises: IExercise[] = [];

  async mounted() {
    this.exercises = (await axios.get('exercise/muscle/' + this.muscle)).data;
  }

  get muscle(): string {
    return this.$route.params.muscle;
  }
}
</script>

<style lang="scss" scoped></style>
