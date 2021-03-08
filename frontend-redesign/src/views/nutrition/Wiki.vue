<template>
  <div class="view-nutrition-wiki" content>
    <div max-width>
      <FHAppear v-for="c in categories" :key="c">
        <div>
          <FHHeading :title="c" />
          <FHCarousel>
            <FHWikiPreview
              v-for="i in getItemsByCategory(c)"
              :key="i.title"
              :thumbnail="i.thumbnail"
              :title="i.title"
            />
          </FHCarousel>
        </div>
      </FHAppear>
    </div>
  </div>
</template>

<script lang="ts">
import FHAppear from '@/components/FHAppear.vue';
import FHCarousel from '@/components/FHCarousel.vue';
import FHHeading from '@/components/FHHeading.vue';
import FHWikiPreview from '@/components/nutrition/FHWikiPreview.vue';
import { INutritionWikiItem } from '@/utils/interfaces';
import { NutritionWikiManagement } from '@/utils/NutritionWikiManagement';
import { Vue, Component } from 'vue-property-decorator';

@Component({
  components: {
    FHHeading,
    FHCarousel,
    FHWikiPreview,
    FHAppear
  }
})
export default class NutritionWiki extends Vue {
  get categories(): string[] {
    return NutritionWikiManagement.getCategories();
  }

  public getItemsByCategory(category: string): INutritionWikiItem[] {
    return NutritionWikiManagement.getByCategory(category);
  }
}
</script>

<style lang="scss" scoped>
.view-nutrition-wiki {
  //
}
</style>
