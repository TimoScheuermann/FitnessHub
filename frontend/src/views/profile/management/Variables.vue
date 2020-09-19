<template>
  <div class="variables" content>
    <h1>Muskeln</h1>
    <tc-revealer title="Muskel hinzufügen" :dark="$store.getters.darkmode">
      <tl-grid gap="0 10">
        <tc-input
          title="Titel"
          v-model="muscleInput.title"
          :dark="$store.getters.darkmode"
        />
        <tc-input
          title="Thumbnail"
          v-model="muscleInput.thumbnail"
          :dark="$store.getters.darkmode"
        />
        <tc-button
          name="Hinzufügen"
          tfbackground="success"
          variant="filled"
          @click="addMuscle"
        />
      </tl-grid>
    </tc-revealer>
    <div class="variable" v-for="v in muscles" :key="v._id">
      <div class="title">{{ v.title }}</div>
      <div class="button">
        <tc-button
          icon="cross"
          tfbackground="error"
          variant="filled"
          @click="removeMuscle(v._id)"
        />
      </div>
    </div>
    <h1>Kategorien</h1>
    <tc-revealer title="Kategorie hinzufügen" :dark="$store.getters.darkmode">
      <tl-grid gap="0 10">
        <tc-input
          title="Titel"
          v-model="categoryInput.title"
          :dark="$store.getters.darkmode"
        />
        <tc-input
          title="Thumbnail"
          v-model="categoryInput.thumbnail"
          :dark="$store.getters.darkmode"
        />
        <tc-button
          name="Hinzufügen"
          tfbackground="success"
          variant="filled"
          @click="addCategory"
        />
      </tl-grid>
    </tc-revealer>
    <div class="variable" v-for="v in categories" :key="v._id">
      <div class="title">{{ v.title }}</div>
      <div class="button">
        <tc-button
          icon="cross"
          tfbackground="error"
          variant="filled"
          @click="removeCategory(v._id)"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import axios from '@/utils/axios';
import { CreateVariableDTO } from '@/utils/dtos';
import { getCategories, getMuscles, sendNotification } from '@/utils/functions';
import { IVariable } from '@/utils/interfaces';
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class Variables extends Vue {
  public muscleInput: CreateVariableDTO = { title: '', thumbnail: '' };
  public categoryInput: CreateVariableDTO = { title: '', thumbnail: '' };

  get muscles(): IVariable[] {
    return getMuscles();
  }

  get categories(): IVariable[] {
    return getCategories();
  }

  public async addMuscle(): Promise<void> {
    if (
      this.muscleInput.title.length <= 0 ||
      this.muscleInput.thumbnail.length <= 0
    ) {
      sendNotification({
        title: 'Fehlerhafte Eingabe',
        text: 'Bitte fülle alle Felder aus'
      });
      return;
    }

    const { data } = await axios.post('variables/muscle', this.muscleInput);
    this.muscleInput = { title: '', thumbnail: '' };
    (data as IVariable[]).forEach(x => this.$store.commit('addVariable', x));
  }

  public async addCategory(): Promise<void> {
    if (
      this.categoryInput.title.length <= 0 ||
      this.categoryInput.thumbnail.length <= 0
    ) {
      sendNotification({
        title: 'Fehlerhafte Eingabe',
        text: 'Bitte fülle alle Felder aus'
      });
      return;
    }

    const { data } = await axios.post('variables/category', this.categoryInput);
    this.categoryInput = { title: '', thumbnail: '' };
    (data as IVariable[]).forEach(x => this.$store.commit('addVariable', x));
  }

  public async removeMuscle(id: string): Promise<void> {
    await axios.delete('variables/muscle/' + id);
    this.$store.commit('removeVariable', id);
  }

  public async removeCategory(id: string): Promise<void> {
    await axios.delete('variables/category/' + id);
    this.$store.commit('removeVariable', id);
  }
}
</script>

<style lang="scss" scoped>
.variables {
  .tc-revealer {
    margin-top: 0px;
  }
  .variable {
    display: inline-grid;
    grid-template-columns: 1fr 40px;
    grid-gap: 5px;
    margin: 3px;
    padding: 5px;
    background: $paragraph;
    @media (prefers-color-scheme: dark) {
      background: $paragraph_dark;
    }
    border-radius: $border-radius;
    .title,
    .button {
      display: flex;
      align-items: center;
    }

    .title {
      font-weight: 500;
      opacity: 0.75;
      margin-left: 10px;
    }
    .button {
      justify-content: flex-end;
    }
  }
}
</style>
