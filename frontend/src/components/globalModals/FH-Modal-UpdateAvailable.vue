<template>
  <tc-modal
    @close="close"
    v-model="modalOpened"
    :dark="$store.getters.darkmode"
    class="fh-modal-update-available"
    title="Neue Version verfügbar"
  >
    <tl-flow>
      <tc-avatar
        border="rounded"
        size="tiny"
        src="./pwa/splash/manifest-icon-512.png"
      />
    </tl-flow>
    <p>
      Es steht ein Update für die FitnessHub zur Verfügung. Klicke auf
      'Anwendung aktualisieren', um es herunterzuladen.
    </p>
    <tl-grid>
      <tc-button
        variant="filled"
        tfbackground="success"
        name="Anwendung aktualisieren"
        icon="download"
        @click="updateApplication"
      />
    </tl-grid>
  </tc-modal>
</template>

<script lang="ts">
import { EventBus } from '@/utils/eventbus';
import { Component, Mixins } from 'vue-property-decorator';
import FHModalMixin from './FHModal.mixin';

@Component
export default class FHModalUpdateAvailable extends Mixins(FHModalMixin) {
  private swRegistration: ServiceWorkerRegistration | null = null;

  mounted() {
    EventBus.$on('modal-update-available', this.open);
  }

  public updateApplication() {
    if (this.swRegistration && this.swRegistration.waiting) {
      this.swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
    this.close();
  }

  public open(swRegistration: ServiceWorkerRegistration | null): void {
    if (!this.modalOpened) {
      this.swRegistration = swRegistration;
      if (this.swRegistration) {
        this.modalOpened = true;
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.fh-modal-update-available {
  &,
  * {
    user-select: none;
  }
  p {
    text-align: center;
  }
}
</style>
