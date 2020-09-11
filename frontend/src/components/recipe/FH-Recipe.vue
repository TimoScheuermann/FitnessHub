<template>
  <tc-magic-card
    :dark="$store.getters.darkmode"
    :src="recipe.thumbnail"
    class="fh-recipe"
  >
    <div class="card-thumbnail" slot="thumbnail">
      <div class="time">
        <i class="ti-clock-simple" />
        <span>{{ Math.floor(recipe.time / 60) }} min</span>
      </div>
      <div class="title">{{ recipe.title }}</div>
    </div>
    <div class="fav-button" slot="thumbnail">
      <tc-button icon="heart" variant="opaque" tfbackground="error" />
    </div>
    <div class="card-content">
      <p v-if="recipe.description">{{ recipe.description }}</p>
      <h3>Kategorien</h3>
      <div class="categories">
        <div class="category" v-for="c in recipe.category" :key="c">
          {{ c }}
        </div>
      </div>
      <tl-flow horizontal="space-between">
        <h3>Schwierigkeit</h3>
        <div class="difficulty" :diff="recipe.difficulty">
          <i
            class="ti-gastro-assistant"
            v-for="(i, j) in Array(+recipe.difficulty)"
            :key="j"
          />
        </div>
      </tl-flow>
      <h3 nutrition>Nährwerte</h3>
      <ul>
        <li v-for="n in recipe.nutrition" :key="n.title">
          {{ n.title }}: {{ n.amount }}{{ n.unit }}
        </li>
      </ul>
      <h3>Zutaten</h3>
      <tc-table
        :dark="$store.getters.darkmode"
        :selectable="true"
        :multiSelect="true"
      >
        <tc-tr v-for="i in recipe.ingredients" :key="i.name" :data="i.name">
          <tc-td>{{ i.name }}</tc-td>
          <tc-td>{{ i.amount }}{{ i.unit }}</tc-td>
        </tc-tr>
      </tc-table>
      <tl-flow horizontal="space-between" steps>
        <h3>Schritte</h3>
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
        :current="current"
        :dark="$store.getters.darkmode"
      >
        <tc-step-item v-for="s in recipe.steps" :key="s" :title="s" />
      </tc-steps>
    </div>
  </tc-magic-card>
</template>

<script lang="ts">
import { sampleRecipe } from '@/utils/constants';
import { IRecipe } from '@/utils/interfaces';
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class FHRecipe extends Vue {
  public current = 0;

  @Prop({ default: sampleRecipe }) recipe!: IRecipe;
}
</script>

<style lang="scss" scoped>
.fh-recipe {
  /deep/ img {
    filter: brightness(60%);
  }
  .card-thumbnail {
    position: absolute;
    top: 0px;
    left: 0px;
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
  .fav-button {
    position: absolute;
    bottom: 17px;
    right: 17px;
  }
  .card-content {
    padding: 0 5vw;
    h3[nutrition] {
      margin-top: 0;
    }
    .tl-flow[steps] {
      margin-top: 10px;
    }
    /deep/ .tc-th {
      padding: 0;
    }
    /deep/ .tc-checkbox svg #background {
      fill: $success;
    }
    .categories {
      margin: 0 -3px;
      .category {
        padding: 2.5px 12.5px;
        box-sizing: border-box;
        border: 2px solid rgba($color, 0.25);
        @media (prefers-color-scheme: dark) {
          border-color: rgba($color_dark, 0.5);
        }
        border-radius: $border-radius;
        display: inline-block;
        margin: 3px;
      }
    }
    .difficulty {
      &[diff='1'] {
        color: $success;
      }
      &[diff='2'] {
        color: $alarm;
      }
      &[diff='3'] {
        color: $error;
      }
      i {
        color: inherit;
        margin-left: 5px;
      }
    }
  }
}
</style>
