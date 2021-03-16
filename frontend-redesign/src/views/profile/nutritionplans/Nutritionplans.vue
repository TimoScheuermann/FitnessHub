<template>
  <div class="view-nutritionplans" content>
    <div max-width>
      <tl-flow horizontal="space-between">
        <h3>Erstellte Pläne</h3>
        <tc-link routeName="submit-nutritionplan" tfcolor="success">
          Plan erstellen
        </tc-link>
      </tl-flow>

      <FHAppear>
        <tl-flow flow="column" v-if="!plans">
          <br />
          <tc-spinner :dark="$store.getters.darkmode" size="20" />
          <p>Pläne werde geladen...</p>
        </tl-flow>
      </FHAppear>
      <FHAppear v-if="plans && plans.length === 0">
        <p>Es wurde noch kein Ernährungsplan erstellt.</p>
      </FHAppear>
      <FHAppear>
        <tl-grid
          v-if="plans && plans.length > 0"
          arrangement="auto-fill"
          minWidth="200"
        >
          <FHNutritionplanPreview v-for="p in plans" :key="p._id" :plan="p" />
        </tl-grid>
      </FHAppear>
    </div>
  </div>
</template>

<script lang="ts">
import FHAppear from '@/components/FHAppear.vue';
import FHNutritionplanPreview from '@/components/nutrition/FHNutritionplanPreview.vue';
import backend from '@/utils/backend';
import { INutritionplan } from '@/utils/interfaces';
import { Vue, Component } from 'vue-property-decorator';

@Component({
  components: {
    FHAppear,
    FHNutritionplanPreview
  }
})
export default class Nutritionplans extends Vue {
  async mounted() {
    if (!this.plans) {
      const { data } = await backend.get('nutritionplan');
      this.$store.commit('nutritionplans', data);
    }
  }

  get plans(): INutritionplan[] | null {
    return this.$store.getters.nutritionplans;
  }
}
</script>

<style lang="scss" scoped>
.view-nutritionplans {
  padding-top: 0;
}
</style>
