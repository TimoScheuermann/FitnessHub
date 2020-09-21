<template>
  <div class="achievements" content>
    <h1>Freigeschaltet</h1>
    <tl-grid arrangement="auto-fill">
      <fh-preview
        v-for="a in achievements"
        :key="a.title"
        :thumbnail="a.asset"
        :title="a.title"
        :subtitle="a.subtitle"
      />
    </tl-grid>
  </div>
</template>

<script lang="ts">
import FHPreview from '@/components/common/FH-Preview.vue';
import { IAchievment } from '@/utils/interfaces';
import { Vue, Component } from 'vue-property-decorator';

@Component({
  components: {
    'fh-preview': FHPreview
  }
})
export default class Achievements extends Vue {
  public achievements: IAchievment[] = [
    {
      title: '7 Workout Week',
      subtitle:
        'Du hast in den letzten 7 Tagen mindestens eine Übung pro Tag ausgeübt',
      date: new Date().getTime(),
      asset: 'assets/achievements/7WorkoutWeek.jpg'
    },
    {
      title: 'Bizeps Curls (Langhantel)',
      subtitle:
        'Du hast zum ersten mal die Übung "Bizeps Curls (Langhantel)" gemacht',
      date: new Date().getTime(),
      asset:
        'https://assets.mixkit.co/videos/preview/mixkit-man-exercising-with-the-barbell-at-the-gym-23457-small.mp4'
    }
  ];
}
</script>
