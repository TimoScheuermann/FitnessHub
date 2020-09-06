import { Component, Mixins } from 'vue-property-decorator';
import ExerciseSocketManager from './sub/ExerciseSocket.manager';
import FriendSocketManager from './sub/FriendSocket.manager';
import HealthSocketManager from './sub/HealthSocket.manager';
import MessageSocketManager from './sub/MessageSocket.manager';

@Component
export default class SocketManager extends Mixins(
  FriendSocketManager,
  MessageSocketManager,
  HealthSocketManager,
  ExerciseSocketManager
) {}
