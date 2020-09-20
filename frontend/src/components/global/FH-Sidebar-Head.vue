<template>
  <div class="fh-sidebar-head"><i class="ti-gym" /> FitnessHub</div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class FHSidebarHead extends Vue {}
</script>
<style lang="scss" scoped>
.fh-sidebar-head {
  font-weight: 700;
  color: $color;
  font-size: 1.2em;
  display: flex;
  height: 50px;
  width: 210px;
  justify-content: center;
  align-items: center;
  color: #fff;
  i {
    margin-right: 5px;
  }
}
</style>
