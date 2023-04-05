/* eslint-disable prettier/prettier */
import { Injectable, Logger } from '@nestjs/common';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { HttpService } from '@nestjs/axios';

const URL_API = 'https://esferos.com/site/api/';
const USER = 'DKLL9S98JGMC4RRGLQF2Z4Z2J1RTLJ3N'
@Injectable()
export class EsferosService {
  private readonly logger = new Logger(EsferosService.name);
  constructor(private httpService: HttpService) { }

  async getProducts(){
    try{
      const res = <any>await firstValueFrom(
        this.httpService.get(`${URL_API}/products`, {
          auth:{
            username: USER,
            password: ''
          }}).pipe(
          catchError((err: AxiosError) => {
            this.logger.error(err.message);
            throw new Error(`Causa: ${err.config} - codigo: ${err.code} - mensaje: ${err.message}`);
          }
        )
      ));
      if(res.data){
        return res.data;
      }
      return {error: res};

    }catch(error){
      return {error};
    }
  }
  async getProductById(id: string){
    try{
      const res = <any>await firstValueFrom(
        this.httpService.get(`${URL_API}/products/${id}`, {
          auth:{
            username: USER,
            password: ''
          }}).pipe(
          catchError((err: AxiosError) => {
            this.logger.error(err.message);
            throw new Error(`Causa: ${err.config} - codigo: ${err.code} - mensaje: ${err.message}`);
          }
        )
      ));
      if(res.data){
        return res.data;
      }
      return {error: res};

    }catch(error){
      return {error};
    }
  }
}
