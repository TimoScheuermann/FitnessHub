import { IHealth } from '@/utils/interfaces';
import { Component, Vue } from 'vue-property-decorator';
import { Socket } from 'vue-socket.io-extended';

@Component
export default class HealthSocketManager extends Vue {
  @Socket('blah')
  healthDataReceived(data: IHealth) {
    console.log(data);
  }
}
