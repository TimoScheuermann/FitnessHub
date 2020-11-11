<template>
  <div class="exercise-form">
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
        <div>
          <div class="title">Betroffene Muskeln</div>
          <tc-select
            tfbackground="success"
            @selectedItems="m => (exercise.affectedMuscles = m)"
            :multiple="true"
            placeholder="Wähle mind. einen Muskel"
            :dark="$store.getters.darkmode"
          >
            <tc-select-item
              v-for="m in muscles"
              :defaultSelected="exercise.affectedMuscles.includes(m)"
              :key="m"
              :title="m"
            />
          </tc-select>
        </div>
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
              v-model="sets.min"
              :dark="$store.getters.darkmode"
            />
            <div class="mid">-</div>
            <tc-input
              type="number"
              v-model="sets.max"
              :dark="$store.getters.darkmode"
            />
          </div>
          <div class="title">Wiederholungen</div>
          <div class="gym-min-max">
            <tc-input
              type="number"
              v-model="reps.min"
              :dark="$store.getters.darkmode"
            />
            <div class="mid">-</div>
            <tc-input
              type="number"
              v-model="reps.max"
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
              tfbackground="success"
              @selectedItems="s => (timeUnit = s[0])"
              :dark="$store.getters.darkmode"
            >
              <tc-select-item v-for="u in timeUnits" :key="u" :title="u" />
            </tc-select>
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
          v-model="stepInput"
        />
        <tc-button
          :disabled="$store.getters.loading"
          tfbackground="success"
          name="Hinzufügen"
          @click="addStep"
        />

        <div class="title" v-if="exercise.steps.length > 0">Schritte</div>
        <tc-table :dark="$store.getters.darkmode">
          <tc-tr v-for="(s, i) in exercise.steps" :key="s">
            <tc-td>{{ i + 1 }}</tc-td>
            <tc-td>{{ s }}</tc-td>
            <tc-td>
              <tc-link tfcolor="error" @click="removeStep(s)">
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
          v-model="warningInput"
        />
        <tc-button
          :disabled="$store.getters.loading"
          tfbackground="success"
          name="Hinzufügen"
          @click="addWarning"
        />

        <div class="title" v-if="exercise.warnings.length > 0">Hinweise</div>
        <tc-table :dark="$store.getters.darkmode">
          <tc-tr v-for="(s, i) in exercise.warnings" :key="s">
            <tc-td>{{ i + 1 }}</tc-td>
            <tc-td>{{ s }}</tc-td>
            <tc-td>
              <tc-link tfcolor="error" @click="removeWarning(s)">
                entfernen
              </tc-link>
            </tc-td>
          </tc-tr>
        </tc-table>
      </div>

      <div>
        <h2>Kann zuhause ausgeführt werden?</h2>
        <tc-checkbox
          title="Für Home-Training geeignet"
          :dark="$store.getters.darkmode"
          tfbackground="success"
          v-model="exercise.possibleAtHome"
        />
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

    <tl-grid class="buttons" gap="0px 20">
      <tc-button
        :disabled="$store.getters.loading"
        v-if="mode === 'new'"
        variant="filled"
        tfbackground="success"
        name="Übung einreichen"
        icon="share"
        @click="submitForm"
      />
      <tc-button
        :disabled="$store.getters.loading"
        v-else-if="mode === 'edit'"
        variant="filled"
        tfbackground="success"
        name="Änderungen einreichen"
        icon="pencil"
        @click="submitChange"
      />
      <template v-else-if="mode === 'publish'">
        <tc-button
          :disabled="$store.getters.loading"
          variant="filled"
          tfbackground="success"
          name="Übung veröffentlichen"
          icon="globe"
          @click="publishExercise"
        />
        <tc-button
          :disabled="$store.getters.loading"
          variant="filled"
          tfbackground="error"
          name="Übung löschen"
          icon="trashcan-alt"
          @click="deleteExercise"
        />
      </template>

      <template v-else-if="mode === 'publishEdit'">
        <tc-button
          :disabled="$store.getters.loading"
          variant="filled"
          tfbackground="success"
          name="Änderungen übernehmen"
          icon="checkmark"
          @click="publishExercise"
        />
        <tc-button
          :disabled="$store.getters.loading"
          variant="filled"
          tfbackground="error"
          name="Änderungen verwerfen"
          icon="trashcan-alt"
          @click="rejectChanges"
        />
      </template>
    </tl-grid>
  </div>
</template>

