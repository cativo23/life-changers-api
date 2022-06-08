import { Test, TestingModule } from '@nestjs/testing';
import { SiteStatService } from './site-stat.service';

describe('SiteStatService', () => {
  let service: SiteStatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SiteStatService],
    }).compile();

    service = module.get<SiteStatService>(SiteStatService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
