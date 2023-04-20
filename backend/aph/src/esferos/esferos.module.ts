import { Module } from '@nestjs/common';
import { EsferosService } from './esferos.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [EsferosService],
})
export class EsferosModule {}
