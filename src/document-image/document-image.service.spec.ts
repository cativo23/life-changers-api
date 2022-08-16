import { Test, TestingModule } from '@nestjs/testing';
import { DocumentImageService } from './document-image.service';

describe('DocumentImageService', () => {
  let service: DocumentImageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DocumentImageService],
    }).compile();

    service = module.get<DocumentImageService>(DocumentImageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
