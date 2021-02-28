<template>
  <div class="view-update-recipe">
    <FHHeader v-if="recipe" :title="recipe.title" :trigger="250">
      <FHFullScreenCloser @click="close()" />
    </FHHeader>
    <FHSwipeable @swipeDown="close()">
      <tc-hero :dark="$store.getters.darkmode">
        <img v-if="recipe" :src="recipe.thumbnail" slot="background" />
        <tl-flow v-else flow="column">
          <tc-spinner
            variant="dots-spin"
            size="30"
            :dark="$store.getters.darkmode"
          />
          <p>Rezept wird geladen...</p>
        </tl-flow>
      </tc-hero>
    </FHSwipeable>
    <div content v-if="recipe">
      <FHRecipeForm @close="close()" :recipe="recipe" />
    </div>
  </div>
</template>

<script lang="ts">
import FHFullScreenCloser from '@/components/FHFullScreenCloser.vue';
import FHHeader from '@/components/FHHeader.vue';
import FHSwipeable from '@/components/FHSwipeable.vue';
import FHRecipeForm from '@/components/forms/FHRecipeForm.vue';
import backend from '@/utils/backend';
import { closeFullscreen } from '@/utils/functions';
import { IFHNotification, IRecipe } from '@/utils/interfaces';
import { NotificationManagement } from '@/utils/NotificationManagement';
import { UserManagement } from '@/utils/UserManagement';
import { Vue, Component } from 'vue-property-decorator';

@Component({
  components: {
    FHHeader,
    FHSwipeable,
    FHFullScreenCloser,
    FHRecipeForm
  }
})
export default class UpdateRecipe extends Vue {
  public recipe: IRecipe | null = null;

  mounted() {
    if (!UserManagement.getUserID()) {
      this.close();
    } else {
      backend
        .get('recipe/' + this.$route.params.id)
        .then(res => {
          const recipe: IRecipe = res.data;
          if (!recipe || !recipe._id) {
            this.notFound();
            return;
          }
          if (recipe.author !== UserManagement.getUserID()) {
            this.close({
              title: 'Berechtigungsfehler',
              text: 'Du bist nicht der Ersteller des Rezepts!'
            });
            return;
          }
          this.recipe = recipe;
        })
        .catch(() => this.notFound);
    }
  }

  public close(errorMessage?: IFHNotification) {
    if (errorMessage) {
      NotificationManagement.sendNotification(
        errorMessage.title,
        errorMessage.text
      );
    }
    closeFullscreen('recipes');
  }

  public notFound(): void {
    this.close({
      title: 'Erfolglose Suche',
      text: 'Das angegebene Rezept konnte nicht gefunden werden'
    });
  }
}
</script>

<style lang="scss" scoped>
.view-update-recipe {
  min-height: 100vh;

  [content] {
    padding-top: 0;
  }
}
</style>
