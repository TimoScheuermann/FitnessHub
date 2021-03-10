<template>
  <div class="view-create-post" content>
    <FHPostForm />
  </div>
</template>

<script lang="ts">
import FHPostForm from '@/components/forms/FHPostForm.vue';
import { Vue, Component } from 'vue-property-decorator';

@Component({
  components: {
    FHPostForm
  }
})
export default class CreatePost extends Vue {}
</script>

<style lang="scss" scoped>
.view-create-post {
}
</style>
