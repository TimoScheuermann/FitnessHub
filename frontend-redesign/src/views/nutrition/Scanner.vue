<template>
  <div class="view-nutrition-scanner">
    <FHHeader title="Obst / Gemüse Scanner">
      <FHFullScreenCloser @click="$cFS('nutrition')" />
    </FHHeader>

    <iframe
      src="https://fvi.timos.design"
      frameborder="0"
      allowfullscreen="true"
    />
  </div>
</template>

<script lang="ts">
import FHFullScreenCloser from '@/components/FHFullScreenCloser.vue';
import FHHeader from '@/components/FHHeader.vue';
import { Vue, Component } from 'vue-property-decorator';

@Component({
  components: {
    FHHeader,
    FHFullScreenCloser
  }
})
export default class NutritionScanner extends Vue {}
</script>

<style lang="scss" scoped>
.view-nutrition-scanner {
  min-height: 100vh;

  iframe {
    background: #fff;
    height: calc(100vh - 4px);
    width: 100vw;
    margin: 0;
    padding: 0;
    border: none;
    outline: none;
  }
}
</style>
