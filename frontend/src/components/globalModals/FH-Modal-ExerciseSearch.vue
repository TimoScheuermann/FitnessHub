<template>
  <tc-modal
    class="fh-modal-exercise-search"
    :dark="$store.getters.darkmode"
    title="Nach einer Übung suchen"
    v-model="modalOpened"
  >
    <tc-input
      :dark="$store.getters.darkmode"
      icon="lens"
      v-model="query"
      @input="search"
    />
    <transition-group tag="div" class="exercises" name="exercises">
      <div
        class="exercise"
        v-for="e in results"
        :key="e._id"
        @click="selected(e)"
      >
        <tc-avatar size="tiny" border="rounded" :src="e.thumbnail" />
        <div class="info">
          <fh-difficulty :difficulty="e.difficulty" />
          <div class="title">{{ e.title }}</div>
        </div>
        <tl-flow v-if="$store.getters.valid">
          <tc-button
            @click.stop="addToList(e)"
            icon="list"
            variant="filled"
            tfbackground="success"
          />
        </tl-flow>
      </div>
    </transition-group>
  </tc-modal>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import { IExercise, IExerciseShowcase } from '@/utils/interfaces';
import axios from '@/utils/axios';
import { EventBus } from '@/utils/eventbus';
import FHModalMixin from './FHModal.mixin';
import FHDifficulty from '../common/FH-Difficulty.vue';

@Component({
  components: {
    'fh-difficulty': FHDifficulty
  }
})
export default class FHModalExerciseSearch extends Mixins(FHModalMixin) {
  public results: IExercise[] = [];
  public query = '';
  public returnSocket = '';

  mounted() {
    EventBus.$on('modal-exercise-search', (returnSocket: string) => {
      this.returnSocket = returnSocket;
      this.modalOpened = true;
    });
  }

  public selected(selected: IExercise): void {
    EventBus.$emit(this.returnSocket, selected);
    this.close();
  }

  public async search(query: string = this.query): Promise<void> {
    if (query.length > 2) {
      const { data } = await axios.get('exercise/find/' + encodeURI(query));
      const searchResults: IExercise[] = data;
      this.results = this.results.filter(x => searchResults.includes(x));
      searchResults
        .filter(x => !this.results.includes(x))
        .forEach(x => this.results.push(x));
    } else {
      this.results = this.results.filter(() => false);
    }
  }

  public addToList(exercise: IExercise) {
    EventBus.$emit('modal-exercise-list', {
      _id: exercise._id,
      title: exercise.title,
      thumbnail: exercise.thumbnail,
      type: exercise.distance ? 'distance' : exercise.sets ? 'gym' : 'time'
    } as IExerciseShowcase);
  }
}
</script>
<style lang="scss" scoped>
.fh-modal-exercise-search {
  &,
  * {
    user-select: none;
  }
  .exercises {
    margin-top: 10px;
    position: relative;
    .exercise {
      display: grid;
      grid-template-columns: auto 1fr auto;
      grid-gap: 20px;
      padding: 5px 0;
      cursor: pointer;
      user-select: none;
      transition: background 0.2s ease-in-out;
      &:hover {
        background: rgba(0, 0, 0, 0.1);
        @media (prefers-color-scheme: dark) {
          background: rgba(0, 0, 0, 0.2);
        }
      }
      &:not(:first-child) {
        border-top: 1px solid rgba(#111, 0.2);
        @media (prefers-color-scheme: dark) {
          border-color: #fff;
        }
      }
      .info {
        display: flex;
        flex-direction: column;
        justify-content: center;
        .title {
          margin-top: 5px;
          font-weight: bold;
        }
      }
    }
  }

  .exercises-move,
  .exercises-enter-active {
    transition: all 0.5s;
  }
  .exercises-leave-active {
    transition: all 0.2s;
  }
  .exercises-enter {
    opacity: 0;
    transform: translateY(30px);
  }
  .exercises-leave-to {
    opacity: 0;
    transform: translateY(-30px);
  }
}
</style>
