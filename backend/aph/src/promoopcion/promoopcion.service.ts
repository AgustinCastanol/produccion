/* eslint-disable no-var */
/* eslint-disable prettier/prettier */
import { Injectable, Logger, StreamableFile } from '@nestjs/common';
import { catchError, firstValueFrom, pipe } from 'rxjs';
import { AxiosError } from 'axios';
import { HttpService } from '@nestjs/axios';
import * as csv from 'csv-parser';
import * as https from "https";
import diccionarioPromo from './homologacion';
import { createReadStream } from 'fs';
import { join } from 'path';
const URL_API_PRODUCTS = 'https://promocionalesenlinea.net/api/all-products';
const URL_API_EXISTENCIAS = 'https://promocionalesenlinea.net/api/all-stocks'
const USER = 'COL0073';
const PASS = 'Vhfp68PO73yuQsFliOF5';
@Injectable()
export class PromoopcionService {
  private readonly logger = new Logger(PromoopcionService.name);
  constructor(
    private readonly httpService: HttpService,
  ) { }
  async getExistencias(data: any) {
    try {
      const formData = {
        user: USER,
        password: PASS,
      }
      const httpsAgent = new https.Agent({
        rejectUnauthorized: false,
      });
      const response = <any>await firstValueFrom(
        this.httpService.post(URL_API_EXISTENCIAS, formData, {
          headers: {
            'Content-Type': 'multipart/form-data; boundary=<calculated when request is sent>',
          }, httpsAgent
        }).pipe(
          catchError((err: AxiosError) => {
            this.logger.error(err.message);
            throw new Error(`Causa: ${err.config} - codigo: ${err.code} - mensaje: ${err.message}`);
          }),
        )
      );
      if (response.data) {
        return response.data;
      }
    } catch (err) {
      console.log(err)
      return 'error';
    }

  }
  async getProducts(data: any) {
    try {
      const formData = {
        user: USER,
        password: PASS,
      }
      const httpsAgent = new https.Agent({
        rejectUnauthorized: false,
      });
      const response = <any>await firstValueFrom(
        this.httpService.post(URL_API_PRODUCTS, formData, {
          headers: {
            'Content-Type': 'multipart/form-data; boundary=<calculated when request is sent>',
          }, httpsAgent
        }).pipe(
          catchError((err: AxiosError) => {
            this.logger.error(err.message);
            throw new Error(`Causa: ${err.config} - codigo: ${err.code} - mensaje: ${err.message}`);
          }),
        )
      );
      if (response.data) {
        return response.data;
      }
    } catch (err) {
      console.log(err)
      return 'error';
    }

  }

  async getCategoriaHomologada(data: any) {
    try {
      const categoriaHomologada = <any>diccionarioPromo["homologacion"].find(e => e.nombre == data);
      if (categoriaHomologada == undefined) {
        console.log("categoria no homologada", `categoria: -${data}-`)
        return '';
      }
      return categoriaHomologada.slugAveChildrent == '' ? categoriaHomologada.slugAve : categoriaHomologada.slugAveChildrent;
    } catch (e) {
      console.log("error homologacion", e)
      return '';
    }
  }
  async getJsonPrice(data: any) : Promise<any> {
    try {
      /*tengo un archivo csv en ./preciosPromoOpcion.csv y quiero hacerlo un json */
      var file = [];
      const dir = createReadStream(join(process.cwd(), './src/promoopcion/preciosPromoOpcion.csv'))
        .pipe(csv())
        .on('data', (row: {
          "sku": string,
          "precio": string,
          "referencia": string,
          "nombre": string,
          "tipo": string,
        }) => {
          file.push(row);
        })
        .on('end', () => {
          console.log('CSV file successfully processed');
        });
      await new Promise(resolve => setTimeout(resolve, 1000));
      return file
    } catch (err) {
      console.log(err)
      return 'error';
    }
  }
}
