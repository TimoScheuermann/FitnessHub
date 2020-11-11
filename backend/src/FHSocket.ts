import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class FHSocket {
  @WebSocketServer()
  server: Server;

  /**
   * listen for new frontend connections
   * @param data user id
   * @param client frontend instance
   */
  @SubscribeMessage('join')
  handleJoin(
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket,
  ): void {
    client.join(data);
  }
}
