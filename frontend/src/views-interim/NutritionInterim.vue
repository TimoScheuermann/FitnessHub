<template>
  <div class="profile-interim">
    <fh-mobile-header :title="categoryInfo.title">
      <tc-header-button
        v-if="$route.name !== 'nutrition'"
        routeName="nutrition"
        name="Ernährung"
      />
    </fh-mobile-header>

    <tc-hero :dark="true" :hasFixedHeader="false" :height="200">
      <img :src="categoryInfo.thumbnail" slot="background" alt="" />
      <transition name="hero-anim" mode="out-in">
        <h1 :key="categoryInfo.title">{{ categoryInfo.title }}</h1>
      </transition>
    </tc-hero>
    <div class="view">
      <template v-if="$route.name === 'nutrition-category'">
        <div class="searchbar">
          <tc-input
            :dark="$store.getters.darkmode"
            v-model="query"
            icon="lens"
            placeholder="Suche"
          />
        </div>
        <div class="searchbar fixed" v-if="fixed">
          <tc-input
            :dark="$store.getters.darkmode"
            v-model="query"
            icon="lens"
            placeholder="Suche"
            :frosted="true"
          />
        </div>
      </template>
      <transition :name="$store.getters.routeTransition">
        <router-view
          class="child-view"
          :query="query"
          :error="loadingError"
          :recipe="recipe"
        />
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import { IRecipe } from '@/utils/interfaces';
import { getCategory, getRecipe } from '@/utils/functions';

@Component
export default class ProfileInterim extends Vue {
  public query = '';
  public loadingError = false;
  public recipe: IRecipe | null = null;

  public TRIGGER = 150;
  public fixed = window.scrollY >= this.TRIGGER;

  mounted() {
    window.addEventListener('scroll', this.scrollListener);
  }

  beforeDestroy() {
    window.removeEventListener('scroll', this.scrollListener);
  }

  public scrollListener(): void {
    this.fixed = window.scrollY >= this.TRIGGER;
  }

  @Watch('$route.name', { immediate: true })
  routeNameChanged(to: string) {
    if (to === 'nutrition-recipe') {
      this.loadingError = false;
      this.recipe = null;

      getRecipe(this.$route.params.id, (data: IRecipe | null) => {
        this.recipe = data;
        if (!data) {
          this.loadingError = true;
        }
      });
    }
  }

  get categoryInfo(): {
    title: string;
    thumbnail: string;
  } {
    if (this.$route.name === 'nutrition-category') {
      const cat = getCategory(this.$route.params.category);
      if (cat) {
        return { title: cat.title, thumbnail: cat.thumbnail };
      }
    }
    if (this.$route.name === 'nutrition-recipe' && this.recipe) {
      return {
        title: this.recipe.title,
        thumbnail: this.recipe.thumbnail
      };
    }
    return {
      title: 'Ernährung',
      thumbnail:
        'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?q=10&w=1080'
    };
  }
}
</script>
<style lang="scss" scoped>
.tc-hero {
  img {
    filter: brightness(60%);
  }
  h1 {
    margin: 0px;
    margin-top: env(safe-area-inset-top);
    text-transform: capitalize;
  }
}
.searchbar {
  padding: 10px calc(5vw - 3px);
  &.fixed {
    position: fixed;
    top: 50px;
    right: 0;
    left: 0;
    z-index: 10;
    @include backdrop-blur($paragraph_dark);
  }
}

.hero-anim-enter-active,
.hero-anim-leave-active {
  transition: all 0.16s cubic-bezier(0.55, 0, 0.1, 1);
}
.hero-anim-enter,
.hero-anim-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}
</style>
