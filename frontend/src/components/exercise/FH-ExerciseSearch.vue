<template>
  <div class="fh-exercise-search">
    <tc-input
      :dark="$store.getters.darkmode"
      placeholder="Name, Muskel, etc."
      v-model="query"
      @input="search"
      icon="lens"
    />
    <template v-if="results.length > 0">
      <br />
      <tc-list :dark="$store.getters.darkmode">
        <tc-list-item
          v-for="sr in results"
          :title="sr.title"
          :key="sr._id"
          icon="plus"
          @click="selected(sr)"
        />
      </tc-list>
    </template>
  </div>
</template>

<script lang="ts">
import axios from '@/utils/axios';
import { IExercise } from '@/utils/interfaces';
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';

@Component
export default class FHExerciseSearch extends Vue {
  @Prop() timestamp!: number;
  @Prop({
    default: () => {
      return [];
    }
  })
  skip!: string[];

  @Watch('timestamp')
  reset(): void {
    this.searchResults = [];
    this.query = '';
  }

  public searchResults: IExercise[] = [];
  public query = '';

  get results(): IExercise[] {
    return this.searchResults.filter(x => !this.skip.includes(x._id));
  }

  /**
   * find a specific exercise
   */
  public search(query: string = this.query): void {
    if (query.length > 2) {
      axios.get('exercise/find/' + query).then(res => {
        this.searchResults = res.data;
      });
    } else {
      this.searchResults = [];
    }
  }

  public selected(exercise: IExercise): void {
    this.$emit('exercise', exercise);
  }
}
</script>

<style lang="scss" scoped></style>
