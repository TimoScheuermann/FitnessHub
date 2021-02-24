<template>
  <div class="view-Recipe">
    <FHHeader v-if="recipe" :title="recipe.title" :trigger="250" />
    <FHFullScreenCloser @click="$cFS('nutrition')" />
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
          v-if="isAuthor"
          :frosted="true"
          icon="pencil"
          title="Bearbeiten"
          @click="$oFS('update-recipe', { id: recipe._id })"
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
            <FHHeading subtitle="angaben" title="Nährwerte" />
            <tc-table :dark="$store.getters.darkmode">
              <tc-tr v-for="n in recipe.nutrition" :key="n.title">
                <tc-td>{{ n.title }}</tc-td>
                <tc-td>{{ n.amount }} {{ n.unit }}</tc-td>
              </tc-tr>
            </tc-table>
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
}
</style>
