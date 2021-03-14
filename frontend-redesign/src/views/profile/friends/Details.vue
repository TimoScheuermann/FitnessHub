<template>
  <div class="view-friend-details">
    <FHHeader
      backTitle="Freunde"
      rootRoute="friends"
      :title="friend ? friend.username : 'Freund'"
      :trigger="150"
    >
      <tc-action :dark="$store.getters.darkmode">
        <tc-action-item
          @click="sendMessage"
          title="Nachricht senden"
          icon="chat-bubbles"
        />
        <!-- <tc-action-item title="Training planen" icon="calendar-alt" /> -->
        <!-- <tc-action-item title="Herausfordern" icon="trophy" /> -->
        <tc-action-item
          @click="removeFriend"
          error
          title="Freund entfernen"
          icon="trashcan-alt"
        />
      </tc-action>
    </FHHeader>
    <tc-hero :dark="true" :hasFixedHeader="false">
      <img src="assets/friend-details-bg.webp" slot="background" alt="" />
      <FHAppear>
        <tl-flow v-if="friend" flow="column">
          <tc-avatar :src="friend.avatar" />
          <h2>{{ friend.username }}</h2>
          <div v-if="memberSince">Mitglied seit: {{ memberSince }}</div>
        </tl-flow>
        <tl-flow v-else flow="column">
          <tc-spinner :dark="true" size="20" />
          <p>Daten werden geladen...</p>
        </tl-flow>
      </FHAppear>
    </tc-hero>

    <div content max-width>
      <tl-grid minWidth="120" gap="10">
        <div class="fh-graph-card" v-if="weight > 0">
          <FHHeading subtitle="Gewicht" :title="weight + 'kg'" />
        </div>
        <div class="fh-graph-card" v-if="height > 0">
          <FHHeading subtitle="Größe" :title="height + 'cm'" />
        </div>
        <div class="fh-graph-card" v-if="water !== -3">
          <FHHeading subtitle="Trinkometer" :title="water + 'l'" />
        </div>
        <div class="fh-graph-card" v-if="weight > 0 && height > 0">
          <FHHeading subtitle="BMI" :title="bmi" />
        </div>
      </tl-grid>

      <FHAppear>
        <div v-if="exercises">
          <br />
          <br />
          <FHHeading title="Übungen" subtitle="letzten 10" />
          <p v-if="exercises.length === 0">
            Bisher wurden keine Workouts eingetragen
          </p>
          <FHCarousel v-else>
            <FHExercisePreview
              v-for="e in exercises"
              :key="e._id"
              :exercise="e"
            />
          </FHCarousel>
        </div>
      </FHAppear>

      <FHAppear>
        <div v-if="stats">
          <br />
          <FHHeading title="Training" subtitle="Statistik" />

          <h3>Wöchentlich</h3>
          <tl-grid>
            <FHGraphTimeW :chartData="stats" />
            <FHGraphTimeC :chartData="stats" />
            <FHGraphWorkout7 :chartData="stats" />
            <FHGraphWorkoutW :chartData="stats" />
          </tl-grid>
          <h3>Monatlich</h3>
          <FHGraphWorkout28 :chartData="stats" />
        </div>
      </FHAppear>
    </div>
  </div>
</template>

<script lang="ts">
import FHAppear from '@/components/FHAppear.vue';
import FHCarousel from '@/components/FHCarousel.vue';
import FHHeader from '@/components/FHHeader.vue';
import FHHeading from '@/components/FHHeading.vue';
import FHGraphTimeC from '@/components/graphs/FHGraphTimeC.vue';
import FHGraphTimeW from '@/components/graphs/FHGraphTimeW.vue';
import FHGraphWorkout28 from '@/components/graphs/FHGraphWorkout28.vue';
import FHGraphWorkout7 from '@/components/graphs/FHGraphWorkout7.vue';
import FHGraphWorkoutW from '@/components/graphs/FHGraphWorkoutW.vue';
import FHExercisePreview from '@/components/training/FHExercisePreview.vue';
import backend from '@/utils/backend';
import { closeFullscreen, openFullscreen } from '@/utils/functions';
import { IExercise, IUserInfo } from '@/utils/interfaces';
import { UserManagement } from '@/utils/UserManagement';
import { Vue, Component } from 'vue-property-decorator';

@Component({
  components: {
    FHCarousel,
    FHExercisePreview,
    FHGraphWorkout7,
    FHGraphWorkout28,
    FHGraphWorkoutW,
    FHGraphTimeW,
    FHGraphTimeC,
    FHHeading,
    FHAppear,
    FHHeader
  }
})
export default class FriendDetails extends Vue {
  public water = -2;
  public height = -2;
  public weight = -2;
  public stats: null | number[][] = null;
  public exercises: null | IExercise[] = null;
  public info: null | { memberSince: number } = null;

  async mounted() {
    if (!this.friend) {
      await UserManagement.loadFriends();
      if (!this.friend) {
        closeFullscreen('friends');
        return;
      }
    }

    this.loadHealth('weight');
    this.loadHealth('height');
    this.loadHealth('water');
    backend.get('charts/' + this.id).then(res => {
      this.stats = res.data;
    });

    backend.get('exercise/recent/' + this.id).then(res => {
      this.exercises = res.data;
    });

    backend.get('friends/info/' + this.id).then(res => {
      this.info = res.data;
    });
  }

  get friend(): IUserInfo | null {
    return UserManagement.getFriend(this.id);
  }

  get id(): string {
    return this.$route.params.id;
  }

  public loadHealth(type: string): void {
    backend
      .get('health/' + type + '/' + this.id)
      .then(res => {
        // eslint-disable-next-line
        (this as any)[type] = res.data;
      })
      .catch(() => {
        // eslint-disable-next-line
        (this as any)[type] = -3;
      });
  }

  get bmi(): number {
    return Math.round((this.weight / Math.pow(this.height / 100, 2)) * 10) / 10;
  }

  get memberSince(): string | null {
    const info = this.info;
    if (!info) return null;
    const date = new Date(info.memberSince);
    return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
  }

  public sendMessage(): void {
    if (this.friend) {
      openFullscreen('chatroom', { friendId: this.friend._id });
    }
  }

  public removeFriend(): void {
    if (this.friend) {
      UserManagement.removeFriend(this.friend._id);
      closeFullscreen('friends');
    }
  }
}
</script>

<style lang="scss" scoped>
.view-friend-details {
  min-height: 100vh;

  .fh-graph-card {
    height: fit-content;
    margin: auto 0;

    .fh-heading {
      margin-bottom: 0;
    }
  }

  .tc-action {
    z-index: 100;
    /deep/ .actions-wrapper {
      bottom: unset;
      top: 0px;
      z-index: 110;
    }
  }

  .tc-hero {
    height: calc(250px + env(safe-area-inset-top));
    .tl-flow {
      padding-top: env(safe-area-inset-top);
    }
    h2 {
      margin-bottom: 5px;
      & ~ div {
        opacity: 0.5;
        font-weight: 500;
      }
    }
  }
}
</style>
