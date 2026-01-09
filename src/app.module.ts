import { Module } from '@nestjs/common';
import { MqttService } from './mqtt/mqtt.service';

@Module({
  imports: [],
  controllers: [],
  providers: [MqttService],
})
export class AppModule {}
