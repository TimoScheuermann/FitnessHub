<template>
  <div class="fh-exercise">
    <tc-magic-card
      v-if="ex"
      :src="ex.thumbnail"
      :dark="$store.getters.darkmode"
    >
      <fh-exercise-informations slot="thumbnail" :info="ex" />
      <fh-exercise-atw-button
        :info="ex"
        v-if="!isInATWModal"
        slot="thumbnail"
      />
      <i slot="thumbnail" class="info ti-share" />
      <div class="card-content">
        <fh-pd-exercise :exercise="ex" />
      </div>
    </tc-magic-card>
  </div>
</template>

<script lang="ts">
import axios from '@/utils/axios';
import { EventBus } from '@/utils/eventbus';
import { IExercise } from '@/utils/interfaces';
import { Vue, Component, Prop } from 'vue-property-decorator';
import FHExerciseATWButton from '../exercise/thumbnail/FH-Exercise-ATWButton.vue';
import FHExerciseInformations from '../exercise/thumbnail/FH-Exercise-Informations.vue';
import FHPropertyDetailsExercise from '../propertyDetails/FH-PD-Exercise.vue';

@Component({
  components: {
    'fh-pd-exercise': FHPropertyDetailsExercise,
    'fh-exercise-atw-button': FHExerciseATWButton,
    'fh-exercise-informations': FHExerciseInformations
  }
})
export default class FHExercise extends Vue {
  @Prop() exercise!: IExercise;
  @Prop({ default: false }) isInATWModal!: boolean;
  @Prop() id!: string;

  public ex: IExercise = this.exercise || null;

  async mounted() {
    if (!this.ex && this.id) {
      axios.get('exercise/' + this.id).then(res => {
        this.ex = res.data;
      });
    }
  }

  public addToWorkout(): void {
    EventBus.$emit('modal-add-to-workout', this.ex);
  }
}
</script>

<style lang="scss" scoped>
/deep/ .tc-magic-card__expanded i.info {
  display: none;
}
.fh-exercise {
  /deep/ i.info {
    font-size: 18px;
  }
  .card-content {
    padding: 0 5vw;
  }
  .tc-magic-card /deep/ {
    .description,
    i {
      color: #fff;
    }
    img {
      filter: brightness(50%);
    }
  }
  /deep/ .tl-grid[edit] {
    margin-bottom: 20px;
  }
}
</style>
