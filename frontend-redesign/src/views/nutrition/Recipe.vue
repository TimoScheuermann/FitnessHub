<template>
  <div class="view-Recipe">
    <FHHeader v-if="recipe" :title="recipe.title" :trigger="250">
      <FHFullScreenCloser @click="$cFS('nutrition')" />
    </FHHeader>
    <FHSwipeable @swipeDown="$cFS('nutrition')">
      <tc-hero :dark="$store.getters.darkmode">
        <img v-if="recipe" :src="recipe.thumbnail" slot="background" />
        <tl-flow v-else-if="!error" flow="column">
          <tc-spinner
            variant="dots-spin"
            size="30"
            :dark="$store.getters.darkmode"
          />
          <p>Rezept wird geladen...</p>
        </tl-flow>
        <tl-flow v-else flow="column">
          <i huge error class="ti-exclamation-triangle" />
          <p>Rezept konnte nicht geladen werden</p>
        </tl-flow>
      </tc-hero>
    </FHSwipeable>
    <div content v-if="recipe">
      <tl-grid minWidth="150" gap="10" max-width>
        <FHButton
          :frosted="true"
          :icon="liked ? 'heart' : 'heart-empty'"
          title="Gefällt mir"
          @click="toggleLike"
        />
        <FHButton
          @click="$sR(recipe)"
          :frosted="true"
          icon="share"
          title="Teilen"
        />
      </tl-grid>

      <h1 center>{{ recipe.title }}</h1>
      <div max-width>
        <tl-flow horizontal="space-around" class="quick-information">
          <tl-flow flow="column" class="information">
            <div class="title">Zeit</div>
            <i class="ti-clock-simple"></i>
            <div class="value">{{ recipe.time }} min</div>
          </tl-flow>
          <tl-flow flow="column" class="information">
            <div class="title">Stufe</div>
            <i class="ti-gastro-assistant"></i>
            <div class="value">{{ recipe.difficulty }}</div>
          </tl-flow>
          <tl-flow flow="column" class="information">
            <div class="title">Schritte</div>
            <i class="ti-dots"></i>
            <div class="value">{{ (recipe.steps || []).length }}</div>
          </tl-flow>
        </tl-flow>

        <template v-if="recipe.description || urlInfo">
          <tc-quote
            v-if="author"
            :title="author.username"
            :dark="$store.getters.darkmode"
            tfcolor="success"
          >
            <div v-if="recipe.description">{{ recipe.description }}</div>
            <tc-button
              tfbackground="success"
              v-if="urlInfo"
              :name="urlInfo.name"
              :icon="urlInfo.icon"
              :href="recipe.source"
            />
            <div v-if="youtubeEmbed" class="youtube-embed">
              <iframe
                width="100%"
                :src="youtubeEmbed"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
              />
            </div>
          </tc-quote>
          <br />
        </template>

        <FHAppear>
          <div v-if="(recipe.category || []).length > 0">
            <FHHeading subtitle="Rezept" title="Kategorien" />
            <FHVarList>
              <FHVarListItem
                v-for="c in recipe.category"
                :key="c"
                :title="c"
                :to="{ name: 'recipe-category', params: { category: c } }"
              />
            </FHVarList>
            <br />
            <br />
          </div>
        </FHAppear>

        <FHAppear>
          <div v-if="(recipe.nutrition || []).length > 0">
            <svg width="0" height="0">
              <clipPath id="nut" clipPathUnits="objectBoundingBox">
                <path
                  d="M-11213.573-8941.19l-.335-.1c-.056-.015-.093-.048-.093-.082V-8942c0-.033.037-.067.093-.081l.335-.1a.31.31,0,0,1,.146,0l.335.1c.057.014.093.048.093.081v.628c0,.034-.036.067-.093.082l-.335.1a.255.255,0,0,1-.073.01A.255.255,0,0,1-11213.573-8941.19Z"
                  transform="translate(11214.001 8942.182)"
                />
              </clipPath>
            </svg>
            <FHHeading subtitle="angaben" title="Nährwerte" />
            <div
              class="nutrition-items"
              :style="'--amount: ' + recipe.nutrition.length"
            >
              <div
                class="nutrition-item"
                v-for="n in recipe.nutrition"
                :key="n.title"
              >
                <div class="name">
                  {{ n.title.replace('Kohlenhydrate', 'Carbs') }}
                </div>
                <div class="amount">{{ n.amount }}</div>
                <div class="unit">{{ n.unit }}</div>
              </div>
            </div>
            <br />
            <br />
          </div>
        </FHAppear>

        <FHAppear>
          <div v-if="(recipe.ingredients || []).length > 0">
            <FHHeading subtitle="benötigte" title="Zutaten" />
            <tc-table
              :selectable="true"
              :multiSelect="true"
              :dark="$store.getters.darkmode"
            >
              <tc-tr
                v-for="i in recipe.ingredients"
                :key="i.name"
                :data="i.name"
              >
                <tc-td>{{ i.name }}</tc-td>
                <tc-td>{{ i.amount }} {{ i.unit }}</tc-td>
              </tc-tr>
            </tc-table>
            <br />
            <br />
          </div>
        </FHAppear>

        <FHAppear>
          <div v-if="(recipe.steps || []).length > 0">
            <tl-flow horizontal="space-between">
              <FHHeading subtitle="Schritte" title="Zubereitung" />
              <div>
                <tc-button
                  icon="chevron-left"
                  tfbackground="success"
                  @click="current = Math.max(0, --current)"
                />
                <tc-button
                  icon="chevron-right"
                  tfbackground="success"
                  @click="current = Math.min(recipe.steps.length, ++current)"
                />
              </div>
            </tl-flow>
            <tc-steps
              direction="column"
              :dark="$store.getters.darkmode"
              :current="current"
            >
              <tc-step-item
                v-for="(s, i) in recipe.steps"
                :key="i"
                :title="s"
              />
            </tc-steps>
          </div>
        </FHAppear>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import FHAppear from '@/components/FHAppear.vue';
