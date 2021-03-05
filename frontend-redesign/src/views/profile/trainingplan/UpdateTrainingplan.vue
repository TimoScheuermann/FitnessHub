<template>
  <div class="view-update-trainingplan">
    <div content max-width>
      <FHHeader title="Trainingsplan">
        <FHFullScreenCloser @click="close" />
      </FHHeader>
      <br />
      <h1 center>Trainingsplan</h1>
      <h3 center>{{ dayName }}</h3>

      <template v-if="currentExercise">
        <tc-divider :dark="true" />
        <h3 center>Aktuelle Übung</h3>
        <div class="workout-exercise-preview">
          <tc-avatar :src="currentExercise.thumbnail" />
          <div class="title">{{ currentExercise.title }}</div>
        </div>
      </template>

      <template v-if="currentWorkout">
        <tc-divider :dark="true" />
        <h3 center>Aktuelles Workout</h3>
        <div class="workout-exercise-preview">
          <FHWorkoutThumbnail :exercises="currentWorkout.exercises" />
          <div class="title">{{ currentWorkout.title }}</div>
        </div>
      </template>

      <br />

      <tc-segments v-model="segment" :dark="true">
        <tc-segment-item title="Workout" />
        <tc-segment-item title="Übung" />
      </tc-segments>

      <FHAppear>
        <div class="workouts" v-if="segment === 0">
          <tl-flow horizontal="space-between">
            <h3>Workout wählen</h3>
            <tc-button
              background="white"
              variant="opaque"
              icon="plus"
              name="erstellen"
              @click="$oFS('create-workout')"
            />
          </tl-flow>
          <FHList v-if="workouts">
            <FHListItem
              v-for="w in workouts"
              :key="'w' + w._id"
              :avatar="w.exercises[0].thumbnail"
              :title="w.title"
              :subtitle="getWorkoutSubtitle(w)"
            >
              <tc-button
                :disabled="submitting"
                tfbackground="success"
                icon="dot"
                @click="updateDay(w._id)"
              />
            </FHListItem>
          </FHList>
        </div>
      </FHAppear>

      <FHAppear>
        <div class="exercises" v-if="segment === 1">
          <tl-flow horizontal="space-between">
            <h3>Übungen</h3>
            <form @submit.prevent="submit">
              <tc-input
                pattern=".{2,}"
                v-model="query"
                icon="lens"
                :frosted="true"
                :dark="true"
                placeholder="Übung suchen"
                @input="submit"
              />
            </form>
          </tl-flow>

          <FHList>
            <FHListItem
              v-for="e in results"
              :key="'e' + e._id"
              :avatar="e.thumbnail"
              :title="e.title"
            >
              <tc-button
                :disabled="submitting"
                tfbackground="success"
                icon="dot"
                @click="updateDay('ex_' + e._id)"
              />
            </FHListItem>
          </FHList>
        </div>
      </FHAppear>
    </div>
  </div>
</template>

<script lang="ts">
import FHAppear from '@/components/FHAppear.vue';
import FHFullScreenCloser from '@/components/FHFullScreenCloser.vue';
import FHHeader from '@/components/FHHeader.vue';
import FHList from '@/components/list/FHList.vue';
import FHListItem from '@/components/list/FHListItem.vue';
import FHWorkoutThumbnail from '@/components/training/FHWorkoutThumbnail.vue';
import backend from '@/utils/backend';
import { days } from '@/utils/constants';
import { closeFullscreen } from '@/utils/functions';
import { IExercise, IWorkout } from '@/utils/interfaces';
import { UserManagement } from '@/utils/UserManagement';
import { Vue, Component } from 'vue-property-decorator';

@Component({
  components: {
    FHHeader,
    FHFullScreenCloser,
    FHAppear,
    FHWorkoutThumbnail,
    FHList,
    FHListItem
  }
})
export default class UpdateTrainingplan extends Vue {
  public segment = 0;
  public submitting = false;
  public results: IExercise[] = [];
  public query = '';

  public async submit(): Promise<void> {
    if (this.query.length < 2) return;
    const { data } = await backend.get(
      'exercise/find/' + encodeURI(this.query)
    );
    this.results = data || [];
  }

  get day(): number {
    const day = this.$route.params.day;
    if (!day) this.close();
    if (isNaN(+day)) this.close();

    const dayNumb = +day;
    if (dayNumb < 0 || dayNumb > 6) this.close();
    return dayNumb;
  }

  get dayName(): string {
    if (isNaN(this.day)) return '';
    return days[this.day];
  }

  get trainingplaDay(): { id: string; exercises: IExercise[] } | null {
    const plan = UserManagement.getTrainingplan();
    if (!plan) return null;
    for (const [key, value] of Object.entries(plan)) {
      if (new String(this.day) == key) return value;
    }
    return null;
  }

  get currentExercise(): null | IExercise {
    const day = this.trainingplaDay;
    if (!day) return null;
    if (!day.id.startsWith('ex_')) return null;
    return day.exercises[0];
  }

  get currentWorkout(): null | IWorkout {
    const day = this.trainingplaDay;
    if (!day) return null;
    if (day.id.startsWith('ex_')) return null;
    return UserManagement.getWorkout(day.id);
  }

  get workouts(): IWorkout[] | null {
    return UserManagement.getWorkouts();
  }

  public getWorkoutSubtitle(w: IWorkout): string {
    const { length } = w.exercises;
    if (length === 1) return 'Eine Übung';
    return length + ' Übungen';
  }

  public async updateDay(id: string): Promise<void> {
    if (!id) return;
    if (this.submitting) return;
    this.submitting = true;

    const { data } = await backend.put('trainingplan/' + this.day + '/' + id);
    UserManagement.setTrainingplan(data);
    this.close();
  }

  public close(): void {
    closeFullscreen('trainingplan');
  }
}
</script>

<style lang="scss" scoped>
.view-update-trainingplan {
  min-height: 100vh;
  color: #fff;

  background: linear-gradient(rgba($color, 0.6), rgba($color, 0.2)),
    url('/assets/workout-bg.webp');
  background-size: cover;
  background-position: center center;

  [content] {
    padding-bottom: 20px;
  }

  .workout-exercise-preview {
    display: grid;
    grid-template-columns: auto auto;
    grid-gap: 20px;
    width: fit-content;
    @include backdrop-blur($color);
    border-radius: 70px;
    margin: 0 auto;
    .tc-avatar,
    .fh-workout-thumbnail {
      border-radius: inherit;
      width: 60px;
      height: 60px;
    }
    .title {
      padding-right: 20px;
      font-weight: 550;
      display: grid;
      place-content: center;
    }
  }

  /deep/ .tc-segments--head {
    background: $color !important;
    @supports (backdrop-filter: saturate(180%) blur(20px)) {
      background: rgba($color, 0.5) !important;
      backdrop-filter: saturate(180%) blur(20px);
    }
  }

  .fh-list {
    max-height: 320px;
    overflow-y: auto;
    @include custom-scrollbar__dark();
    .fh-list-item {
      background: rgba($color, 0.8);
      color: #fff;
      .tc-button {
        border-radius: 50px;
        margin-right: -5px;
      }
    }
  }
}
</style>
