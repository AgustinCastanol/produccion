import { Module } from '@nestjs/common';
import { PromosService } from './promos.service';
import { HttpModule } from '@nestjs/axios';
@Module({
  imports: [HttpModule],
  providers: [PromosService],
})
export class PromosModule {}
