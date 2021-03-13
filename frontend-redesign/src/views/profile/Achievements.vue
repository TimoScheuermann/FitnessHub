<template>
  <div class="view-achievements" content>
    <div max-width>
      <tl-flow flow="column" v-if="!$store.getters.achievements">
        <br />
        <tc-spinner :dark="$store.getters.darkmode" size="20" />
        <p>Erfolge werden geladen</p>
      </tl-flow>

      <p v-else-if="$store.getters.achievements.length === 0"></p>

      <masonry v-else :cols="{ default: 2, 600: 1 }" gutter="20px">
        <div
          class="achievement"
          v-for="(a, i) in $store.getters.achievements"
          :key="i"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
            <path
              d="M22.445 49.871a25.066 25.066 0 01-2.484-.379 24.908 24.908 0 01-4.693-1.458 24.569 24.569 0 01-4.244-2.3 25.015 25.015 0 01-3.7-3.052 25.1 25.1 0 01-3.053-3.7 24.768 24.768 0 01-2.3-4.246 24.671 24.671 0 01-1.457-4.693 24.593 24.593 0 01-.379-2.482 25.316 25.316 0 01-.129-2.556 25.3 25.3 0 01.129-2.556 24.72 24.72 0 01.379-2.482 24.671 24.671 0 011.457-4.693 24.8 24.8 0 012.3-4.246 25.1 25.1 0 013.053-3.7 24.894 24.894 0 013.7-3.052 24.712 24.712 0 014.244-2.307A24.9 24.9 0 0119.961.514a24.871 24.871 0 012.484-.38A25.542 25.542 0 0125 .005a25.571 25.571 0 012.555.129 25.045 25.045 0 012.484.38 24.88 24.88 0 014.691 1.455 25.024 25.024 0 014.246 2.307 24.978 24.978 0 013.7 3.052 25.117 25.117 0 013.055 3.7 25.077 25.077 0 012.3 4.246 25.267 25.267 0 011.457 4.693c.164.815.295 1.65.379 2.482s.129 1.7.129 2.556-.045 1.712-.129 2.556-.215 1.668-.379 2.482a25.244 25.244 0 01-1.457 4.693 25.039 25.039 0 01-2.3 4.246 25.117 25.117 0 01-3.055 3.7 25.2 25.2 0 01-3.7 3.052 24.878 24.878 0 01-4.246 2.3 24.889 24.889 0 01-4.691 1.458c-.816.167-1.652.294-2.484.379A25.571 25.571 0 0125 50a25.542 25.542 0 01-2.555-.129zM.972 25a24.054 24.054 0 0024.027 24.027A24.056 24.056 0 0049.026 25 24.057 24.057 0 0024.999.972 24.054 24.054 0 00.973 25.001zm14.3 17.778a1.044 1.044 0 01-1.043-1.042 1.043 1.043 0 011.043-1.042h1.734v-.485a1.738 1.738 0 011.738-1.737h12.5a1.736 1.736 0 011.736 1.737v.485h1.738a1.042 1.042 0 011.041 1.042 1.042 1.042 0 01-1.041 1.042zm5.211-6.39v-.347a4.484 4.484 0 011.078-2.926c-.27-.08-.537-.168-.8-.266a7.224 7.224 0 01-4.666 2.148 7.51 7.51 0 01-4.941-2.43 1.042 1.042 0 010-1.389 7.949 7.949 0 014.172-2.369 12.08 12.08 0 01-1.508-2.584 7.19 7.19 0 01-4.75-1.777 7.53 7.53 0 01-1.777-5.215 1.043 1.043 0 01.982-.982 8 8 0 014.566 1.232v-2.457a7.177 7.177 0 01-2.082-4.6 7.513 7.513 0 012.43-4.941 1.037 1.037 0 011.389 0 7.5 7.5 0 012.43 4.941 7.177 7.177 0 01-2.08 4.6v4.43a10.08 10.08 0 0010.068 10.07 10.083 10.083 0 0010.07-10.07v-4.43a7.178 7.178 0 01-2.086-4.6 7.5 7.5 0 012.434-4.941 1.035 1.035 0 011.387 0 7.513 7.513 0 012.43 4.941 7.187 7.187 0 01-2.082 4.6v2.457a8.011 8.011 0 014.566-1.232 1.043 1.043 0 01.982.982c.006.135.158 3.279-1.775 5.215a7.194 7.194 0 01-4.75 1.777 12.162 12.162 0 01-1.508 2.584 7.978 7.978 0 014.172 2.369 1.042 1.042 0 010 1.389 7.523 7.523 0 01-4.943 2.43 7.224 7.224 0 01-4.666-2.148c-.262.1-.527.186-.8.266a4.5 4.5 0 011.08 2.926v.347zm7.5-10.441l-2.434-1.308a1.18 1.18 0 00-1.117 0l-2.436 1.308a1.18 1.18 0 01-1.713-1.284l.52-2.444a1.187 1.187 0 00-.379-1.134l-1.883-1.647a1.18 1.18 0 01.648-2.062l2.648-.291a1.181 1.181 0 00.936-.663l1.15-2.4a1.181 1.181 0 012.129 0l1.152 2.4a1.181 1.181 0 00.936.663l2.648.291a1.179 1.179 0 01.648 2.062l-1.881 1.647a1.174 1.174 0 00-.379 1.134l.52 2.444a1.184 1.184 0 01-1.156 1.428 1.177 1.177 0 01-.548-.144z"
              :fill="getFill([...a.achievedAt])"
            />
          </svg>
          <tl-flow flow="column">
            <div class="title">{{ a.exerciseTitle }}</div>
            <div class="date">{{ getDate([...a.achievedAt]) }}</div>
          </tl-flow>
        </div>
      </masonry>
    </div>
  </div>
</template>

<script lang="ts">
import { AchievementManager } from '@/utils/AchievementManager';
import { formatDate } from '@/utils/functions';
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class Achievements extends Vue {
  mounted() {
    this.$store.commit('clearNewAchievements');
    AchievementManager.load();
  }

  public getDate(dates: number[]): string | null {
    if (!dates || dates.length === 0) return null;
    return formatDate(dates.sort((a, b) => b - a)[0]);
  }

  getFill(dates: number[]): string {
    const { length } = dates;
    if (length <= 1) {
      return '#cd7f32';
    }
    if (length <= 2) {
      return '#c0c0c0';
    }
    return '#f1c40f';
  }
}
</script>

<style lang="scss" scoped>
.view-achievements {
  .achievement {
    background: $paragraph;
    @media #{$isDark} {
      background: $paragraph_dark;
    }
    padding: 20px;
    border-radius: $border-radius;
    margin-bottom: 20px;
    display: grid;
    grid-template-columns: auto 1fr;
    grid-gap: 20px;
    svg {
      height: 50px;
      width: 50px;
    }

    .tl-flow {
      align-items: flex-start;
    }

    .title {
      font-weight: bold;
    }
    .date {
      margin-top: 5px;
      font-weight: 600;
      opacity: 0.5;
      text-transform: uppercase;
      font-size: 14px;
    }
  }
}
</style>
