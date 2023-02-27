import { Module } from '@nestjs/common';
import { MarpicoService } from './marpico.service';
import { HttpModule } from '@nestjs/axios';
@Module({
  providers: [MarpicoService],
  imports: [HttpModule],
})
export class MarpicoModule {}
