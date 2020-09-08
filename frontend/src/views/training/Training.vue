<template>
  <div class="training">
    <fh-mobile-header title="Training" />
    <tc-hero
      :dark="true"
      :hasFixedHeader="$store.getters.fixedHeader"
      :height="200"
    >
      <img
        src="https://images.unsplash.com/photo-1549060279-7e168fcee0c2?q=25"
        slot="background"
        alt
      />
      <h1>Training</h1>
    </tc-hero>
    <div content>
      <h1>Was heute ansteht</h1>
      <div class="cd-body">
        <div class="cd-media">
          <img
            src="https://i.guim.co.uk/img/media/222de53fb94c892dd91a7d854f7cf9449cd682a1/0_33_2681_1608/master/2681.jpg?width=605&quality=45&auto=format&fit=max&dpr=2&s=efd558996357cc685aaca475677b6bb0"
            alt="Its Bill, Baby!"
          />
          <h1 class="centered">Titel</h1>
        </div>
        <div class="cd-content">
          <p>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Architecto
            quo facere voluptate esse ex sint veniam pariatur soluta tempora
            magnam id optio, culpa quos. Mollitia molestiae quod est illo
            aperiam!
          </p>
        </div>
      </div>
      <h1>Übungen der Woche</h1>
      <div class="exercise-carousell">
        <fh-exercise v-for="ex in exercises" :key="ex._id" :exercise="ex" />
        <div class="ce" />
      </div>
      <h1>Betroffene Muskeln</h1>
      <div class="muscles-mobile">
        <tc-list :dark="$store.getters.darkmode">
          <tc-list-item
            v-for="m in muscles"
            :key="m"
            :title="m"
            :to="{ name: 'traning-muscle', params: { muscle: m } }"
          />
        </tc-list>
      </div>
      <div class="muscles-desktop">
        <tl-grid minWidth="200">
          <tc-list
            v-for="m in muscles"
            :key="m"
            :dark="$store.getters.darkmode"
          >
            <tc-list-item
              :title="m"
              :to="{ name: 'training-muscle', params: { muscle: m } }"
            />
          </tc-list>
        </tl-grid>
      </div>

      <!-- <div class="exercise-carousell">
        <tc-card class="fh-exercise muscle" v-for="m in muscle" :key="m" :title="m" />
      </div>-->
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { IExercise } from '../../../../backend/src/exercise/interfaces/IExercise';
import FHExercise from '../../components/shared/FH-Exercise.vue';
import axios from '../../utils/axios';
import { muscles } from '../../utils/muscles';

@Component({ components: { 'fh-exercise': FHExercise } })
export default class Training extends Vue {
  private exercises: IExercise[] = [];
  private muscles = muscles;
  async mounted() {
    this.exercises = (await axios.get('exercise')).data;
  }
}
</script>

<style lang="scss" scoped>
.cd-body {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 0px;
  border-radius: $border-radius;
  background: $paragraph;
  box-shadow: $shadow;
  overflow: hidden;
  @media (prefers-color-scheme: dark) {
    background: $paragraph_dark;
  }
}
.cd-media {
  width: 100%;
  height: 100%;
  color: white;
  position: relative;
  overflow: hidden;
}
.cd-media > img {
  width: 100%;
  height: 80%;
  z-index: 1;
  filter: blur(3px);
  overflow: hidden;
}
.centered {
  z-index: 10;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
}
.cd-content {
  margin: 1em;
  text-align: justify;
}
.exercise-carousell {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  margin: 0 -5vw;
  @include custom-scrollbar__light();
  @media (prefers-color-scheme: dark) {
    @include custom-scrollbar__dark();
  }
  .ce {
    flex-shrink: 0;
    width: 5vw;
  }

  .fh-exercise,
  .tc-card {
    width: 250px;
    margin-left: 30px;
    scroll-snap-align: center;
    flex-shrink: 0;
    &:first-child {
      margin-left: 5vw;
    }
  }
}
.muscles-mobile {
  @media only screen and (min-width: 500px) {
    display: none;
  }
}
.muscles-desktop {
  @media only screen and (max-width: 499px) {
    display: none;
  }
}
</style>
