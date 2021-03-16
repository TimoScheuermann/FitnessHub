<template>
  <FHPreview
    v-if="plan"
    class="fh-nutritionplan-preview"
    :title="plan.title"
    @click="handleClick"
  >
  </FHPreview>
</template>

<script lang="ts">
import { INutritionplan } from '@/utils/interfaces';
import { Vue, Component, Prop } from 'vue-property-decorator';
import FHPreview from '../FHPreview.vue';

@Component({
  components: {
    FHPreview
  }
})
export default class FHNutritionplanPreview extends Vue {
  @Prop() plan!: INutritionplan;
}
</script>

<style lang="scss" scoped></style>
