<template>
  <div class="view-wiki-item">
      <FHHeader v-if="item" :title="item.title" :trigger="250">
      <FHFullScreenCloser @click="close" />
    </FHHeader>
    <FHSwipeable @swipeDown="close">
      <tc-hero :dark="$store.getters.darkmode">
        <img v-if="item" :src="item.thumbnail" slot="background" />
      </tc-hero>
    </FHSwipeable>
    <div content>
        <div max-width v-if="item">
            <h1 center>{{item.title}}</h1>
            <template v-if="item.general">
                <h3>Allgemeines</h3>
                <ul>
                    <li v-for="(i, j) in item.general" :key="'a'+j">{{i}}</li>
                </ul>
            </template>
            <template v-if="item.goodFor">
                <h3>Gut für</h3>
                <ul>
                    <li v-for="(i, j) in item.goodFor" :key="'g'+j">{{i}}</li>
                </ul>
            </template>
            <template v-if="item.containedIn">
                <h3>Enthalten in</h3>
                <ul>
                    <li v-for="(i, j) in item.containedIn" :key="'c'+j">{{i}}</li>
                </ul>
            </template>
        </div>
    </div>
  </div>
</template>

<script lang="ts">
import FHFullScreenCloser from '@/components/FHFullScreenCloser.vue';
import FHHeader from '@/components/FHHeader.vue';
import FHSwipeable from '@/components/FHSwipeable.vue';
import { closeFullscreen } from '@/utils/functions';
import { INutritionWikiItem } from '@/utils/interfaces';
import { NutritionWikiManagement } from '@/utils/NutritionWikiManagement';
import { Vue, Component } from 'vue-property-decorator';

@Component({
    components: {
        FHFullScreenCloser,
        FHSwipeable,
        FHHeader,
    }
})
export default class WikiItem extends Vue {
    created() {
        if (!this.item) {
            this.close()
        }
    }

    get item() :INutritionWikiItem | null {
        return NutritionWikiManagement.getItem(this.$route.params.id)
    }

    public close() :void {
        closeFullscreen("nutrition-wiki")
    }
}
</script>

<style lang="scss" scoped>
.view-wiki-item{
    min-height: 100vh;

    [content] {
    padding-top: 0;
    }
}
</style>
