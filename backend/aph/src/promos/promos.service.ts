/* eslint-disable prettier/prettier */
import { Injectable, Logger } from '@nestjs/common';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { HttpService } from '@nestjs/axios';
import diccionarioPromos from './homologacion';

const URL_API = 'https://api.cataprom.com/rest';
const collectionOBJ=[
  {id:'b4995e35-2373-4b36-a3f8-d147f6833a5a',name:'precio neto'},
  {id:'cdf316a6-12f6-4303-8474-23505961e0d2',name:'precio bruto'},
  {id:'47ac63e1-42ef-4e49-9ba1-33f1d0050e4d',name:'produccion nacional'},
  {id:'88f91efa-e7f0-4a68-b330-9f3720a738c5',name:'oferta'}
]
@Injectable()
export class PromosService {
  private readonly logger = new Logger(PromosService.name);
  constructor(private httpService: HttpService) { }

  async getProduct(data: any) {
try{
  const res = <any>await firstValueFrom(
    this.httpService.get(`${URL_API}/productos/${data.referencia}`).pipe(
      catchError((err: AxiosError) => {
        this.logger.error(err.message);
        throw new Error(`Causa: ${err.config} - codigo: ${err.code} - mensaje: ${err.message}`);
      }),
    ),
  );
  if (res.data.resultado) {
    return res.data.resultado;
  }
  return { error: res };
}catch(err){
  return { error: err }
}
  }
  async getCategories() {
try{
  const res = <any>await firstValueFrom(
    this.httpService.get(`${URL_API}/categorias`).pipe(
      catchError((err: AxiosError) => {
        this.logger.error(err.message);
        throw new Error(`Causa: ${err.config} - codigo: ${err.code} - mensaje: ${err.message}`);
      }),
    ),
  );
  if (res.data.resultado) {
    return res.data.resultado;
  }
  return { error: res };
}catch(err){
  return { error: err }
}
  }
  async getStock(data: any) {
    try{
      const res = <any>await firstValueFrom(
        this.httpService.get(`${URL_API}/stock/${data.referencia}`).pipe(
          catchError((err: AxiosError) => {
            this.logger.error(err.message);
            throw new Error(`Causa: ${err.config} - codigo: ${err.code} - mensaje: ${err.message}`);
          }),
        ),
      );
      if (res.data.resultado) {
        return res.data.resultado;
      }
      return { error:res };
    }catch(err){
      return { error: err }
    }
  }

  async getProductsByCategory(data: any) {
    /*/categorias/{id}/productos */
    try{
      const res = <any>await firstValueFrom(
        this.httpService.get(`${URL_API}/categorias/${data.id}/productos`).pipe(
          catchError((err: AxiosError) => {
            this.logger.error(err.message);
            throw ' An error happened!';
          }),
        ),
      );
      if (res.data.resultado) {
        return res.data.resultado;
      }
      return { error: res };
    }catch(err){
      return { error: err };
    }
  }
  async getCategoriasHomologadas(data: any) {
    const categoriaHomologada = diccionarioPromos["homologacion"].find(e => e.nombre == data.nombre);
    return categoriaHomologada.slugAveChildrent === '' ? categoriaHomologada.slugAve : categoriaHomologada.slugAveChildrent;
  }
  async clearName(str: string) {
    let collection = '';
    str = str.toLowerCase();
    str = str.replace(/\"/g, " ");
    if (str.includes("oferta")) {
      str = str.replace("oferta", "")
      collection= collectionOBJ.find(e=>e.name=='oferta').id;
    }
    if (str.includes("produccion nacional")) {
      str = str.replace("produccion nacional", "")
      collection= collectionOBJ.find(e=>e.name=='produccion nacional').id;
    }
    if (str.includes("precio neto")) {
      str = str.replace("precio neto", "")
      collection= collectionOBJ.find(e=>e.name=='precio neto').id;
    }
    if(collection==''){
      collection = collectionOBJ.find(e=>e.name=='precio bruto').id;
    }
    return {str,collection};

  }

}
