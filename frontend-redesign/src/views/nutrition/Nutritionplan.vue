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

    <FHAppear>
      <div content v-if="plan">
        <tl-grid minWidth="150" gap="10" max-width>
          <FHButton
            @click="$sP(plan)"
            :frosted="true"
            icon="share"
            title="Teilen"
          />
        </tl-grid>

        <h1 center>{{ plan.title }}</h1>
      </div>
    </FHAppear>

    <FHAppear>
      <div class="grid-wrapper" v-if="plan">
        <div class="grid">
          <div class="daynames" v-for="dn in Object.values(days)" :key="dn">
            {{ dn }}
          </div>
          <div />
          <template v-for="dt in daytimes">
            <template v-for="d in Object.keys(days)">
              <div class="recipe" :key="dt + d">
                <div class="badge" :dt="dt">
                  <i v-if="dt === 'breakfast'" class="ti-bed"></i>
                  <i v-else-if="dt === 'lunch'" class="ti-sun"></i>
                  <i v-else-if="dt === 'dinner'" class="ti-moon"></i>
                </div>

                <div class="thumbnail">
                  <img :src="plan[d][dt].thumbnail" alt="" />
                </div>
                <div class="container">
                  <div class="title">{{ plan[d][dt].title }}</div>

                  <div class="information">
                    <tl-flow
                      class="nutrition"
                      v-for="n in plan[d][dt].nutrition"
                      :key="n.title"
                      horizontal="space-between"
                    >
                      <div class="ntitle">{{ n.title }}</div>
                      <div class="ninfo">{{ n.amount }}{{ n.unit }}</div>
                    </tl-flow>

                    <tl-flow class="additional-info" horizontal="space-between">
                      <div class="ingred-amount">
                        <i class="ti-list"></i>
                        <span>
                          {{ plan[d][dt].ingredients.length }} Zutaten
                        </span>
                      </div>
                      <tc-action :dark="$store.getters.darkmode">
                        <tc-action-item
                          title="Rezept ansehen"
                          icon="lens"
                          @click="
                            $oFS('recipe-details', { id: plan[d][dt]._id })
                          "
                        />
                      </tc-action>
                    </tl-flow>
                  </div>
                </div>
              </div>
            </template>
            <div :key="dt + 's'" />
          </template>

          <tl-flow flow="column" v-for="d in Object.keys(days)" :key="'s' + d">
            <template v-if="(plan[d].snacks || []).length > 0">
              <div class="snacks-title">Snacks</div>
              <div
                class="recipe"
                v-for="(s, i) in plan[d].snacks || []"
                :key="d + i + s._id"
              >
                <div class="badge" dt="snack">
                  <i class="ti-apple-alt"></i>
                </div>

                <div class="thumbnail">
                  <img :src="s.thumbnail" alt="" />
                </div>
                <div class="container">
                  <div class="title">{{ s.title }}</div>
                  <tc-link
                    tfcolor="success"
                    center
                    @click="$oFS('recipe-details', { id: s._id })"
                  >
                    Rezept ansehen
                  </tc-link>
                </div>
              </div>
            </template>
          </tl-flow>
        </div>
      </div>
    </FHAppear>
  </div>
</template>

<script lang="ts">
import FHAppear from '@/components/FHAppear.vue';
import FHButton from '@/components/FHButton.vue';
import FHFullScreenCloser from '@/components/FHFullScreenCloser.vue';
import FHHeader from '@/components/FHHeader.vue';
import FHSwipeable from '@/components/FHSwipeable.vue';
import FHWorkoutThumbnail from '@/components/training/FHWorkoutThumbnail.vue';
import backend from '@/utils/backend';
import { closeFullscreen, formatTimeForMessage } from '@/utils/functions';
import { INutritionplan, IRecipe, IUserInfo } from '@/utils/interfaces';
import { Vue, Component } from 'vue-property-decorator';

@Component({
  components: {
    FHSwipeable,
    FHHeader,
    FHFullScreenCloser,
    FHWorkoutThumbnail,
    FHButton,
    FHAppear
  }
})
export default class Nutritionplan extends Vue {
  public plan: INutritionplan | null = null;
  public error = false;
  public author: IUserInfo | null = null;

  public days = {
    monday: 'Montag',
    tuesday: 'Dienstag',
    wednesday: 'Mittwoch',
    thursday: 'Donnerstag',
    friday: 'Freitag',
    saturday: 'Samstag',
    sunday: 'Sonntag'
  };
  public daytimes = ['breakfast', 'lunch', 'dinner'];

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
    Object.keys(this.days).forEach(d => {
      this.daytimes.forEach(dt => {
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

  .tl-grid {
    left: 50%;
    transform: translate(-50%, calc(-100% - 40px));
    position: absolute;
    z-index: 10;
  }

  [content] {
    padding-top: 0;
    padding-bottom: 0;
  }

  .grid-wrapper {
    max-width: calc(
      100vw - 10vw - env(safe-area-inset-right) - env(safe-area-inset-left)
    );
    padding-left: calc(5vw + env(safe-area-inset-left));
    padding-right: calc(5vw + env(safe-area-inset-right));
    padding-bottom: 20px;
    overflow-x: auto;

    &::-webkit-scrollbar {
      display: none;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(7, 240px) 1px;
      grid-gap: 0 40px;
      .daynames {
        background: $success;
        padding: 10px;
        border-radius: $border-radius 5px $border-radius 5px;
        text-align: center;
        font-weight: 600;
      }
      .snacks-title {
        margin-top: 20px;
        margin-bottom: -10px;
        font-weight: bold;
        opacity: 0.75;
        font-size: 20px;
      }
      .recipe {
        margin-top: 30px;
        display: flex;
        flex-direction: column;
        border-radius: $border-radius;

        @media #{$isLight} {
          background: $paragraph;
        }
        @media #{$isDark} {
          background: $color;
        }

        position: relative;

        .badge {
          position: absolute;
          top: 0;
          right: 0;
          $scale: 40px;
          border-radius: #{$scale / 2.5};
          height: $scale;
          width: $scale;
          transform: translate(40%, -40%);

          display: grid;
          place-content: center;

          &[dt='breakfast'] {
            background: #686de0;
            color: #fff;
          }
          &[dt='lunch'] {
            background: darken(#f9ca24, 10%);
            color: #fff;
          }
          &[dt='dinner'] {
            background: #130f40;
            color: #fff;
          }
          &[dt='snack'] {
            background: $error;
            color: #fff;
          }
        }

        .thumbnail {
          height: 110px;
          img {
            height: 100%;
            width: 100%;
            object-fit: cover;

            border-radius: $border-radius $border-radius 0 0;
          }
        }

        .container {
          padding: 10px;
          display: flex;
          flex-grow: 1;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;
          .title {
            text-align: center;
            font-weight: 700;
            font-size: 20px;
            margin-bottom: 20px;
            padding: 0 10px;
          }

          .tc-link {
            margin-top: -10px;
          }

          .information {
            width: 100%;
            .nutrition {
              padding: 0 10px;
              margin-bottom: 5px;

              .ntitle {
                opacity: 0.9;
              }
              .ninfo {
                font-weight: 600;
              }
            }
            .additional-info {
              margin-top: 15px;
              padding-left: 10px;

              .ingred-amount {
                display: flex;
                justify-content: center;
                align-items: center;
                opacity: 0.75;
                i {
                  font-size: 14px;
                  margin-right: 10px;
                }
              }
            }
          }

          border-radius: 0 0 $border-radius $border-radius;
        }
      }
    }
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
