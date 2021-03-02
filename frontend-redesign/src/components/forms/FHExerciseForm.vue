<template>
  <div class="view-exercise-form" content>
    <FHErrorList :id="errorList" />
    <div max-width>
      <h3 v-if="mode === 'create'">Übung einreichen</h3>
      <h3 v-if="mode === 'update'">Übung bearbeiten</h3>
      <h3 v-if="mode === 'change'">Änderungen überprüfen</h3>
      <h3 v-if="mode === 'publish'">Übung veröffentlichen</h3>

      <tc-segments :dark="$store.getters.darkmode" v-model="segment">
        <tc-segment-item title="Infos" />
        <tc-segment-item title="Typ" />
        <tc-segment-item title="Optional" />
      </tc-segments>

      <div class="spacer" />

      <FHAppear>
        <div v-if="segment == 0">
          <tc-input
            title="Name der Übung"
            v-model="dto.title"
            :dark="$store.getters.darkmode"
          />
          <tc-input
            title="Vorschaubild"
            v-model="dto.thumbnail"
            :dark="$store.getters.darkmode"
          />
          <div class="title">Aktive/r Muskel/n</div>
          <tc-select
            :dark="$store.getters.darkmode"
            tfbackground="success"
            @selectedItems="m => (dto.affectedMuscles = m)"
            :multiple="true"
            placeholder="Wähle einen oder mehrere Muskel"
          >
            <tc-select-item
              v-for="m in muscles"
              :key="m"
              :defaultSelected="dto.affectedMuscles.includes(m)"
              :title="m"
            />
          </tc-select>
          <div class="title" sub>Schwierigkeit</div>
          <tc-slider
            :min="1"
            :max="3"
            tfcolor="success"
            iconStart="dot"
            iconEnd="circle"
            v-model="dto.difficulty"
          />
        </div>
      </FHAppear>

      <FHAppear>
        <div v-if="segment == 1">
          <div sub style="font-style: italic; opacity: .5">
            Hier reicht es, wenn in einer Sektion die jeweiligen Angaben
            ausgefüllt werden
          </div>

          <tc-divider :dark="$store.getters.darkmode" name="Gym-Übung" />
          <div class="title" sub>Sätze | min - max</div>
          <tl-grid gap="0" minWidth="30">
            <tc-input
              type="number"
              min="1"
              step="1"
              v-model="dto.sets.min"
              :dark="$store.getters.darkmode"
            />
            <tc-input
              type="number"
              :min="dto.sets.max"
              step="1"
              v-model="dto.sets.max"
              :dark="$store.getters.darkmode"
            />
          </tl-grid>

          <div class="title" sub>Wiederholungen | min - max</div>
          <tl-grid gap="0" minWidth="30" sub>
            <tc-input
              type="number"
              min="1"
              step="1"
              v-model="dto.reps.min"
              :dark="$store.getters.darkmode"
            />
            <tc-input
              type="number"
              :min="dto.reps.max"
              step="1"
              v-model="dto.reps.max"
              :dark="$store.getters.darkmode"
            />
          </tl-grid>

          <tc-divider :dark="$store.getters.darkmode" name="Zeit-Übung" />
          <div class="title" sub>Empfohlene Dauer</div>
          <div sub>
            <tc-input
              type="number"
              :dark="$store.getters.darkmode"
              v-model="dto.time"
              min="0"
              step="1"
            />
          </div>

          <tc-divider :dark="$store.getters.darkmode" name="Distanz-Übung" />
          <div class="title" sub>Empfohlene Strecke</div>
          <tc-input
            :dark="$store.getters.darkmode"
            placeholder="z.B.: 5 km"
            v-model="dto.time"
          />
        </div>
      </FHAppear>

      <FHAppear>
        <div v-if="segment == 2">
          <tc-input
            title="Videoanleitung"
            v-model="dto.explanatoryVideo"
            :dark="$store.getters.darkmode"
          />

          <div class="title" sub>Zuhause ausführbar</div>
          <tc-checkbox
            :dark="$store.getters.darkmode"
            v-model="dto.possibleAtHome"
            title="Homeworkout geeignet"
            tfbackground="success"
          />

          <div class="title">Ausführungsschritte</div>
          <tc-table :dark="$store.getters.darkmode">
            <tc-tr v-for="(s, i) in dto.steps" :key="'s-' + i">
              <tc-td>{{ s }}</tc-td>
              <tc-td>
                <tc-link tfcolor="error" @click="removeStep(i)">
                  entfernen
                </tc-link>
              </tc-td>
            </tc-tr>
          </tc-table>
          <div class="fh-graph-card">
            <div class="title" small>Weiterer Schritt</div>
            <tc-textarea v-model="step" :dark="$store.getters.darkmode" />
            <tl-flow>
              <tc-link tfcolor="success" @click="addStep">
                Schritt hinzufügen
              </tc-link>
            </tl-flow>
          </div>

          <div class="title">Hinweise & Warnungen</div>
          <tc-table :dark="$store.getters.darkmode">
            <tc-tr v-for="(w, i) in dto.warnings" :key="'w-' + i">
              <tc-td>{{ w }}</tc-td>
              <tc-td>
                <tc-link tfcolor="error" @click="removeWarning(i)">
                  entfernen
                </tc-link>
              </tc-td>
            </tc-tr>
          </tc-table>
          <div class="fh-graph-card">
            <div class="title" small>Weiterer Hinweis</div>
            <tc-textarea v-model="warning" :dark="$store.getters.darkmode" />
            <tl-flow>
              <tc-link tfcolor="success" @click="addWarning">
                Hinweis hinzufügen
              </tc-link>
            </tl-flow>
          </div>
        </div>
      </FHAppear>

      <br />
      <tl-flow>
        <template v-if="mode === 'create'">
          <tc-button
            name="Übung einreichen"
            tfbackground="success"
            :disabled="isSubmitting"
            @click="createExercise"
          />
        </template>
        <template v-else-if="mode === 'update'">
          <tc-button
            name="Überarbeitung einreichen"
            tfbackground="success"
            :disabled="isSubmitting"
            @click="updateExercise"
          />
        </template>
        <template v-else-if="mode === 'publish'">
          <tc-button
            name="Antrag löschen"
            tfbackground="error"
            :disabled="isSubmitting"
            @click="denySubmission"
          />
          <tc-button
            name="Übung veröffentlichen"
            tfbackground="success"
            :disabled="isSubmitting"
            @click="acceptExercise"
          />
        </template>

        <template v-else-if="mode === 'change'">
          <tc-button
            name="Änderungen ablehnen"
            tfbackground="alarm"
            :disabled="isSubmitting"
            @click="rejectChanges"
          />
          <tc-button
            name="Änderungen akzeptieren"
            tfbackground="success"
            :disabled="isSubmitting"
            @click="acceptExercise"
          />
        </template>
      </tl-flow>
    </div>
  </div>
