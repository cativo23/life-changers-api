import { Test, TestingModule } from '@nestjs/testing';
import { LandingImagesService } from './landing-images.service';

describe('LandingImagesService', () => {
  let service: LandingImagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LandingImagesService],
    }).compile();

    service = module.get<LandingImagesService>(LandingImagesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
