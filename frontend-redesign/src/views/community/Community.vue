<template>
  <div class="view-community" content>
    <div max-width>
      <h3>Neueste Nachrichten</h3>
      <FHFeedItemRecipeCreated />
      <FHFeedItemRecipeCreated />
    </div>
  </div>
</template>

<script lang="ts">
import FHFeedItemRecipeCreated from '@/components/feed/FHFeedItemRecipeCreated.vue';
import { Vue, Component } from 'vue-property-decorator';

@Component({
  components: {
    FHFeedItemRecipeCreated
  }
})
export default class Community extends Vue {}
</script>

<style lang="scss" scoped>
.view-community {
  padding-top: 0;
}
</style>
