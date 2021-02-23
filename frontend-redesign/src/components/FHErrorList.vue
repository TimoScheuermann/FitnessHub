<template>
  <div class="fh-error-list">
    <transition-group name="error-fade">
      <div class="message" v-for="(m, i) in messages" :key="m.ts + '' + i">
        <div class="icon">
          <i class="ti-exclamation-triangle" />
        </div>
        <div class="content">{{ m.message }}</div>
      </div>
    </transition-group>
  </div>
</template>

<script lang="ts">
import { FHEventBus } from '@/utils/FHEventbus';
import { Vue, Component, Prop } from 'vue-property-decorator';

interface ErrorMessage {
  message: string;
  ts: number;
}

@Component
export default class FHErrorList extends Vue {
  @Prop() id!: string;
  public messages: ErrorMessage[] = [];

  mounted() {
    if (!this.id) {
      this.$destroy();
      return;
    }
    FHEventBus.$on('fh-error-list-' + this.id, this.addMessage);
  }

  public addMessage(message: string): void {
    if (!message) return;

    const ts = new Date().getTime();
    this.messages.push({ message: message, ts: ts });
    setTimeout(() => {
      this.messages = this.messages.filter(x => x.ts !== ts);
    }, 5000);
  }
}
</script>

<style lang="scss" scoped>
$scale: 30px;
.fh-error-list {
  position: fixed;
  bottom: calc(70px + env(safe-area-inset-bottom));
  z-index: 100;
  left: 50%;
  width: 90vw;
  max-width: 400px;
  transform: translateX(-50%);

  .message {
    &:not(:first-child) {
      margin-top: 10px;
    }

    @include backdrop-blur($color_dark);
    @media #{$isDark} {
      @include backdrop-blur($color);
    }
    border-radius: $scale;

    padding: 5px;
    display: grid;
    grid-template-columns: $scale 1fr;
    grid-gap: 10px;
    .icon {
      height: $scale;
      width: $scale;
      border-radius: $scale;
      background: $error;
      display: grid;
      place-content: center;
      color: #fff;
    }
    .content {
      display: flex;
      align-items: center;
    }
  }
}

.error-fade-enter-active,
.error-fade-leave-active {
  transition: opacity 0.2s ease-in-out;
}
.error-fade-move {
  transition: transform 0.4s ease-in-out;
}
.error-fade-enter,
.error-fade-leave-to {
  opacity: 0;
}
</style>
