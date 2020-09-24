<template>
  <div class="achievements" content>
    <tl-flow v-if="!achievements" flow="column">
      <h1>Lade Erfolge</h1>
      <tc-spinner :dark="$store.getters.darkmode" size="20" />
    </tl-flow>
    <template v-else>
      <h3>Freigeschaltet</h3>
      <p v-if="achievements.length === 0">
        Du hast noch keine Erfolge freigeschaltet.
      </p>
      <tl-grid v-else minWidth="100" arrangement="auto-fill">
        <fh-preview
          v-for="a in achievements"
          :key="a.title"
          :thumbnail="a.asset"
          :title="a.title"
          :subtitle="a.subtitle"
        />
      </tl-grid>
    </template>
  </div>
</template>

<script lang="ts">
import FHPreview from '@/components/common/FH-Preview.vue';
import axios from '@/utils/axios';
import { IAchievment } from '@/utils/interfaces';
import { Vue, Component } from 'vue-property-decorator';

@Component({
  components: {
    'fh-preview': FHPreview
  }
})
export default class Achievements extends Vue {
  public achievements: null | IAchievment[] = null;

  async mounted() {
    this.achievements = (await axios.get('achievement')).data;
  }
}
</script>