<script lang="ts">
import { IExercise } from '@/utils/interfaces';
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { CreateExerciseDTO } from '@/utils/dtos';
import { defaultExercise, validate } from '@/utils/exerciseFormValidator';
import axios from '@/utils/axios';
import { getMuscleNames } from '@/utils/functions';

interface MinMax {
  min: number;
  max: number;
}

@Component
export default class FHExerciseForm extends Vue {
  @Prop({ default: 'new' }) mode!: 'new' | 'edit' | 'publish' | 'publishEdit';
  @Prop() exerciseInput!: IExercise;

  public reps: MinMax = { min: 8, max: 12 };
  public sets: MinMax = { min: 4, max: 5 };
  public timeUnits = ['Sekunden', 'Minute(n)', 'Stunde(n)'];
  public timeUnit: string | null = null;
  public muscles: string[] = getMuscleNames();
  public categories: string[] = ['Gym', 'Zeit', 'Strecke'];
  public selectedCategorie = 0;
  public warningInput = '';
  public stepInput = '';

  public exercise: CreateExerciseDTO = defaultExercise;

  @Watch('exerciseInput')
  mounted() {
    // load existing exercise
    if (this.exerciseInput) {
      this.exercise = {
        possibleAtHome: false,
        ...this.exerciseInput,
        ...this.exerciseInput.editedData
      };
      // delete unnecessary data
      delete this.exercise._id;
      delete this.exercise.author;
      delete this.exercise.reviewed;
      delete this.exercise.reviewedBy;
      delete this.exercise.created;
      delete this.exercise.updated;
      delete this.exercise.editedData;
      this.timeUnit = 'Sekunden';

      // set reps
      if (this.exercise.reps) {
        const reps = this.exercise.reps.split(' - ');
        this.reps = { min: +reps[0], max: +reps[1] };
        this.selectedCategorie = 0;
      }

      // set sets
      if (this.exercise.sets) {
        const sets = this.exercise.sets.split(' - ');
        this.sets = { min: +sets[0], max: +sets[1] };
        this.selectedCategorie = 0;
      }
      // set time
      if (this.exercise.time) this.selectedCategorie = 1;
      // set distance
      if (this.exercise.distance) this.selectedCategorie = 2;
    }
  }

  public addWarning() {
    if (this.warningInput.length < 5) return;
    this.exercise.warnings.push(this.warningInput);
    this.warningInput = '';
  }

  public removeWarning(text: string) {
    this.exercise.warnings = this.exercise.warnings.filter(x => x !== text);
  }

  public addStep() {
    if (this.stepInput.length < 5) return;
    this.exercise.steps.push(this.stepInput);
    this.stepInput = '';
  }

  public removeStep(text: string) {
    this.exercise.steps = this.exercise.steps.filter(x => x !== text);
  }

  public validateInput(): CreateExerciseDTO | null {
    return validate(
      this.exercise,
      this.selectedCategorie,
      this.sets.min,
      this.sets.max,
      this.reps.min,
      this.reps.max,
      this.timeUnit
    );
  }

  // Auf den Anwender selbst bezogen
  public async submitForm(): Promise<void> {
    const created = this.validateInput();
    if (created) {
      await axios.post('exercise', created);
      this.$router.push({ name: 'exercises' });
    }
  }

  public async submitChange(): Promise<void> {
    const created = this.validateInput();
    if (this.exerciseInput && created) {
      await axios.put('exercise/update/' + this.exerciseInput._id, created);
    }
    this.$router.push({ name: 'exercises' });
  }

  // Für den Managementbereich
  public async deleteExercise(): Promise<void> {
    if (this.exerciseInput) {
      await axios.delete('exercise/' + this.exerciseInput._id);
    }
    this.$emit('closeModal');
  }
  public async publishExercise(): Promise<void> {
    const created = this.validateInput();
    if (this.exerciseInput && created) {
      await axios.put('exercise/publish/' + this.exerciseInput._id, created);
      this.$emit('closeModal');
    }
  }

  public async rejectChanges(): Promise<void> {
    if (this.exerciseInput) {
      await axios.put('exercise/rejectChanges/' + this.exerciseInput._id);
    }
    this.$emit('closeModal');
  }
}
</script>
<style lang="scss" scoped>
.title {
  font-weight: 700;
  white-space: nowrap;
  margin: 10px 0 2px;
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
.buttons {
  margin-top: 20px;
  @media #{$isDesktop} {
    margin-bottom: 20px;
  }
}
</style>
