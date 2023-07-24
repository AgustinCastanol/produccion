/* eslint-disable prettier/prettier */
import { Injectable, Logger } from '@nestjs/common';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { HttpService } from '@nestjs/axios';
import diccionarioPromos from './homologacion';


const API_KEY_WP = 'bgwp_marcou8XoL0b47ImGhZsSuwzHCxX0qC6jQhljhhsGYHjisq57KY2rp37miOZsCNRLt0vtsnNIqn9eZdtyr1OFQGaa2toPTpZgDRqPG9PEWV9onuoS7duFz7DSOO4AWowA4qC4stSnlRZ2BsySBaoKohGhX6MQYKq1uW5WE7VaJ0l0go1omtHVumG4ey4TuLzutcrsujwqbBgmGnMxtMk6ZSKRNT3jKrdqEdzcgHzyz8YU5bPn9KcsJ2PY99v85hP4Gp8cB0qyaYzSIGgY9E4oRgTUJwcWv1Y3GtwmMItNdWWcrU0v8tShVGLbIYGarpVtCbAAAfhSvcnnIdnStO404uBmBKeatlCb5O4l9o7awScqCuRmsHllURQrfCRCFbcuu8KS5pZbV1CtYoKHgIVFxTsKSIIIzTKYcJhceaceROOsMpIKpNQXXBNmg3ovKxaBiA0QeLa1N1plhPCSTzCQaTObrZB1UtXqglwcZ5hPb0cRHgT3yXFRmuwzyrIgUBVthWcOzVDPMflZ0OiP9kVCy4vsfs5ufJANXBmUDQGGYLtJvljImZdtZG1KBnQQd4W1k14GJ4S3bBfoUOMxWVh93hHh96OiZ512r1csceu5yV6BrS4q67NX4dzpoy00XlfTmyADxbOHRljF9ERybNIyeBJjlxO8hyd2E8KLRyVsCyqEkTdgNYbCEtZrX4qI9g7SCCjGgmdtPyDMZsGNlP271kcJzfoouH8W4vSBJ01k9WZkNedVPLAh55YbdQBFyRYaujbenuNUgqXY3lF1N5B9j1TxJ1LiYEhX3BKZxXLic8yNNSOalymqpthaGaNNimC1TorUVdmcx7T7CdxmuGdAm8o6MhabQCKGuEfI6OhS8Am8n09lWfffkvJ23KTacL2UuEhqG2aLB2q3vq9flHAJG7z4zEnZ5oGZ7VwjAUXvqQqiTi3kfNF5LmedecUDFgy21NBXxRzVfS1Lh05ajslpngHkbYS6JKvwRcR2pEfOFwUrd4sOZ58toBsZRf'

const URL_API = 'https://api.cataprom.com/rest';
const collectionOBJ = [
  { id: 'b4995e35-2373-4b36-a3f8-d147f6833a5a', name: 'precio neto' },
  { id: '47ac63e1-42ef-4e49-9ba1-33f1d0050e4d', name: 'precio bruto' },
  { id: '47ac63e1-42ef-4e49-9ba1-33f1d0050e4d', name: 'produccion nacional' },
  { id: '88f91efa-e7f0-4a68-b330-9f3720a738c5', name: 'oferta' }
]
@Injectable()
export class PromosService {
  private readonly logger = new Logger(PromosService.name);
  constructor(private httpService: HttpService) { }

  async getProduct(data: any) {
    try {
      console.log("getProduct",data.referencia)
      console.log("--------------------------")
      const res = <any>await firstValueFrom(
        this.httpService.get(`${URL_API}/productos/${data.referencia}`).pipe(
          catchError((err: AxiosError) => {
            this.logger.error(err.message);
            console.log(err)
            throw new Error(err.message);
          }),
        ),
      );
      if (res.data.resultado) {
        return res.data.resultado;
      }
      return null;
      // const response = await this.httpService.get(`${URL_API}/productos/${data.referencia}`).pipe(
      //   catchError((err: AxiosError) => {
      //     this.logger.error(err.message);
      //     // console.log(err.response.status);
      //     throw new Error(`${err.response.status}`);
      //   }),
      // ).toPromise();
      //   if(response.data){
      //     if(response.data.hayError == true){
      //       return null;
      //     }
      //   }
      // return <any>response.data.resultado;
    } catch (err) {
      console.log("error")
      // console.log(err)
      console.log("error")
      return null
    }
  }
  async getCategories() {
    try {
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
    } catch (err) {
      return { error: err }
    }
  }
  async getStock(data: any) {
    try {
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
      return { error: res };
    } catch (err) {
      return { error: err }
    }
  }
  async getCategoryById(data: number)  {
      try {
        const res = <any>await firstValueFrom(
          this.httpService.get(`${URL_API}/categorias/${data}`).pipe(
            catchError((err: AxiosError) => {
              this.logger.error(err.message);
              throw new Error(`Causa: ${err.config} - codigo: ${err.code} - mensaje: ${err.message}`);
            }),
          ),
        );
        if (res.data.resultado) {
        return <string> await this.getCategoriasHomologadas({nombre: res.data.resultado.nombre})
        }
        return { error: res };
      } catch (err) {
        return { error: err }
      }
  }
  async getProductsByCategory(data: any) {
    /*/categorias/{id}/productos */
    try {
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
    } catch (err) {
      return { error: err };
    }
  }
  async getCategoriasHomologadas(data: any) {
    const categoriaHomologada = diccionarioPromos["homologacion"].find(e => e.nombre == data.nombre);
    return categoriaHomologada.slugAveChildrent === '' ? categoriaHomologada.slugAve : categoriaHomologada.slugAveChildrent;
  }
  async clearName(str: string) {
    try{
      let collection = '';
      str = str.toLowerCase();
      str = str.replace(/\"/g, " ");
      if (str.includes("oferta")) {
        str = str.replace("oferta", "")
        collection = collectionOBJ.find(e => e.name == 'oferta').id;
  
      }
      if (str.includes("produccion nacional")) {
        str = str.replace("produccion nacional", "")
        collection = collectionOBJ.find(e => e.name == 'precio sugerido').id;
      }
      if (str.includes("precio neto")) {
        str = str.replace("precio neto", "")
        collection = collectionOBJ.find(e => e.name == 'precio neto').id;
      }
      if (collection == '') {
        collection = collectionOBJ.find(e => e.name == 'precio sugerido').id;
      }
      return { str, collection };
    }catch(err){
      return {str: str , collection:'47ac63e1-42ef-4e49-9ba1-33f1d0050e4d'}
    }

  }
async validate_CSV(data: any) {
  try{
    const res = <any>await firstValueFrom(
      this.httpService.post(`http://localhost:47300/validate_CSV`,{},{
        headers:{
          'Authorization': API_KEY_WP
        }
      }).pipe(
        catchError((err: AxiosError) => {
          this.logger.error(err.message);
          throw new Error(`Causa: ${err.config} - codigo: ${err.code} - mensaje: ${err.message}`);
        }),
      ),
    );
    console.log(res.data)
    if (res.data) {
      return res.data;
    }
    return { error: res };
  }catch(err){
    return { error: err };
  }
}

}
