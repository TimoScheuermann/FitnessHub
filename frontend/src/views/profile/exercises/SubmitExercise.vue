<template>
  <div class="submit-exercises" content>
    <tl-grid>
      <div>
        <h1>Allgemein</h1>
        <tc-input
          title="Name der Übung"
          v-model="exercise.title"
          :dark="$store.getters.darkmode"
        />
        <tc-input
          title="Thumbnail"
          v-model="exercise.thumbnail"
          :dark="$store.getters.darkmode"
        />
        <tc-input
          title="Erklärendes Video (optional)"
          v-model="exercise.explanatoryVideo"
          :dark="$store.getters.darkmode"
        />
        <tc-select
          title="Betroffene Muskeln"
          v-model="exercise.affectedMuscles"
          :values="availableMuscles"
          :multiple="true"
          placeholder="Wähle mind. einen Muskel"
          :dark="$store.getters.darkmode"
        />
      </div>
      <div>
        <h1>Kategorie</h1>
        <tc-segments
          v-model="selectedCategorie"
          :dark="$store.getters.darkmode"
        >
          <tc-segment-item v-for="c in categories" :key="c" :title="c" />
        </tc-segments>
        <template v-if="selectedCategorie === 0">
          <div class="title">Sätze</div>
          <div class="gym-min-max">
            <tc-input
              type="number"
              v-model="setsMin"
              :dark="$store.getters.darkmode"
            />
            <div class="mid">-</div>
            <tc-input
              type="number"
              v-model="setsMax"
              :dark="$store.getters.darkmode"
            />
          </div>
          <div class="title">Wiederholungen</div>
          <div class="gym-min-max">
            <tc-input
              type="number"
              v-model="repsMin"
              :dark="$store.getters.darkmode"
            />
            <div class="mid">-</div>
            <tc-input
              type="number"
              v-model="repsMax"
              :dark="$store.getters.darkmode"
            />
          </div>
        </template>
        <template v-else-if="selectedCategorie === 1">
          <div class="title">Zeit (ungefähr)</div>
          <div class="gym-min-max">
            <tc-input
              type="number"
              icon="clock-simple"
              v-model="exercise.time"
              :dark="$store.getters.darkmode"
            />
            <div class="mid"></div>
            <tc-select
              :values="availableTimes"
              v-model="selectedTime"
              :dark="$store.getters.darkmode"
            />
          </div>
        </template>
        <template v-else-if="selectedCategorie === 2">
          <tc-input
            title="Strecke"
            v-model="exercise.distance"
            :dark="$store.getters.darkmode"
          />
        </template>
      </div>
    </tl-grid>
    <h1>Informationen</h1>
    <tl-grid>
      <div>
        <h2>Übungsablauf</h2>
        <tc-textarea
          :dark="$store.getters.darkmode"
          :rows="5"
          v-model="newStep"
        />
        <tc-button tfbackground="success" name="Hinzufügen" @click="addStep" />

        <div class="title" v-if="exercise.steps.length > 0">Schritte</div>
        <tc-table :dark="$store.getters.darkmode">
          <tc-tr v-for="(s, i) in exercise.steps" :key="s">
            <tc-td>{{ i + 1 }}</tc-td>
            <tc-td>{{ s }}</tc-td>
            <tc-td>
              <tc-link tfcolor="error" @click="removeStep(i)">
                entfernen
              </tc-link>
            </tc-td>
          </tc-tr>
        </tc-table>
      </div>

      <div>
        <h2>Hinweise</h2>
        <tc-textarea
          :dark="$store.getters.darkmode"
          :rows="5"
          v-model="newNotice"
        />
        <tc-button
          tfbackground="success"
          name="Hinzufügen"
          @click="addNotice"
        />

        <div class="title" v-if="exercise.warnings.length > 0">Schritte</div>
        <tc-table :dark="$store.getters.darkmode">
          <tc-tr v-for="(s, i) in exercise.warnings" :key="s">
            <tc-td>{{ i + 1 }}</tc-td>
            <tc-td>{{ s }}</tc-td>
            <tc-td>
              <tc-link tfcolor="error" @click="removeNotice(i)">
                entfernen
              </tc-link>
            </tc-td>
          </tc-tr>
        </tc-table>
      </div>

      <div>
        <tl-flow horizontal="space-between">
          <h2>Schwierigkeit</h2>
          <div class="indicator" :diff="exercise.difficulty">
            <i
              class="ti-circle"
              v-for="(i, j) in Array(+exercise.difficulty)"
              :key="j"
            />
          </div>
        </tl-flow>

        <tc-slider
          v-model="exercise.difficulty"
          min="1"
          max="3"
          step="1"
          :dark="$store.getters.darkmode"
          iconStart="dot"
          iconEnd="circle"
          tfcolor="success"
        />
      </div>
    </tl-grid>

    <div class="submit" v-if="!exerciseEdit">
      <tc-button
        variant="filled"
        tfbackground="success"
        name="Übung einreichen"
        icon="share"
        @click="submit"
        :disabled="$store.getters.loading"
      />
    </div>
    <div class="modalButton" v-else>
      <tc-button
        variant="filled"
        tfbackground="success"
        name="Veröffentlichen"
        icon="globe"
        @click="submitChanges"
        :disabled="$store.getters.loading"
      />
      <tc-button
        v-if="editMode && editMode === 'publish'"
        variant="filled"
        tfbackground="error"
        name="Ablehnen"
        icon="trashcan-alt"
        @click="rejectPublish"
        :disabled="$store.getters.loading"
      />
    </div>
  </div>
