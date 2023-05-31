/* eslint-disable prettier/prettier */
import { Injectable, Logger } from '@nestjs/common';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { HttpService } from '@nestjs/axios';
import diccionarioCDO from './homologacion';
const URL_API =
  'http://api.colombia.cdopromocionales.com/v1/products?auth_token=Ukq3UBwcqaKmf9ZGmTkcTg';

@Injectable()
export class CdoService {
  private readonly logger = new Logger(CdoService.name);
  constructor(private httpService: HttpService) { }
  async getProducts() {
    const res = <any>await firstValueFrom(
      this.httpService.get(`${URL_API}`).pipe(
        catchError((err: AxiosError) => {
          this.logger.error(err.message);
          throw ' An error happened!';
        }),
      ),
    );
    if (res.data) {
      return res.data;
    }
    return { error: 'An error happened!' };
  }
  async getCategoriaHomologada(data: any) {
    try {
      // console.log("data", data)
      const categoriaHomologada = diccionarioCDO["homologacion"].find(e => e.nombre == data);
      // console.log("categoriaHomologada", categoriaHomologada)
      if(categoriaHomologada == undefined){
        return '';
      }
      return categoriaHomologada.slugAveChildrent === ''? categoriaHomologada.slugAve : categoriaHomologada.slugAveChildrent;
    } catch (e) {
      console.log("error homologacion", e)
      return '';
    }
  }
}
