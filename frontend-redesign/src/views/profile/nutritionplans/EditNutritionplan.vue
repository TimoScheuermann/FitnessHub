<template>
  <div class="view-edit-nutritionplan" content>
    <div max-width>
      <h3>Ernährungsplan bearbeiten</h3>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class EditNutritionplan extends Vue {}
</script>

<style lang="scss" scoped>
.view-edit-nutritionplan {
  padding-top: 0;
}
</style>
