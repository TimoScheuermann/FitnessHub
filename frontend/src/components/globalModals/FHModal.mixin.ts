import { EventBus } from '@/utils/eventbus';
import { IModalReturn } from '@/utils/interfaces';
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class FHModalMixin extends Vue {
  public modalOpened = false;
  public modalReturn: IModalReturn | null = null;

  mounted() {
    EventBus.$on('modals-close', () => {
      this.close();
    });
  }

  public close() {
    this.modalOpened = false;
    if (this.modalReturn) {
      EventBus.$emit(this.modalReturn.event, this.modalReturn.data);
      this.modalReturn = null;
    }
  }
}