</template>

<script lang="ts">
import axios from '@/utils/axios';
import { aHour, aMinute } from '@/utils/constants';
import { CreateExerciseDTO } from '@/utils/dtos';
import { sendNotification } from '@/utils/functions';
import { IExercise } from '@/utils/interfaces';
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
@Component
export default class SubmitExercise extends Vue {
  @Prop() exerciseEdit!: IExercise;
  @Prop() editMode!: string;

  public categories: string[] = ['Gym', 'Zeit', 'Strecke'];
  public selectedCategorie = 2;
  public setsMin = 4;
  public setsMax = 5;
  public repsMin = 8;
  public repsMax = 12;
  public selectedTime = 'Minuten';
  public newStep = '';
  public newNotice = '';

  public availableMuscles: string[] = [
    'Trizeps',
    'Bizeps',
    'Schulter (seite)',
    'Lat',
    'Abduktor',
    'Adduktor',
    'Gesäßmuskel',
    'Waden',
    'Oberschenkel',
    'Trapezmuskel',
    'Unterer Rücken',
    'Schulter (hinten)',
    'Schulter (vorne)'
  ].sort((a, b) => a.localeCompare(b));

  public availableTimes: string[] = ['Sekunden', 'Minuten', 'Stunden'];

  public exercise: CreateExerciseDTO = {
    title: 'a',
    thumbnail: 'b',
    explanatoryVideo: '',
    affectedMuscles: ['d'],
    time: 20,
    distance: '5 km',
    sets: '',
    reps: '',
    difficulty: 1,
    warnings: [],
    steps: []
  };

  @Watch('exerciseEdit')
  exerciseEditChanged(to: IExercise) {
    this.exercise = to;
    if (this.editMode && this.editMode === 'edit') {
      this.exercise = {
        ...this.exercise,
        ...to.editedData
      };
    }
    if (to.reps) this.selectedCategorie = 0;
    if (to.time) this.selectedCategorie = 1;
    if (to.distance) this.selectedCategorie = 2;
  }

  mounted() {
    if (this.exerciseEdit) {
      this.exerciseEditChanged(this.exerciseEdit);
    }
  }

  public addStep(): void {
    if (this.newStep.length < 5) return;
    this.exercise.steps.push(this.newStep);
    this.newStep = '';
  }
  public removeStep(index: number): void {
    this.exercise.steps.splice(index, 1);
  }

  public addNotice(): void {
    if (this.newNotice.length < 5) return;
    this.exercise.warnings.push(this.newNotice);
    this.newNotice = '';
  }
  public removeNotice(index: number): void {
    this.exercise.warnings.splice(index, 1);
  }

