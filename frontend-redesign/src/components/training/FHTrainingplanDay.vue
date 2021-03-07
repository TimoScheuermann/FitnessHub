<template>
  <div class="fh-trainingplan-day">
    <tc-spinner v-if="!isLoaded" :dark="$store.getters.darkmode" size="20" />
    <div class="exercises" v-else>
      <tl-flow horizontal="space-between">
        <FHHeading :subtitle="amount || 'Keine Übungen'" :title="dayName" />
        <tc-action :dark="$store.getters.darkmode">
          <tc-action-item
            v-if="amount"
            success
            title="Starten"
            icon="play"
            @click="startWorkout"
          />
          <tc-action-item title="Bearbeiten" icon="pencil" @click="updateDay" />
          <tc-action-item
            v-if="amount"
            title="Alle löschen"
            icon="trashcan-alt"
            @click="removeDay"
          />
        </tc-action>
      </tl-flow>
      <FHCarousel v-if="day">
        <FHListItem
          v-for="(e, i) in day.exercises"
          :key="i + e._id"
          :title="e.title"
          :avatar="e.thumbnail"
        />
      </FHCarousel>
      <br v-else />
    </div>
  </div>
</template>

<script lang="ts">
import backend from '@/utils/backend';
import { days } from '@/utils/constants';
import { openFullscreen } from '@/utils/functions';
import { IExercise, IExerciseInfo } from '@/utils/interfaces';
import { UserManagement } from '@/utils/UserManagement';
import { WorkoutManagement } from '@/utils/WorkoutManagement';
import { Vue, Component, Prop } from 'vue-property-decorator';
import FHCarousel from '../FHCarousel.vue';
import FHHeading from '../FHHeading.vue';
import FHListItem from '../list/FHListItem.vue';
import FHExercisePreview from './FHExercisePreview.vue';

@Component({
  components: {
    FHCarousel,
    FHExercisePreview,
    FHListItem,
    FHHeading
  }
})
export default class TrainingplanDay extends Vue {
  @Prop() daynumber!: number;

  public actionActive = false;

  get isLoaded(): boolean {
    return !!UserManagement.getTrainingplan();
  }

  get day(): { id: string; exercises: IExercise[] } | null {
    if (this.daynumber === undefined) return null;
    const plan = UserManagement.getTrainingplan();
    if (!plan) return null;
    for (const [key, value] of Object.entries(plan)) {
      if (new String(this.daynumber) == key) return value;
    }
    return null;
  }

  get dayName(): string {
    return days[this.daynumber];
  }

  get amount(): string | null {
    const day = this.day;
    if (!day) return null;
    const { length } = day.exercises;
    return length + ' Übung' + (length === 1 ? '' : 'en');
  }

  public async removeDay(): Promise<void> {
    if (this.actionActive) return;
    this.actionActive = true;
    const { data } = await backend.delete('trainingplan/' + this.daynumber);
    UserManagement.setTrainingplan(data);
    this.actionActive = false;
  }

  public startWorkout(): void {
    const day = this.day;
    if (!day) return;
    const info: IExerciseInfo[] = day.exercises.map(ex => {
      return {
        affectedMuscles: ex.affectedMuscles,
        difficulty: ex.difficulty,
        thumbnail: ex.thumbnail,
        title: ex.title,
        type: ex.distance ? 'distance' : ex.sets ? 'gym' : 'time',
        _id: ex._id
      };
    });
    WorkoutManagement.startWorkout(info);
  }

  public updateDay(): void {
    openFullscreen('update-trainingplan', { day: '' + this.daynumber });
  }
}
</script>

<style lang="scss" scoped>
.fh-trainingplan-day {
  padding-bottom: 10px;
  .tl-flow {
    width: 90vw;
    max-width: 800px;
  }
  .fh-heading {
    margin: 0;
  }
  .fh-carousel {
    margin-top: 0;
  }
  .fh-list-item {
    width: fit-content !important;
    margin-left: 10px !important;

    &:nth-child(3) {
      margin-left: 0px !important;
    }

    /deep/ .title {
      font-weight: 500;
    }
  }
}
</style>
