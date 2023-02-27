import { Module } from '@nestjs/common';
import { CdoService } from './cdo.service';
import { HttpModule } from '@nestjs/axios';

@Module({ imports: [HttpModule], providers: [CdoService] })
export class CdoModule {}
