import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { HttpModule } from '@nestjs/axios';
import { PromosModule } from './promos/promos.module';
import { PromosService } from './promos/promos.service';
import { CdoModule } from './cdo/cdo.module';
import { CdoService } from './cdo/cdo.service';
import { MarpicoModule } from './marpico/marpico.module';
import { MarpicoService } from './marpico/marpico.service';
import { PromoopcionService } from './promoopcion/promoopcion.service';
import { PromoopcionModule } from './promoopcion/promoopcion.module';
@Module({
  imports: [
    ConfigModule.forRoot(),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: `${process.env.db_postgres_host}`,
      port: parseInt(`${process.env.db_postgres_port}`),
      username: `${process.env.db_postgres_user}`,
      password: `${process.env.db_postgres_pass}`,
      database: `${process.env.db_postgres_db}`,
      autoLoadModels: true,
      synchronize: true,
    }),
    HttpModule,
    PromosModule,
    CdoModule,
    MarpicoModule,
    PromoopcionModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PromosService,
    CdoService,
    MarpicoService,
    PromoopcionService,
    PromoopcionService,
  ],
})
export class AppModule {}
