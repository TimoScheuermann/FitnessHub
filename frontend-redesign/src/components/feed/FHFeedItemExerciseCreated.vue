<template>
  <FHFeedItemWrapper
    v-if="item"
    :bgImage="item.thumbnail"
    :user="item.user"
    :timestamp="item.timestamp"
  >
    <div class="fh-feed-item-exercise-created">
      <tl-grid gap="20">
        <div class="image" v-if="item.thumbnail">
          <img :src="item.thumbnail" />
        </div>
        <div class="info">
          <h2>{{ item.title }}</h2>
          <p>{{ item.text }}</p>
          <tl-flow v-if="item.actionId" horizontal="space-between">
            <tc-link
              tfcolor="success"
              @click="$oFS('exercise-details', { id: item.actionId })"
            >
              Übung ansehen
            </tc-link>
            <tc-link tfcolor="success" @click="addTW">
              + Workout
            </tc-link>
          </tl-flow>
        </div>
      </tl-grid>
    </div>
  </FHFeedItemWrapper>
</template>

<script lang="ts">
import { ExerciseManagement } from '@/utils/ExerciseManagement';
import { IFeedItem } from '@/utils/interfaces';
import { Vue, Component, Prop } from 'vue-property-decorator';
import FHFeedItemWrapper from './FHFeedItemWrapper.vue';

@Component({
  components: {
    FHFeedItemWrapper
  }
})
export default class FHFeedItemExerciseCreated extends Vue {
  @Prop() item!: IFeedItem;

  public addTW(): void {
    if (this.item) {
      ExerciseManagement.addToWorkout({
        _id: this.item.actionId || '',
        title: this.item.title || '',
        thumbnail: this.item.thumbnail || '',
        type: 'gym',
        difficulty: 0,
        affectedMuscles: []
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.fh-feed-item-exercise-created {
  .image img {
    border-radius: $border-radius;
    width: 100%;
    max-height: 200px;
    object-fit: cover;
  }
  .info {
    margin: 0 20px;
    h2 {
      margin-top: 0;
    }
  }
}
</style>
