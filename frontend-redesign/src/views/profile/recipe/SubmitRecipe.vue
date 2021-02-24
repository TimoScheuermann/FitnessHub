<template>
  <div class="view-submit-recipe" content>
    <FHRecipeForm @close="close" />
  </div>
</template>

<script lang="ts">
import FHRecipeForm from '@/components/forms/FHRecipeForm.vue';
import { Vue, Component } from 'vue-property-decorator';

@Component({
  components: { FHRecipeForm }
})
export default class SubmitRecipe extends Vue {
  public close() {
    this.$router.push({ name: 'recipes' });
  }
}
</script>

<style lang="scss" scoped>
.view-submit-recipe {
  padding-top: 0;
}
</style>
