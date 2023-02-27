/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PromoopcionService } from './promoopcion.service';
import { ConfigModule } from '@nestjs/config';

const URL_API =
  'http://desktop.promoopcion.com:8095/wsFullFilmentCol/FullFilmentColombia.asmx?wsdl';

@Module({
  imports: [
    HttpModule,
  ],
  providers: [PromoopcionService],
})
export class PromoopcionModule {}
