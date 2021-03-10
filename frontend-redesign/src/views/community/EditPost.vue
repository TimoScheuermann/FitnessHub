<template>
  <div class="view-edit-post" content>
    <FHAppear>
      <tl-flow v-if="!post" flow="column">
        <br />
        <br />
        <tc-spinner :dark="$store.getters.darkmode" size="20" />
        <p>Post wird geladen</p>
      </tl-flow>
    </FHAppear>
    <FHAppear>
      <FHPostForm v-if="post" :item="post" />
    </FHAppear>
  </div>
</template>

<script lang="ts">
import FHAppear from '@/components/FHAppear.vue';
import FHPostForm from '@/components/forms/FHPostForm.vue';
import backend from '@/utils/backend';
import { IFeed } from '@/utils/interfaces';
import { NotificationManagement } from '@/utils/NotificationManagement';
import { Vue, Component } from 'vue-property-decorator';

@Component({
  components: {
    FHPostForm,
    FHAppear
  }
})
export default class EditPost extends Vue {
  public post: IFeed | null = null;

  mounted() {
    const id = this.$route.params.id;
    if (!id) {
      this.$router.push({ name: 'community' });
    } else {
      backend
        .get('feed/' + id)
        .then(res => {
          this.post = res.data;
        })
        .catch(() => {
          NotificationManagement.sendNotification(
            'Post existiert nicht',
            'Ein post mit der id ' + id + ' existiert nicht'
          );
          this.$router.push({ name: 'community' });
        });
    }
  }
}
</script>

<style lang="scss" scoped>
.view-edit-post {
  padding-top: 0;
}
</style>
