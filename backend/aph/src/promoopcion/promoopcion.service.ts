/* eslint-disable prettier/prettier */
import { Injectable, Logger, } from '@nestjs/common';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { HttpService } from '@nestjs/axios';
import { Inject } from '@nestjs/common/decorators';
import * as https from "https";
import diccionarioPromo from './homologacion';
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
      const response = <any> await firstValueFrom(
        this.httpService.post(URL_API_EXISTENCIAS, formData,{
          headers: {
            'Content-Type': 'multipart/form-data; boundary=<calculated when request is sent>',
          },httpsAgent}).pipe(
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
      const response = <any> await firstValueFrom(
        this.httpService.post(URL_API_PRODUCTS, formData,{
          headers: {
            'Content-Type': 'multipart/form-data; boundary=<calculated when request is sent>',
          },httpsAgent}).pipe(
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
      if(categoriaHomologada == undefined){
        console.log("categoria no homologada", `categoria: -${data}-`)
        return '';
      }
      return categoriaHomologada.slugAveChildrent == ''? categoriaHomologada.slugAve : categoriaHomologada.slugAveChildrent;
    } catch (e) {
      console.log("error homologacion", e)
      return '';
    }
  }
}