</template>

<script lang="ts">
import FHAppear from '@/components/FHAppear.vue';
import FHErrorList from '@/components/FHErrorList.vue';
import backend from '@/utils/backend';
import { CreateExerciseDTO } from '@/utils/dtos';
import { FHEventBus } from '@/utils/FHEventbus';
import { IExercise } from '@/utils/interfaces';
import { NotificationManagement } from '@/utils/NotificationManagement';
import { VariableManagement } from '@/utils/VariableManagement';
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component({
  components: {
    FHAppear,
    FHErrorList
  }
})
export default class FHExeciseForm extends Vue {
  @Prop() exercise!: IExercise;

  public segment = -1;
  public isSubmitting = false;
  public step = '';
  public warning = '';
  public mode: 'update' | 'create' | 'change' | 'publish' = 'create';
  public errorList = 'exercise-form';

  public dto: CreateExerciseDTO = {
    title: '',
    affectedMuscles: [],
    thumbnail: '',
    difficulty: 1,
    warnings: [],
    steps: []
  };

  beforeMount() {
    if (!this.muscles) {
      this.$emit('close');
      NotificationManagement.sendNotification(
        'Aktion zurzeit nicht möglich',
        'Bitte versuche es zu einem späteren Zeitpunkt'
      );
    }
  }

  mounted() {
    this.setGym();

    if (this.exercise) {
      const ex = this.exercise;
      const edited = ex.reviewed ? ex.editedData : null;

      this.dto.title = (edited || ex).title;
      this.dto.affectedMuscles = (edited || ex).affectedMuscles;
      this.dto.thumbnail = (edited || ex).thumbnail;
      this.dto.difficulty = (edited || ex).difficulty;
      this.dto.warnings = (edited || ex).warnings || [];
      this.dto.steps = (edited || ex).steps || [];
      this.dto.explanatoryVideo = (edited || ex).explanatoryVideo;
      this.dto.possibleAtHome = (edited || ex).possibleAtHome;
      this.dto.time = (edited || ex).time;
      this.dto.distance = (edited || ex).distance;
      this.dto.sets = edited ? edited.sets : this.mapMinMaxString(ex.sets);
      this.dto.reps = edited ? edited.reps : this.mapMinMaxString(ex.reps);
    }

    if (!this.exercise) {
      this.mode = 'create';
    } else if (this.$route.name === 'update-exercise') {
      this.mode = 'update';
    } else if (this.$route.name === 'exercise-submission') {
      this.mode = this.exercise.reviewed ? 'change' : 'publish';
    }

    this.segment = 0;
  }

