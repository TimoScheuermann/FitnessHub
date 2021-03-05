<template>
  <div class="view-trainingplan" content>
    <div max-width>
      <FHTrainingplanDay v-for="(_x, i) in Array(7)" :key="i" :daynumber="i" />
    </div>
  </div>
</template>

<script lang="ts">
import FHCarousel from '@/components/FHCarousel.vue';
import FHTrainingplanDay from '@/components/training/FHTrainingplanDay.vue';
import { ITrainingplanFull } from '@/utils/interfaces';
import { UserManagement } from '@/utils/UserManagement';
import { Vue, Component } from 'vue-property-decorator';

@Component({
  components: {
    FHTrainingplanDay,
    FHCarousel
  }
})
export default class Trainingplan extends Vue {
  get plan(): ITrainingplanFull | null {
    return UserManagement.getTrainingplan();
  }
}
</script>

<style lang="scss" scoped>
.view-trainingplan {
  //
}
</style>
