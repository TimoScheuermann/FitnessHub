<template>
  <div class="fh-search-results">
    <FHSearchBar :disabled="searching" v-model="query" @submit="this.search" />
    <div content>
      <div max-width>
        <FHAppear>
          <tl-flow flow="column" v-if="!results">
            <br />
            <tc-spinner size="20" :dark="$store.getters.darkmode" />
            <p>Deine Suche wird ausgeführt</p>
          </tl-flow>
          <tl-flow flow="column" v-else-if="results.length === 0">
            <br />
            <i error huge class="ti-exclamation-triangle" />
            <p>Die Suche war leider erfolglos</p>
          </tl-flow>
          <div v-else>
            <FHHeading :subtitle="subtitle" :title="searchFor" />
            <tl-grid arrangement="auto-fill" minWidth="200">
              <template v-if="type && type === 'exercise'">
                <FHExercisePreview
                  v-for="r in results"
                  :key="r._id"
                  :exercise="r"
                />
              </template>
              <template v-if="type && type === 'recipe'">
                <FHRecipePreview
                  v-for="r in results"
                  :key="r._id"
                  :recipe="r"
                />
              </template>
            </tl-grid>
          </div>
        </FHAppear>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import FHAppear from '@/components/FHAppear.vue';
import FHHeading from '@/components/FHHeading.vue';
import FHSearchBar from '@/components/FHSearchBar.vue';
import FHExercisePreview from '@/components/training/FHExercisePreview.vue';
import backend from '@/utils/backend';
import { openFullscreen } from '@/utils/functions';
import { IExercise, IRecipe } from '@/utils/interfaces';
import { Vue, Component } from 'vue-property-decorator';
import FHRecipePreview from './nutrition/FHRecipePreview.vue';

@Component({
  components: {
    FHAppear,
    FHHeading,
    FHSearchBar,
    FHExercisePreview,
    FHRecipePreview
  }
})
export default class FHSearchResults extends Vue {
  public query = (this.$route.query.q || '') as string;
  public results: (IExercise | IRecipe)[] | null = null;
  public searching = false;
  public searchFor = '';

  mounted() {
    if (!this.type) {
      this.$router.back();
    } else if (this.query.length < 2) {
      openFullscreen('search-' + this.type);
    } else {
      this.search(this.query);
    }
  }

  get type(): string | null {
    const route = (this.$route.name || '').split('-');
    if (route.length < 3) return null;
    if (route[1] !== 'search' || route[2] !== 'results') return null;
    return route[0];
  }

  get subtitle(): string {
    if (!this.results) return '';
    const { length } = this.results;
    return length + ` Ergebniss${length === 1 ? '' : 'e'} für`;
  }

  public async search(query: string): Promise<void> {
    if (query.length < 2) return;
    if (this.searching) return;
    if (this.query.toLowerCase() === this.searchFor.toLowerCase()) return;

    this.searching = true;
    this.results = null;
    this.searchFor = query;

    const routeName = this.$route.name || undefined;
    const routeQuery = this.$route.query.q as string;
    if (routeQuery !== query) {
      this.$router.push({
        name: routeName,
        query: { q: query }
      });
    }

    const { data } = await backend.get(this.type + '/find/' + encodeURI(query));
    this.results = data;
    this.searching = false;
  }
}
</script>