  get muscles(): string[] | null {
    return VariableManagement.getMuscleNames();
  }

  public addStep(): void {
    if (this.step.length < 10) return;
    this.dto.steps.push(this.step);
    this.step = '';
  }

  public removeStep(index: number): void {
    this.dto.steps.splice(index, 1);
  }

  public addWarning(): void {
    if (this.warning.length < 10) return;
    this.dto.warnings.push(this.warning);
    this.warning = '';
  }

  public removeWarning(index: number): void {
    this.dto.warnings.splice(index, 1);
  }

  public setGym(): void {
    (this.dto.reps = { min: 1, max: 12 }), (this.dto.sets = { min: 1, max: 4 });
  }

  public mapMinMaxString(s?: string): { min: number; max: number } {
    if (!s) return { min: 1, max: 4 };
    if (s.includes('-')) {
      const split = s.split(' - ');
      return { min: +split[0], max: +split[1] };
    }
    return { min: +s, max: +s };
  }

  public cleanDTO(): void {
    const { distance, time } = this.dto;
    if (distance && distance.length === 0) {
      delete this.dto.distance;
    }
    if (time && time <= 0) {
      delete this.dto.time;
    }
    if ((distance && distance.length > 0) || (time && time > 0)) {
      delete this.dto.sets;
      delete this.dto.reps;
    }
    this.dto.difficulty = +this.dto.difficulty;
  }

  public async createExercise(): Promise<void> {
    if (this.isSubmitting) return;
    this.isSubmitting = true;
    this.cleanDTO();

    backend
      .post('exercise', this.dto)
      .then(this.handleResponse)
      .catch(this.handleCatch);
  }

  public async updateExercise() {
    if (this.isSubmitting) return;
    this.isSubmitting = true;
    this.cleanDTO();

    backend
      .put('exercise/update/' + this.exercise._id, this.dto)
      .then(this.handleResponse)
      .catch(this.handleCatch);
  }

  public async acceptExercise() {
    if (this.isSubmitting) return;
    this.isSubmitting = true;
    this.cleanDTO();

    backend
      .put('exercise/publish/' + this.exercise._id, this.dto)
      .then(this.handleResponse)
      .catch(this.handleCatch);
  }

  public async rejectChanges() {
    if (this.isSubmitting) return;
    this.isSubmitting = true;
    this.cleanDTO();

    backend
      .put('exercise/rejectChanges/' + this.exercise._id)
      .then(this.handleResponse)
      .catch(this.handleCatch);
  }

  public async denySubmission() {
    if (this.isSubmitting) return;
    this.isSubmitting = true;
    this.cleanDTO();

    backend
      .delete('exercise/' + this.exercise._id)
      .then(this.handleResponse)
      .catch(this.handleCatch);
  }

  private handleResponse(): void {
    this.$emit('close');
  }

  private handleCatch(err: { statusCode: number; message: string }): void {
    const { statusCode, message } = err;
    if (statusCode && statusCode === 422 && message) {
      FHEventBus.$emit('fh-error-list-' + this.errorList, message);
    }
    this.setGym();
    this.isSubmitting = false;
  }
}
</script>

<style lang="scss" scoped>
.view-exercise-form {
  padding-top: 0;

  [sub] {
    margin-bottom: 15px;
  }

  .title {
    font-weight: 700;
    white-space: nowrap;
    margin: 10px 0 2px;
    margin-left: 8px;
    &[small] {
      text-align: center;
      font-size: 14px;
      margin: 0px;
      margin-bottom: 10px;
    }
  }
  .spacer {
    height: 5px;
  }

  .fh-graph-card {
    margin-top: 10px;
    .tl-flow {
      margin-top: 10px;
    }
  }

  .tc-table-2 {
    margin-top: 5px;
    /deep/ .tc-td {
      height: 30px;
    }
  }
}
</style>
