<template>
  <tc-modal
    @close="close"
    v-model="modalOpened"
    :dark="$store.getters.darkmode"
    class="fh-modal-recipe-details"
    :class="{ 'content-loaded': recipe }"
    :title="title"
  >
    <div class="error" v-if="error">
      <div class="icon">
        <i class="ti-exclamation-triangle" />
      </div>
      <div class="title">
        Das angeforderte Rezept konnte nicht gefunden werden.
      </div>
      <tl-grid>
        <tc-button
          name="Ansicht schließen"
          tfbackground="success"
          @click="close"
        />
      </tl-grid>
    </div>
    <tl-flow v-else-if="!recipe">
      <tc-spinner size="20" :dark="$store.getters.darkmode" />
    </tl-flow>
    <template v-else>
      <div class="thumbnail">
        <img :src="recipe.thumbnail" alt="" />
        <div class="informations">
          <div class="time">
            <i class="ti-clock-simple" />
            <span>{{ recipe.time }} min</span>
          </div>
          <div class="title">{{ recipe.title }}</div>
        </div>
        <div class="fav-button" v-if="$store.getters.valid">
          <tc-button
            :disabled="$store.getters.loading"
            @click.stop="like"
            icon="heart"
            :variant="hasLiked ? 'filled' : 'opaque'"
            tfbackground="error"
            :name="hasLiked ? 'gefällt dir' : undefined"
          />
        </div>
      </div>
      <fh-pd-recipe :recipe="recipe" />
    </template>
  </tc-modal>
</template>

<script lang="ts">
import axios from '@/utils/axios';
import { EventBus } from '@/utils/eventbus';
import { hasLikedRecipe } from '@/utils/functions';
import { IRecipe, IModalReturn } from '@/utils/interfaces';
import { Component, Mixins } from 'vue-property-decorator';
import FHPropertyDetailsRecipe from '../propertyDetails/FH-PD-Recipe.vue';
import FHModalMixin from './FHModal.mixin';

@Component({
  components: {
    'fh-pd-recipe': FHPropertyDetailsRecipe
  }
})
export default class FHModalRecipeDetails extends Mixins(FHModalMixin) {
  public error = false;
  public recipeId = '';
  public recipe: IRecipe | null = null;

  mounted() {
    EventBus.$on('modal-recipe-details', this.open);
    EventBus.$on('modal-recipe-details-return', (modalReturn: IModalReturn) => {
      this.modalReturn = modalReturn;
    });
  }

  get title(): string | null {
    if (!this.recipe) return 'Lade Informationen...';
    return null;
  }

  get hasLiked(): boolean {
    if (!this.recipe) return false;
    return hasLikedRecipe(this.recipe._id);
  }

  public async like(): Promise<void> {
    if (this.recipe) {
      if (this.hasLiked) {
        this.$store.commit('removeFavedRecipe', this.recipe._id);
        await axios.delete('recipe/like/' + this.recipe._id);
      } else {
        this.$store.commit('addFavedRecipe', this.recipe);
        await axios.put('recipe/like/' + this.recipe._id);
      }
    }
  }

  public open(id: string): void {
    this.error = false;
    if (this.recipeId !== id) {
      this.recipe = null;
      this.recipeId = id;
    }
    this.modalOpened = true;
    if (!this.recipe) {
      axios
        .get('recipe/' + this.recipeId, { timeout: 2000 })
        .then(res => {
          if (!res.data) {
            this.error = true;
            return;
          }
          this.recipe = res.data;
        })
        .catch(() => {
          this.error = true;
        });
    }
  }
}
</script>

<style lang="scss" scoped>
.fh-modal-recipe-details {
  &,
  * {
    user-select: none;
  }
  &.content-loaded {
    /deep/ .tc-modal--head__prestyled {
      padding: 0;
    }
  }
  .error {
    .icon {
      color: $error;
      text-align: center;
      font-size: 3em;
    }
    .title {
      margin-bottom: 10px;
    }
  }
  .thumbnail {
    height: 200px;
    width: calc(100% + 10vw);
    margin-left: -5vw;
    position: relative;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      filter: brightness(50%);
    }
    .fav-button {
      position: absolute;
      bottom: 17px;
      right: 17px;
    }

    .informations {
      position: absolute;
      top: 0;
      left: 0;
      padding: 20px;
      .time {
        i {
          position: static;
          cursor: default;
          font-size: inherit;
          opacity: inherit;
        }
        span {
          margin-left: 5px;
        }
      }
      .title {
        font-size: 1.3em;
        font-weight: 500;
        margin-top: 5px;
      }
    }
  }
}
</style>
