import { Test, TestingModule } from '@nestjs/testing';
import { CdoService } from './cdo.service';

describe('CdoService', () => {
  let service: CdoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CdoService],
    }).compile();

    service = module.get<CdoService>(CdoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
