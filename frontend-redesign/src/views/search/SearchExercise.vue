<template>
  <div class="view-SearchExercise">
    <div content max-width>
      <FHFullScreenCloser prev="training" />
      <br />
      <h1 center>Übung suchen</h1>
      <div class="image-wrapper">
        <transition name="fade">
          <FHBodyFront v-if="front" key="front" @muscle="muscleSelected" />
          <FHBodyBack v-if="!front" key="back" @muscle="muscleSelected" />
        </transition>
      </div>

      <br />
      <tl-flow>
        <tc-link @click="front = !front" tfcolor="success">
          <i class="ti-repeat" />
          <span style="margin-left: 5px">Körper drehen</span>
        </tc-link>
      </tl-flow>
    </div>
  </div>
</template>

<script lang="ts">
import FHBodyBack from '@/components/anatomy/FHBodyBack.vue';
import FHBodyFront from '@/components/anatomy/FHBodyFront.vue';
import FHFullScreenCloser from '@/components/FHFullScreenCloser.vue';
import { Vue, Component } from 'vue-property-decorator';

@Component({
  components: {
    FHFullScreenCloser,
    FHBodyFront,
    FHBodyBack
  }
})
export default class SearchExercise extends Vue {
  public front = true;

  public muscleSelected(muscle: string) {
    this.$router.push({ name: 'muscle-exercises', params: { muscle: muscle } });
  }
}
</script>

<style lang="scss" scoped>
.view-SearchExercise {
  min-height: 100vh;

  .image-wrapper {
    margin-top: 40px;
    width: 150.3px;
    height: 500px;
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    svg,
    img {
      height: inherit;
      width: inherit;
      position: absolute;
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s;
}
.fade-enter-active,
.fade-leave-active {
  position: absolute;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
  transform: rotateY(90deg) scale(0.75);
}
</style>
