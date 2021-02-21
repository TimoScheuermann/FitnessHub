<template>
  <div class="view-SearchUser">
    <div content max-width>
      <FHFullScreenCloser prev="home" />
      <br />
      <h1 center>Benutzer suchen</h1>
    </div>
  </div>
</template>

<script lang="ts">
import FHFullScreenCloser from '@/components/FHFullScreenCloser.vue';
import { Vue, Component } from 'vue-property-decorator';

@Component({
  components: {
    FHFullScreenCloser
  }
})
export default class SearchUser extends Vue {}
</script>

<style lang="scss" scoped>
.view-SearchUser {
  height: 100vh;
  width: 100vw;
}
</style>
