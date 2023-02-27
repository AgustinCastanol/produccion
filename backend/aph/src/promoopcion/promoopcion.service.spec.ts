import { Test, TestingModule } from '@nestjs/testing';
import { PromoopcionService } from './promoopcion.service';

describe('PromoopcionService', () => {
  let service: PromoopcionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PromoopcionService],
    }).compile();

    service = module.get<PromoopcionService>(PromoopcionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
