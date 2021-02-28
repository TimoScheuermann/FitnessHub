<template>
  <div class="view-search-results">
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
              <FHRecipePreview v-for="r in results" :key="r._id" :recipe="r" />
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
import FHRecipePreview from '@/components/nutrition/FHRecipePreview.vue';
import backend from '@/utils/backend';
import { openFullscreen } from '@/utils/functions';
import { IRecipe } from '@/utils/interfaces';
import { Vue, Component } from 'vue-property-decorator';

@Component({
  components: {
    FHAppear,
    FHHeading,
    FHSearchBar,
    FHRecipePreview
  }
})
export default class SearchResults extends Vue {
  public query = (this.$route.query.q || '') as string;
  public results: IRecipe[] | null = null;
  public searching = false;
  public searchFor = '';

  mounted() {
    if (this.query.length < 2) {
      openFullscreen('search-recipe');
    } else {
      this.search(this.query);
    }
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

    const { data } = await backend.get('recipe/find/' + encodeURI(query));
    this.results = data;
    this.searching = false;
  }
}
</script>

<style lang="scss" scoped>
.view-search-results {
  .tl-grid {
    .fh-recipe-preview {
      width: unset;
    }
  }
}
</style>
