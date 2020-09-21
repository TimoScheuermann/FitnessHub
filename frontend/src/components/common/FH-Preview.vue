<template>
  <div
    @click="clicked"
    class="fh-category-preview"
    :class="{ 'fh-category-preview__subtitle': subtitle }"
  >
    <video
      v-if="thumbnail.endsWith('.mp4')"
      playsinline
      autoplay="autoplay"
      loop
      muted
    >
      <source :src="thumbnail" />
    </video>
    <img v-else :src="thumbnail" alt="" />
    <div class="fh-category-preview--container">
      <div class="title">
        {{ title }}
      </div>
      <div class="subtitle">
        {{ subtitle }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class FHPreview extends Vue {
  @Prop() routeName!: string;
  @Prop() to!: {};
  @Prop() title!: string;
  @Prop() thumbnail!: string;
  @Prop() subtitle!: string;

  mounted() {
    setTimeout(() => {
      const elements = document.getElementsByTagName('video');
      for (const el of elements) {
        el.play();
      }
    }, 100);
  }

  public clicked(e: MouseEvent): void {
    if (this.routeName) {
      this.$router.push({ name: this.routeName });
    } else if (this.to) {
      this.$router.push(this.to);
    }

    this.$emit('click', e);
  }
}
</script>

<style lang="scss" scoped>
.fh-category-preview {
  cursor: pointer;
  position: relative;
  height: 200px;
  border-radius: $border-radius;
  color: inherit;
  img,
  video {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: $border-radius;
  }

  &.fh-category-preview__subtitle {
    &:hover {
      .fh-category-preview--container {
        top: 0;
        border-radius: $border-radius;
        .title {
          padding-top: 0px;
        }
        .subtitle {
          opacity: 1;
          transition: opacity 0.2s ease-in-out 0.2s;
        }
      }
    }
    .title {
      padding-top: 30px;
    }
  }
  .fh-category-preview--container {
    position: absolute;
    text-align: center;
    display: grid;
    place-content: center;

    top: 140px;
    bottom: 0;
    left: 0;
    right: 0;
    transition: all 0.3s ease-in-out;
    padding: 0 20px;
    border-radius: 0 0 $border-radius $border-radius;
    @include backdrop-blur($paragraph);
    @media (prefers-color-scheme: dark) {
      @include backdrop-blur($paragraph_dark);
    }
    .title {
      font-weight: bold;
      font-size: 1.1em;
      margin-top: 20px;
      transition: all 0.2s ease-in-out;
    }
    .subtitle {
      margin-top: 20px;
      opacity: 0;
    }
  }
}
</style>
