<template>
  <div class="fh-exercise-informations">
    <fh-difficulty :difficulty="info.difficulty" />
    <div class="title">{{ info.title }}</div>
  </div>
</template>

<script lang="ts">
import FHDifficulty from '@/components/common/FH-Difficulty.vue';
import { IExerciseInfo } from '@/utils/interfaces';
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component({
  components: {
    'fh-difficulty': FHDifficulty
  }
})
export default class FHExerciseInformations extends Vue {
  @Prop() info!: IExerciseInfo;
}
</script>

<style lang="scss" scoped>
.fh-exercise-informations {
  position: absolute;
  top: 20px;
  left: 20px;
  right: 20px;
  bottom: 60px;
  position: flex;
  flex-direction: column;
  text-overflow: ellipsis;
  overflow-wrap: break-word;
  overflow: hidden;

  .title {
    margin: 5px 0;
    font-weight: 500;
    font-size: 1.3em;
    color: #fff;
  }
}
</style>
