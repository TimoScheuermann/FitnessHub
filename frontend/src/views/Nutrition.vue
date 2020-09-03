<template>
  <div class="nutrition">
    <fh-mobile-header title="Ernährung" />
    <tc-hero
      :dark="true"
      :hasFixedHeader="$store.getters.fixedHeader"
      :height="200"
    >
      <img
        src="https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?q=25"
        slot="background"
        alt=""
      />
      <h1>Ernährung</h1>
    </tc-hero>

    <div content>
      <h1>Title</h1>
      <tc-input
        :dark="$store.getters.darkmode"
        v-model="data.title"
        title="Rezept Name"
      />
      <tc-input
        :dark="$store.getters.darkmode"
        v-model="data.time"
        title="Dauer"
      />
      <tc-input
        :dark="$store.getters.darkmode"
        v-model="data.thumbnail"
        title="Bild-URL"
      />
      <tc-input
        :dark="$store.getters.darkmode"
        v-model="data.video"
        title="Video-URL"
      />
      <tc-select
        :dark="$store.getters.darkmode"
        v-model="data.category"
        :title="'Kategorie'"
        :values="['Low Carb', 'High Protein']"
      />
      <tc-button
        name="Neues Rezept hinzufügen"
        variant="filled"
        @click="addRecipe"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import axios from '@/utils/axios';
import { CreateRecipeDTO } from '@/utils/dtos';

@Component
export default class Nutrition extends Vue {
  public data: CreateRecipeDTO = {
    title: '',
    time: 0,
    video: '',
    thumbnail: '',
    ingredients: [],
    nutrition: [],
    category: ''
  };
  public async addRecipe() {
    await axios.post('recipe', this.data);
  }
}
</script>

<style lang="scss" scoped>
.tc-hero img {
  filter: brightness(80%);
}
</style>
