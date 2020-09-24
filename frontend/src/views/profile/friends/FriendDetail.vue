<template>
  <div class="friend-detail" content v-if="friendInfo">
    <tc-list :dark="$store.getters.darkmode">
      <tc-list-item
        icon="chat-bubbles"
        title="Nachricht senden"
        :to="chatRoute"
      />
      <tc-list-item icon="trophy" title="Herausfordern" />
      <tc-list-item icon="calendar-alt" title="Training planen" />
      <tc-list-item
        red
        icon="trashcan-alt"
        title="Freund entfernen"
        @click="removeFriend"
      />
    </tc-list>

    <h3>Gesundheitsdaten</h3>
    <tl-grid minWidth="130" gap="10">
      <div class="fh-health-card" v-if="weight !== -3">
        <tc-spinner
          v-if="weight === -2"
          size="20"
          :dark="$store.getters.darkmode"
        />
        <fh-health-head
          v-else
          :amount="weight"
          unitLong="Gewicht"
          :timespan="0"
          :description="
            height === -1 && 'Das Gewicht konnte nicht geladen werden'
          "
          unitShort="kg"
        />
      </div>
      <div class="fh-health-card" v-if="height !== -3">
        <tc-spinner
          v-if="height === -2"
          size="20"
          :dark="$store.getters.darkmode"
        />
        <fh-health-head
          v-else
          :amount="height"
          unitLong="Größe"
          :timespan="0"
          :description="
            height === -1 && 'Die Größe konnte nicht geladen werden'
          "
          unitShort="cm"
        />
      </div>
      <div class="fh-health-card" v-if="water !== -3">
        <tc-spinner
          v-if="water === -2"
          size="20"
          :dark="$store.getters.darkmode"
        />
        <fh-health-head
          v-else
          :amount="water"
          unitLong="Trinkometer"
          :timespan="0"
          unitShort="l"
        />
      </div>
      <div class="fh-health-card" v-if="weight > 0 && height > 0">
        <fh-health-head
          :amount="bmi"
          unitLong="body mass index"
          :timespan="0"
          unitShort="BMI"
        />
      </div>
    </tl-grid>

    <template v-if="workouts">
      <h3>Letzten 10 Workouts</h3>
      <p v-if="workouts.length === 0">
        Bisher wurden keine Workouts eingetragen
      </p>
      <fh-carousel v-else>
        <fh-exercise
          v-for="(e, i) in workouts"
          :key="e._id + i"
          :exercise="e"
        />
      </fh-carousel>
    </template>

    <template v-if="stats">
      <h3>Trainingsstatistik</h3>

      <tl-grid>
        <fh-health-time-w :chartData="stats" />
        <fh-health-time-c :chartData="stats" />
        <fh-health-workout-w :chartData="stats" />
        <fh-health-workout7 :chartData="stats" />
      </tl-grid>

      <h4>Monatsübersicht</h4>
      <fh-health-workout28 :chartData="stats" />
    </template>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import axios from '@/utils/axios';
import FHHealthHead from '@/components/health/shared/FH-Health-Head.vue';
import FHHealthWorkout7 from '@/components/health/FH-Health-Workout7.vue';
import FHHealthWorkout28 from '@/components/health/FH-Health-Workout28.vue';
import FHHealthWorkoutW from '@/components/health/FH-Health-WorkoutW.vue';
import FHHealthTimeW from '@/components/health/FH-Health-TimeW.vue';
import FHHealthTimeC from '@/components/health/FH-Health-TimeC.vue';
import { IWorkout } from '@/utils/interfaces';
import FHExercise from '@/components/exercise/FH-Exercise.vue';

@Component({
  components: {
    'fh-health-head': FHHealthHead,
    'fh-health-workout7': FHHealthWorkout7,
    'fh-health-workout28': FHHealthWorkout28,
    'fh-health-workout-w': FHHealthWorkoutW,
    'fh-health-time-w': FHHealthTimeW,
    'fh-health-time-c': FHHealthTimeC,
    'fh-exercise': FHExercise
  }
})
export default class FriendDetail extends Vue {
  @Prop() friendInfo!: object;

  public water = -2;
  public height = -2;
  public weight = -2;
  public stats: null | number[][] = null;
  public workouts: null | IWorkout[] = null;

  mounted() {
    this.load('weight');
    this.load('height');
    this.load('water');
    axios.get('charts/' + this.$route.params.id).then(res => {
      this.stats = res.data;
    });
    axios.get('exercise/recent/' + this.$route.params.id).then(res => {
      this.workouts = res.data;
    });
  }

  public async load(type = 'weight') {
    axios
      .get('health/' + type + '/' + this.$route.params.id)
      .then(res => {
        this.setAmount(type, res.data);
      })
      .catch(() => {
        this.setAmount(type, -3);
      });
  }

  public setAmount(type: string, amount: number) {
    if (type === 'water') {
      this.water = amount;
    }
    if (type === 'weight') {
      this.weight = amount;
    }
    if (type === 'height') {
      this.height = amount;
    }
  }

  get bmi(): number {
    return Math.round((this.weight / Math.pow(this.height / 100, 2)) * 10) / 10;
  }

  get chatRoute(): object {
    return { name: 'chatroom', params: this.$route.params };
  }

  public async removeFriend(): Promise<void> {
    await axios.delete('friends/remove/' + this.$route.params.id);
    this.$router.push({ name: 'friends' });
  }
}
</script>

<style lang="scss" scoped>
.tc-list {
  margin-top: 20px;
}
.tc-list-item[red] /deep/ {
  i,
  .tc-list-item--title {
    color: $error;
  }
}
</style>
