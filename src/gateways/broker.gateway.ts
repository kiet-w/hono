import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class BrokerGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('subscribe-prices')
  handleSubscribePrices(client: Socket) {
    client.join('price-updates');
    return { event: 'subscribed', data: 'You are now receiving price updates' };
  }

  pushPriceUpdate(symbol: string, price: number) {
    this.server.to('price-updates').emit('price-update', { symbol, price, timestamp: new Date() });
  }
}
