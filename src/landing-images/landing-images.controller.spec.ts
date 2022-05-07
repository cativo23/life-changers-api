import { Test, TestingModule } from '@nestjs/testing';
import { LandingImagesController } from './landing-images.controller';
import { LandingImagesService } from './landing-images.service';

describe('LandingImagesController', () => {
  let controller: LandingImagesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LandingImagesController],
      providers: [LandingImagesService],
    }).compile();

    controller = module.get<LandingImagesController>(LandingImagesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
