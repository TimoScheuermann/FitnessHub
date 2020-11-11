<template>
  <tc-modal
    @close="close"
    v-model="modalOpened"
    :dark="$store.getters.darkmode"
    class="fh-modal-exercise-details"
    :class="{ 'content-loaded': exercise }"
    :title="title"
  >
    <div class="error" v-if="error">
      <div class="icon">
        <i class="ti-exclamation-triangle" />
      </div>
      <div class="title">
        Die angeforderte Übung konnte nicht gefunden werden.
      </div>
      <tl-grid>
        <tc-button
          name="Ansicht schließen"
          tfbackground="success"
          @click="close"
        />
      </tl-grid>
    </div>
    <tl-flow v-else-if="!exercise">
      <tc-spinner size="20" :dark="$store.getters.darkmode" />
    </tl-flow>
    <template v-else>
      <div class="thumbnail">
        <img :src="exercise.thumbnail" alt="" />
        <fh-exercise-informations :info="exercise" />
        <fh-exercise-atw-button :info="exercise" />
      </div>
      <fh-pd-exercise :exercise="exercise" />
    </template>
  </tc-modal>
</template>

<script lang="ts">
import axios from '@/utils/axios';
import { EventBus } from '@/utils/eventbus';
import { IExercise, IModalReturn } from '@/utils/interfaces';
import { Component, Mixins } from 'vue-property-decorator';
import FHExerciseATWButton from '../exercise/thumbnail/FH-Exercise-ATWButton.vue';
import FHExerciseInformations from '../exercise/thumbnail/FH-Exercise-Informations.vue';
import FHPropertyDetailsExercise from '../propertyDetails/FH-PD-Exercise.vue';
import FHModalMixin from './FHModal.mixin';

@Component({
  components: {
    'fh-pd-exercise': FHPropertyDetailsExercise,
    'fh-exercise-atw-button': FHExerciseATWButton,
    'fh-exercise-informations': FHExerciseInformations
  }
})
export default class FHModalExerciseDetails extends Mixins(FHModalMixin) {
  public error = false;
  public exercise: IExercise | null = null;

  mounted() {
    EventBus.$on('modal-exercise-details', this.open);
    EventBus.$on(
      'modal-exercise-details-return',
      (modalReturn: IModalReturn) => {
        this.modalReturn = modalReturn;
      }
    );
  }

  get title(): string | null {
    if (!this.exercise) return 'Lade Informationen...';
    return null;
  }

  public open(id: string | IExercise): void {
    this.error = false;
    this.exercise = null;

    if (typeof id === 'object') {
      this.exercise = id as IExercise;

      // load exercise if not already loaded
      // eslint-disable-next-line
    } else if (!this.exercise || this.exercise!._id !== id) {
      this.exercise = null;
      axios
        .get('exercise/' + id)
        .then(res => {
          this.exercise = res.data;
          this.error = !this.exercise;
        })
        .catch(() => {
          this.error = true;
        });
    }
    this.modalOpened = true;
  }
}
</script>

<style lang="scss" scoped>
.fh-modal-exercise-details {
  &,
  * {
    user-select: none;
  }
  &.content-loaded {
    /deep/ .tc-modal--head__prestyled {
      padding: 0;
    }
  }
  .error {
    .icon {
      color: $error;
      text-align: center;
      font-size: 3em;
    }
    .title {
      margin-bottom: 10px;
    }
  }
  .thumbnail {
    height: 200px;
    width: calc(100% + 10vw);
    margin-left: -5vw;
    position: relative;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      filter: brightness(50%);
    }
  }
}
</style>
