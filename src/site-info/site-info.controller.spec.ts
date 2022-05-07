import { Test, TestingModule } from '@nestjs/testing';
import { SiteInfoController } from './site-info.controller';
import { SiteInfoService } from './site-info.service';

describe('SiteInfoController', () => {
  let controller: SiteInfoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SiteInfoController],
      providers: [SiteInfoService],
    }).compile();

    controller = module.get<SiteInfoController>(SiteInfoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
