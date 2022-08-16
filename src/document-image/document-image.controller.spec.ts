import { Test, TestingModule } from '@nestjs/testing';
import { DocumentImageController } from './document-image.controller';
import { DocumentImageService } from './document-image.service';

describe('DocumentImageController', () => {
  let controller: DocumentImageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentImageController],
      providers: [DocumentImageService],
    }).compile();

    controller = module.get<DocumentImageController>(DocumentImageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