  public async submit(): Promise<void> {
    if (this.exercise.title.length === 0) {
      this.notifiy('Name', 'Bitte trage einen Namen für die Übung ein');
      return;
    }
    if (this.exercise.thumbnail.length === 0) {
      this.notifiy(
        'Thumbnail',
        'Bitte füge einen Link zu einem Bild der Übung hinzu'
      );
      return;
    }
    if (this.exercise.affectedMuscles.length === 0) {
      this.notifiy(
        'Betroffene Muskeln',
        'Bitte wähle mindestens einen betroffenen Muskel aus'
      );
      return;
    }
    if (this.selectedCategorie === 0) {
      if (
        Math.min(this.setsMin, this.setsMin, this.repsMax, this.repsMin) <= 0
      ) {
        this.notifiy(
          'Sätze / Wiederholungen',
          'Die Angaben müssen größer als 0 sein'
        );
        return;
      }
      if (this.setsMax < this.setsMin || this.repsMax < this.repsMin) {
        this.notifiy(
          'Sätze / Wiederholungen',
          'Die mindest Anzahl darf nicht größer sein, als die maximale Anzahl'
        );
        return;
      }
    }
    if (this.selectedCategorie === 1) {
      if (this.selectedTime.length === 0) {
        this.notifiy('Zeiteinheit', 'Bitte wähle eine Zeiteinheit aus');
        return;
      }
      if ((this.exercise.time || 0) <= 0) {
        this.notifiy(
          'Dauer',
          'Die Dauer der Übung muss mindestens eine Zeiteinheit beanspruchen'
        );
        return;
      }
    }
    if (
      this.selectedCategorie === 2 &&
      (this.exercise.distance || '').length === 0
    ) {
      this.notifiy('Strecke', 'Bitte fülle dieses Feld aus');
      return;
    }

    const createObject: CreateExerciseDTO = {
      title: this.exercise.title,
      affectedMuscles: this.exercise.affectedMuscles,
      thumbnail: this.exercise.thumbnail,
      difficulty: +this.exercise.difficulty,
      warnings: this.exercise.warnings,
      steps: this.exercise.steps
    };
    if ((this.exercise.explanatoryVideo || '').length > 0) {
      createObject.explanatoryVideo = this.exercise.explanatoryVideo;
    }
    if (this.selectedCategorie === 0) {
      createObject.sets = this.setsMin + ' - ' + this.setsMax;
      createObject.reps = this.repsMin + ' - ' + this.repsMax;
    } else if (this.selectedCategorie === 1) {
      createObject.time =
        (this.exercise.time || 1) *
        (this.selectedTime === 'Minuten'
          ? aMinute / 1000
          : this.selectedTime === 'Stunden'
          ? aHour / 1000
          : 1);
    } else if (this.selectedCategorie === 2) {
      createObject.distance = this.exercise.distance;
    }
    await axios.post('exercise', createObject);
    this.$router.push({ name: 'exercises' });
  }

  public notifiy(missing: string, info: string) {
    sendNotification({
      title: 'Fehlende Angabe: ' + missing,
      text: info
    });
  }

  public async submitChanges(): Promise<void> {
    await axios.post(
      'exercise/publish/' + this.exerciseEdit._id,
      this.exercise
    );
    this.$emit('closeModal');
  }

  public async rejectPublish(): Promise<void> {
    await axios.delete('exercise/delete/' + this.exerciseEdit._id);
    this.$emit('closeModal');
  }
}
</script>

<style lang="scss" scoped>
.title {
  font-weight: 700;
  white-space: nowrap;
  margin: 10px 0;
  margin-left: 8px;
}
.gym-min-max {
  display: grid;
  grid-template-columns: minmax(1px, 1fr) 30px minmax(1px, 1fr);
  .mid {
    font-weight: bold;
    display: grid;
    place-content: center;
  }
  .tc-select.tc-select__hasHead {
    margin-top: 3px;
  }
}
/deep/ textarea {
  min-height: 50px !important;
}
.indicator {
  &[diff='1'] {
    color: $success;
  }
  &[diff='2'] {
    color: $alarm;
  }
  &[diff='3'] {
    color: $error;
  }
  i {
    margin-left: 5px;
  }
}
h2 {
  margin-top: 0;
}
.submit {
  display: grid;
  margin: 20px 0;
}
.modalButton {
  display: grid;
  margin-top: 20px;
}
</style>
