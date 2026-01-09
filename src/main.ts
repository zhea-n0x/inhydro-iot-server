import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MqttService } from './mqtt/mqtt.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const mqttService = app.get(MqttService);
  await mqttService.start()

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
