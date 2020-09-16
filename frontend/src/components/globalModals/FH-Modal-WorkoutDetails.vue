<template>
  <tc-modal
    @close="close"
    v-model="modalOpened"
    :dark="$store.getters.darkmode"
    class="fh-modal-workout-details"
    :class="{ 'content-loaded': workout }"
    :title="title"
  >
    <div class="error" v-if="error">
      <div class="icon">
        <i class="ti-exclamation-triangle" />
      </div>
      <div class="title">
        Das angeforderte Workout konnte nicht gefunden werden.
      </div>
      <tl-grid>
        <tc-button
          name="Ansicht schließen"
          tfbackground="success"
          @click="close"
        />
      </tl-grid>
    </div>
    <tl-flow v-else-if="!workout">
      <tc-spinner size="20" :dark="$store.getters.darkmode" />
    </tl-flow>
    <template v-else>
      <div class="thumbnail">
        <fh-workout-thumbnail :workout="workout">
          <fh-workout-informations :workout="workout" />
        </fh-workout-thumbnail>
      </div>
      <h1>Übungen</h1>
      <fh-pd-workout :workout="workout" />
    </template>
  </tc-modal>
</template>

<script lang="ts">
import axios from '@/utils/axios';
import { EventBus } from '@/utils/eventbus';
import { IWorkout, IModalReturn } from '@/utils/interfaces';
import { Component, Mixins } from 'vue-property-decorator';
import FHPropertyDetailsWorkout from '../propertyDetails/FH-PD-Workout.vue';
import FHworkoutInformations from '../workout/thumbnail/FH-Workout-Informations.vue';
import FHWorkoutThumbnail from '../workout/thumbnail/FH-Workout-Thumbnail.vue';
import FHModalMixin from './FHModal.mixin';

@Component({
  components: {
    'fh-pd-workout': FHPropertyDetailsWorkout,
    'fh-workout-informations': FHworkoutInformations,
    'fh-workout-thumbnail': FHWorkoutThumbnail
  }
})
export default class FHModalWorkoutDetails extends Mixins(FHModalMixin) {
  public error = false;
  public workoutId = '';
  public workout: IWorkout | null = null;

  mounted() {
    EventBus.$on('modal-workout-details', this.open);
    EventBus.$on(
      'modal-workout-details-return',
      (modalReturn: IModalReturn) => {
        this.modalReturn = modalReturn;
      }
    );
    // setTimeout(() => {
    //   this.open('5f5e5a521cd04741df5ca246');
    // }, 500);
  }

  get title(): string | null {
    if (!this.workout) return 'Lade Informationen...';
    return null;
  }

  public open(id: string): void {
    console.log('Opening Workout-Details Modal for', id);
    this.error = false;
    if (this.workoutId !== id) {
      this.workout = null;
      this.workoutId = id;
    }
    this.modalOpened = true;
    if (!this.workout) {
      axios
        .get('workout/' + this.workoutId, { timeout: 2000 })
        .then(res => {
          if (!res.data) {
            this.error = true;
            return;
          }
          this.workout = res.data;
        })
        .catch(() => {
          this.error = true;
        });
    }
  }
}
</script>

<style lang="scss" scoped>
.fh-modal-workout-details {
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
