<template>
  <div class="friend-detail" content v-if="friendInfo">
    <tc-list :dark="$store.getters.darkmode">
      <tc-list-item
        icon="chat-bubbles"
        title="Nachricht senden"
        :to="chatRoute"
      />
      <tc-list-item icon="trophy" title="Herausfordern" />
      <tc-list-item
        red
        icon="trashcan-alt"
        title="Freund entfernen"
        @click="removeFriend"
      />
    </tc-list>

    <h1>Gesundheitsdaten</h1>
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

    <h1>Workouts</h1>
    <p>soon.</p>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import axios from '@/utils/axios';
import FHHealthHead from '@/components/health/shared/FH-Health-Head.vue';

@Component({
  components: {
    'fh-health-head': FHHealthHead
  }
})
export default class FriendDetail extends Vue {
  @Prop() friendInfo!: object;

  public water = -2;
  public height = -2;
  public weight = -2;

  mounted() {
    this.load('weight');
    this.load('height');
    this.load('water');
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
