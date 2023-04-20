import { Test, TestingModule } from '@nestjs/testing';
import { EsferosService } from './esferos.service';

describe('EsferosService', () => {
  let service: EsferosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EsferosService],
    }).compile();

    service = module.get<EsferosService>(EsferosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
