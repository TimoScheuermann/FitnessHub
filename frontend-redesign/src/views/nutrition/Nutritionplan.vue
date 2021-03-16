<template>
  <div class="view-nutritionplan">
    <FHHeader :title="plan ? plan.title : 'Ernährungsplan'" :trigger="250">
      <FHFullScreenCloser @click="close" />
    </FHHeader>
    <FHSwipeable @swipeDown="close">
      <tc-hero :dark="true">
        <img v-if="plan" src="assets/hero/home.webp" slot="background" />
        <tl-flow v-else-if="!error" flow="column">
          <tc-spinner
            variant="dots-spin"
            size="30"
            :dark="$store.getters.darkmode"
          />
          <p>Ernährungsplan wird geladen...</p>
        </tl-flow>
        <tl-flow v-else flow="column">
          <i huge error class="ti-exclamation-triangle" />
          <p>Ernährungsplan konnte nicht geladen werden</p>
        </tl-flow>

        <div class="hero-container" v-if="plan">
          <FHWorkoutThumbnail :exercises="recipes" />
          <div class="workout-information" center>
            <template v-if="author">
              <tc-avatar :src="author.avatar" size="tiny" />
              <div class="author">{{ author.username }}</div>
            </template>
            <div class="updated">updated {{ tsUpdated }}</div>
          </div>
        </div>
      </tc-hero>
    </FHSwipeable>
    <div content v-if="plan">
      <div max-width>
        <h1 center>{{ plan.title }}</h1>

        {{ plan }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import FHFullScreenCloser from '@/components/FHFullScreenCloser.vue';
import FHHeader from '@/components/FHHeader.vue';
import FHSwipeable from '@/components/FHSwipeable.vue';
import FHWorkoutThumbnail from '@/components/training/FHWorkoutThumbnail.vue';
import backend from '@/utils/backend';
import { closeFullscreen, formatTimeForMessage } from '@/utils/functions';
import { INutritionplan, IRecipe, IUserInfo } from '@/utils/interfaces';
import { Vue, Component } from 'vue-property-decorator';

const days = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday'
];
const daytimes = ['breakfast', 'lunch', 'dinner'];

@Component({
  components: {
    FHSwipeable,
    FHHeader,
    FHFullScreenCloser,
    FHWorkoutThumbnail
  }
})
export default class Nutritionplan extends Vue {
  public plan: INutritionplan | null = null;
  public error = false;
  public author: IUserInfo | null = null;

  mounted() {
    backend
      .get('nutritionplan/' + this.$route.params.id)
      .then(async res => {
        this.plan = res.data;

        if (!this.plan) return;
        const { data } = await backend.get('user/' + this.plan.author);
        this.author = data;
      })
      .catch(() => {
        this.error = true;
        this.close();
      });
  }

  get recipes(): IRecipe[] {
    if (!this.plan) return [];
    const recipes: IRecipe[] = [];
    days.forEach(d => {
      daytimes.forEach(dt => {
        // eslint-disable-next-line
        recipes.push((this.plan as any)[d][dt]);
      });
    });
    return recipes;
  }

  get tsUpdated(): string {
    if (!this.plan || !this.plan.updated) return '';
    return formatTimeForMessage(this.plan.updated);
  }

  public close() {
    closeFullscreen('nutrition');
  }
}
</script>

<style lang="scss" scoped>
.view-nutritionplan {
  min-height: 100vh;

  [content] {
    padding-top: 0;
  }

  .tc-hero {
    img[src='assets/hero/home.webp'] {
      filter: blur(10px) brightness(80%);
    }

    padding-top: env(safe-area-inset-top);
    @media only screen and(max-width: 599px) {
      height: 400px;
      .fh-workout-thumbnail {
        margin-top: -40px;
        margin-bottom: 10px;
      }
      .tc-avatar {
        display: none;
      }
    }
    @media only screen and(min-width: 600px) {
      height: 350px;
      .hero-container {
        display: grid;
        grid-template-columns: auto 1fr;
        grid-gap: 30px;
        margin-top: -80px;
      }
    }
    .hero-container {
      .workout-information {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        font-weight: 600;
        .tc-avatar {
          margin-bottom: 5px;
        }
        .author {
          color: #25ca49;
          margin-bottom: 2.5px;
        }
        .updated {
          opacity: 0.75;
          font-size: 13px;
          text-transform: uppercase;
        }
      }
      .fh-workout-thumbnail {
        height: 200px;
        width: 200px;
      }
    }
  }
}
</style>
