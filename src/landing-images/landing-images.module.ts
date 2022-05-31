import { Module } from '@nestjs/common';
import { LandingImagesService } from './landing-images.service';
import { LandingImagesController } from './landing-images.controller';

@Module({
  controllers: [LandingImagesController],
  providers: [LandingImagesService],
})
export class LandingImagesModule {}
