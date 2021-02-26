<template>
  <div class="view-submit-exercise" content>
    <FHExerciseForm @close="close" />
  </div>
</template>

<script lang="ts">
import FHExerciseForm from '@/components/forms/FHExerciseForm.vue';
import { Vue, Component } from 'vue-property-decorator';

@Component({
  components: { FHExerciseForm }
})
export default class SubmitExercise extends Vue {
  public close() {
    this.$router.push({ name: 'exercises' });
  }
}
</script>

<style lang="scss" scoped>
.view-submit-exercise {
  padding-top: 0;
}
</style>
