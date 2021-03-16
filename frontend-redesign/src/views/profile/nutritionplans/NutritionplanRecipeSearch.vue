<template>
  <div class="view-nutritionplan-recipe-search">
    <div content max-width>
      <FHHeader title="Rezept suchen">
        <FHFullScreenCloser @click="close" />
      </FHHeader>
      <br />
      <h1 center>Rezept suchen</h1>
      <form @submit.prevent="submit">
        <tc-input
          pattern=".{2,}"
          v-model="query"
          icon="lens"
          :frosted="true"
          :dark="true"
          placeholder="Suchbegriff eingeben"
        />
      </form>

      <FHList v-if="results">
        <FHListItem
          v-for="r in results"
          :key="r._id"
          :avatar="r.thumbnail"
          :title="r.title"
        >
          <tc-button
            name="wählen"
            tfbackground="success"
            @click="setRecipe(r)"
          />
        </FHListItem>
      </FHList>
    </div>
  </div>
</template>

<script lang="ts">
import FHFullScreenCloser from '@/components/FHFullScreenCloser.vue';
import FHHeader from '@/components/FHHeader.vue';
import FHList from '@/components/list/FHList.vue';
import FHListItem from '@/components/list/FHListItem.vue';
import backend from '@/utils/backend';
import { closeFullscreen } from '@/utils/functions';
import { IRecipe } from '@/utils/interfaces';
import { Vue, Component } from 'vue-property-decorator';

@Component({
  components: {
    FHHeader,
    FHFullScreenCloser,
    FHList,
    FHListItem
  }
})
export default class NutritionplanRecipeSearch extends Vue {
  public query = '';
  public results: IRecipe[] = [];

  mounted() {
    if (!this.canSet) {
      this.close();
    }
  }

  public async submit() {
    if (this.query.length < 2) return;
    const { data } = await backend.get('recipe/find/' + encodeURI(this.query));
    this.results = data;
  }

  public setRecipe(recipe: IRecipe) {
    const day = this.day;
    const daytime = this.daytime;
    const plan = this.plan;
    if (!day || !daytime || !plan) {
      this.close();
      return;
    }

    if (daytime === 'snacks') {
      plan[day][daytime].push(recipe);
    } else {
      plan[day][daytime] = recipe;
    }
    this.$store.commit('nutritionplanForm', plan);
    this.close();
  }

  get day(): string | null {
    return this.$route.params.day || null;
  }
  get daytime(): string | null {
    return this.$route.params.daytime || null;
  }

  // eslint-disable-next-line
  get plan(): any | null {
    return this.$store.getters.nutritionplanForm || null;
  }

  get canSet(): boolean {
    return this.day && this.daytime && this.plan;
  }

  public close() {
    closeFullscreen('nutritionplans', { day: this.day });
  }
}
</script>

<style lang="scss" scoped>
.view-nutritionplan-recipe-search {
  min-height: 100vh;
  color: #fff;

  background: linear-gradient(rgba($color, 0.6), rgba($success, 0.08)),
    url('/assets/recipe-search-bg.webp');
  background-size: cover;
  background-position: center center;

  [content] {
    padding-bottom: 20px;
  }

  form {
    margin: 20px auto;
    max-width: 400px;
    .tc-input {
      padding: 10px 20px;
    }
  }

  .fh-list-item {
    background: rgba($color, 0.8);
    color: #fff;
    .tc-button {
      border-radius: 50px;
      margin-right: -5px;
    }
    /deep/ .title {
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      text-overflow: ellipsis;
      white-space: pre-wrap;
    }
  }
}
</style>
