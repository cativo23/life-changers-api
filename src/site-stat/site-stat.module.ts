import { Module } from '@nestjs/common';
import { SiteStatService } from './site-stat.service';
import { SiteStatController } from './site-stat.controller';

@Module({
  controllers: [SiteStatController],
  providers: [
    SiteStatService,
  ],
})
export class SiteStatModule {}
