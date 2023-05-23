/* eslint-disable prettier/prettier */
import { Injectable, Logger } from '@nestjs/common';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { HttpService } from '@nestjs/axios';
import categorias from './homologacion'
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
  async getStockById(stock: string){
    try{
      const res = <any>await firstValueFrom(
        this.httpService.get(`${URL_API}/stock_availables/${stock}`, {
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
  async getCategoryById(id: string){
    try{
      const res = <any>await firstValueFrom(
        this.httpService.get(`${URL_API}/categories/${id}`, {
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
  async getImageById(id: string,idProduct: string){
    try{
      const res = <any>await firstValueFrom(
        this.httpService.get(`${URL_API}images/products/${idProduct}/${id}`, {
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
  async getImageByURL(url: string){
    try{
      const res = <any>await firstValueFrom(
        this.httpService.get(`${url}`, {
          auth:{
            username: USER,
            password: ''
          },
          responseType: 'arraybuffer'
        }).pipe(
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

  async getCombinatiosById(id: string){
    try{
      const res = <any>await firstValueFrom(
        this.httpService.get(`${URL_API}/combinations/${id}`, {
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
  async getPropsById(id: string){
    try{
      const res = <any>await firstValueFrom(
        this.httpService.get(`${URL_API}/product_option_values/${id}`, {
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
  async getCategoriasHomologadas(category:string):Promise<{error:string,name:string, ave:string}>{
    try{
      console.log(category)
      const res = categorias["homologacion"].find(cat => cat.name === category);
      if(res){
        return {error:'',name:res.name,ave:res.ave};
      }
      return {error: 'Categoria no encontrada',name:'',ave:''};

    }catch(error){
      return {error,name:'',ave:''};
    }
  }
  async clearTagsHtml(text: string){
    try{
      const res = text.replace(/<\/?[^>]+(>|$)/gi, "");
      return res;
    }catch(error){
      return {error};
    }
  }
}
