<template>
  <div class="view-submit-nutritionplan" content>
    <div max-width>
      <h3>Ernährungsplan erstellen</h3>
      <FHNutritionplanForm />
    </div>
  </div>
</template>

<script lang="ts">
import FHNutritionplanForm from '@/components/forms/FHNutritionplanForm.vue';
import { Vue, Component } from 'vue-property-decorator';

@Component({
  components: {
    FHNutritionplanForm
  }
})
export default class SubmitNutritionplan extends Vue {}
</script>

<style lang="scss" scoped>
.view-submit-nutritionplan {
  padding-top: 0;
}
</style>
