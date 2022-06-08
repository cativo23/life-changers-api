import { Test, TestingModule } from '@nestjs/testing';
import { SiteStatController } from './site-stat.controller';
import { SiteStatService } from './site-stat.service';

describe('SiteStatController', () => {
  let controller: SiteStatController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SiteStatController],
      providers: [SiteStatService],
    }).compile();

    controller = module.get<SiteStatController>(SiteStatController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
