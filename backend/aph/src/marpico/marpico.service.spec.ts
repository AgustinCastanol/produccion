import { Test, TestingModule } from '@nestjs/testing';
import { MarpicoService } from './marpico.service';

describe('MarpicoService', () => {
  let service: MarpicoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MarpicoService],
    }).compile();

    service = module.get<MarpicoService>(MarpicoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
