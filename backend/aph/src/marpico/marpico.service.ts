/* eslint-disable prettier/prettier */
import { Injectable, Logger } from '@nestjs/common';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { HttpService } from '@nestjs/axios';
import diccionarioMarpico from './homologacion';
const BASE_URL = 'https://marpicoprod.azurewebsites.net/api/inventarios'
const TOKEN = 'Api-Key BQi4VDHTpt14dCLiDV1iSlO9Xb5FMAL9m3IT5RTnBwzK4cmuqk4gaAZ3tTy1B6Du'
@Injectable()
export class MarpicoService {
  private readonly logger = new Logger(MarpicoService.name);
  constructor(private httpService: HttpService) { }

  async getProducts(product: any) {
    try {
      const res = <any>await firstValueFrom(
        this.httpService.get(`${BASE_URL}/materialesAPI`, {
          headers: {
            'Authorization':TOKEN,
          }
        })
        .pipe(
          catchError((err: AxiosError) => {
            this.logger.error(err.message);
            throw new Error(`Causa: ${err.config} - codigo: ${err.code} - mensaje: ${err.message}`);
          })
        )
      )
      if (res.data) {
        return res.data
      }
      return { error: res };
    } catch (err) {
      return { error: err }

    }
  }
  async getCategoriaHomologada(data: any) {
    try {
      const categoriaHomologada = diccionarioMarpico["homologacion"].find(e => e.nombre == data);
      if(categoriaHomologada == undefined){
        console.log("categoria no homologada", `categoria: -${data}-`)
        return '';
      }
      return categoriaHomologada.slugAvetChildrent == ''? categoriaHomologada.slugAve : categoriaHomologada.slugAvetChildrent;
    } catch (e) {
      console.log("error homologacion", e)
      return '';
    }
  }


}
