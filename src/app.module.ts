import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatModule } from './cat/cat.module';
import { DiscoveryModule } from './discovery/discovery.module';

@Module({
  imports: [CatModule, DiscoveryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
