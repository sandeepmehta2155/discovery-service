import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatModule } from './cat/cat.module';
import { DiscoveryModule } from './discovery/discovery.module';
import { GatewayController } from './gateway/gateway.controller';

@Module({
  imports: [CatModule, DiscoveryModule],
  controllers: [AppController, GatewayController],
  providers: [AppService],
})
export class AppModule {}
