<template>
  <div class="fh-search-bar">
    <form @submit.prevent="submit">
      <tc-input
        :disabled="disabled"
        pattern=".{3,}"
        icon="lens"
        :dark="$store.getters.darkmode"
        @input="input"
        v-model="query"
        :frosted="true"
      />
    </form>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';

@Component
export default class FHSearchBar extends Vue {
  @Prop() value!: string;
  @Prop() disabled!: boolean;

  public query = this.value;

  @Watch('value')
  valueChanged(): void {
    this.query = this.value;
  }

  public input(): void {
    this.$emit('input', this.query);
  }

  public submit(): void {
    this.$emit('submit', this.query);
  }
}
</script>

<style lang="scss" scoped>
.fh-search-bar {
  padding: 5px 5vw;
  z-index: 20;

  form {
    max-width: 400px;
    margin: 0 auto;
  }

  @include backdrop-blur($background);
  @media #{$isDark} {
    @include backdrop-blur($background_dark);
  }

  position: sticky;
  top: calc(env(safe-area-inset-top) + 50px);
}
</style>
