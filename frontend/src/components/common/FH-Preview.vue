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
      <div class="subtitle" v-if="subtitle">
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
    height: inherit;
    object-fit: cover;
    border-radius: $border-radius;
  }

  &.fh-category-preview__subtitle {
    &:hover {
      .fh-category-preview--container {
        height: inherit;
        border-radius: $border-radius;
        .subtitle {
          padding-top: 10px;
          max-height: 200px;
          opacity: 1;
          transition: opacity 0.2s ease-in-out 0.2s;
        }
      }
    }
  }
  .fh-category-preview--container {
    position: absolute;
    display: grid;
    place-content: center;
    height: 60px;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 0 20px;
    border-radius: 0 0 $border-radius $border-radius;

    transition: all 0.2s ease-in-out;
    @include backdrop-blur($paragraph);
    @media (prefers-color-scheme: dark) {
      @include backdrop-blur($paragraph_dark);
    }

    text-align: center;
    .title {
      font-weight: bold;
      font-size: 1.1em;
      transition: all 0.2s ease-in-out;
    }
    .subtitle {
      opacity: 0;
      max-height: 0px;
      overflow: hidden;
    }
  }
}
</style>
