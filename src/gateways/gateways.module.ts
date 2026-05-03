import { Module } from '@nestjs/common';
import { BrokerGateway } from './broker.gateway';

@Module({
  providers: [BrokerGateway],
  exports: [BrokerGateway],
})
export class GatewaysModule {}