import FHButton from '@/components/FHButton.vue';
import FHFullScreenCloser from '@/components/FHFullScreenCloser.vue';
import FHHeader from '@/components/FHHeader.vue';
import FHHeading from '@/components/FHHeading.vue';
import FHSwipeable from '@/components/FHSwipeable.vue';
import FHVarList from '@/components/variable-list/FHVarList.vue';
import FHVarListItem from '@/components/variable-list/FHVarListItem.vue';
import backend from '@/utils/backend';
import {
  closeFullscreen,
  extractInfoFromUrl,
  openFullscreen
} from '@/utils/functions';
import { IRecipe, IUserInfo } from '@/utils/interfaces';
import { NotificationManagement } from '@/utils/NotificationManagement';
import { RecipeManagement } from '@/utils/RecipeManagement';
import { UserManagement } from '@/utils/UserManagement';
import { Vue, Component } from 'vue-property-decorator';

@Component({
  components: {
    FHFullScreenCloser,
    FHSwipeable,
    FHButton,
    FHHeading,
    FHVarList,
    FHVarListItem,
    FHAppear,
    FHHeader
  }
})
export default class Recipe extends Vue {
  public recipe: IRecipe | null = null;
  public error = false;

  public author: IUserInfo | null = null;
  public current = 0;

  mounted() {
    backend
      .get('recipe/' + this.$route.params.id)
      .then(async res => {
        this.recipe = res.data;
        if (!this.recipe) {
          NotificationManagement.sendNotification(
            'Rezept konnte nicht gefunden werden',
            'Das angegeben Rezept existiert nicht'
          );
          closeFullscreen('nutrition');
          return;
        }
        const { data } = await backend.get('user/' + this.recipe.author);
        this.author = data;
      })
      .catch(() => {
        this.error = true;
        closeFullscreen('nutrition');
      });
  }

  get urlInfo(): { icon: string; name: string } | null {
    if (!this.recipe || !this.recipe.source) return null;
    return extractInfoFromUrl(this.recipe.source);
  }

  get youtubeEmbed(): string | null {
    if (!this.recipe) return null;
    const { video } = this.recipe;
    if (!video) return null;
    if (!video.startsWith('https://www.youtube.com/watch?v=')) return null;
    return video.replace('watch?v=', 'embed/');
  }

  get isAuthor(): boolean {
    if (!this.recipe) return false;
    return UserManagement.getUserID() === this.recipe.author;
  }

  get liked(): boolean {
    if (!this.recipe) return false;
    return RecipeManagement.hasLiked(this.recipe._id);
  }

  public toggleLike() {
    if (!UserManagement.getUserID()) {
      openFullscreen('login');
      return;
    } else if (this.recipe) {
      RecipeManagement.toggleLike(this.recipe);
    }
  }
}
</script>

<style lang="scss" scoped>
.view-Recipe {
  min-height: 100vh;

  .tl-grid {
    left: 50%;
    transform: translate(-50%, calc(-100% - 40px));
    position: absolute;
    z-index: 10;
  }

  [content] {
    padding-top: 0;

    .quick-information {
      margin-bottom: 20px;
      .information {
        width: 70px;
        padding: 0 10px;
        .title {
          text-transform: uppercase;
          font-size: 14px;
          font-weight: bold;
          opacity: 0.75;
        }
        i {
          margin: 7.5px 0;
          font-size: 2em;
        }
        .value {
          font-weight: 500;
        }
      }
    }

    .tc-quote {
      /deep/ .tc-quote--text {
        &:before,
        &:after {
          display: none;
        }
      }
      .tc-button {
        margin-left: 0;
        margin-top: 10px;
      }
      .youtube-embed {
        margin-top: 10px;
        text-align: center;
        iframe {
          border-radius: $border-radius;
        }
      }
    }

    .tc-table-2 {
      /deep/ .tc-th {
        padding: 0;
      }
      /deep/ .tc-td {
        height: 27.777px;
      }
      /deep/ .tc-checkbox svg #background {
        fill: $success;
      }
    }
  }

  svg {
    position: absolute;
  }

  .nutrition-items {
    display: grid;
    grid-gap: 20px;
    grid-template-columns: repeat(var(--amount), 1fr);
    .nutrition-item {
      display: flex;
      flex-direction: column;
      padding: 20px 5px;
      text-align: center;
      clip-path: url(#nut);

      max-width: 90px;
      width: 100%;
      margin: 0 auto;

      background: $container;
      @media #{$isDark} {
        background: $container_dark;
      }
      .name {
        font-weight: bold;
        font-size: 12px;
        text-transform: uppercase;
      }
      .amount {
        margin-top: 5px;
        color: $success;
        font-weight: bold;
      }
    }
  }
}
</style>
