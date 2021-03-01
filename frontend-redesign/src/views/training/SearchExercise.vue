<template>
  <div class="view-SearchExercise">
    <div content max-width>
      <FHHeader title="Übung suchen">
        <FHFullScreenCloser @click="$cFS('training')" />
      </FHHeader>
      <br />
      <h1 center>Übung suchen</h1>
      <form @submit.prevent="submit">
        <tc-input
          pattern=".{3,}"
          v-model="query"
          icon="lens"
          :frosted="true"
          :dark="true"
          placeholder="Suchbegriff eingeben"
        />
      </form>
      <h3 center>oder Muskel wählen</h3>
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
import FHHeader from '@/components/FHHeader.vue';
import { Vue, Component } from 'vue-property-decorator';

@Component({
  components: {
    FHFullScreenCloser,
    FHBodyFront,
    FHBodyBack,
    FHHeader
  }
})
export default class SearchExercise extends Vue {
  public front = true;
  public query = '';

  public muscleSelected(muscle: string) {
    this.$router.push({ name: 'muscle-exercises', params: { muscle: muscle } });
  }

  public submit(): void {
    if (this.query.length < 2) return;

    this.$router.push({
      name: 'exercise-search-results',
      query: { q: this.query }
    });
  }
}
</script>

<style lang="scss" scoped>
.view-SearchExercise {
  min-height: 100vh;
  color: #fff;

  background: linear-gradient(rgba($color, 0.5), rgba($color, 0.5)),
    url('/assets/exercise-search-bg.webp');
  background-size: cover;
  background-position: center center;

  [content] {
    padding-bottom: 20px;
  }

  form {
    margin: 0 auto;
    max-width: 400px;
    margin-top: 20px;
    .tc-input {
      padding: 10px 20px;
    }
  }

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
