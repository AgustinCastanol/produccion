/* eslint-disable prettier/prettier */
import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { randomUUID } from 'crypto';

@Injectable()
export class AppService {
  constructor(@Inject('LOGIN_SERVICE') private clienteLogin: ClientProxy) {}

  async home(user: any) {
    const res = await this.clienteLogin.send('home', user).toPromise();
    return res;
  }
  async setFormProduct (form: any) {
    console.log('setFormProduct', form);
    const res = await this.clienteLogin.send('set_form_product', form).toPromise();
    return res;
  }

  async login(user: any) {
    console.log('login', user);
    const res = await this.clienteLogin.send('new_login', user).toPromise();
    return res;
  }
  async getProduct(product: any) {
    const res = await this.clienteLogin
      .send('get_product', product)
      .toPromise();
    return res;
  }
  async searchProduct(product: any) {
    const res = await this.clienteLogin
      .send('search_product', product)
      .toPromise();
    return res;
  }
  async getVariants(product: any) {
    const res = await this.clienteLogin
      .send('get_variants', product)
      .toPromise();
    return res;
  }

  async getProducts(product: any) {
    const res = await this.clienteLogin
      .send('get_products', product)
      .toPromise();
    return res;
  }

  async getCategories(category: any) {
    const res = await this.clienteLogin
      .send('get_categories', category)
      .toPromise();
    return res;
  }

  async setCategory(category: any) {
    const res = await this.clienteLogin
      .send('set_category', category)
      .toPromise();
    return res;
  }
  async getCategory(body: any) {
    const res = await this.clienteLogin.send('get_category', body).toPromise();
    return res;
  }
  async getStockLocation(body: any) {
    const res = await this.clienteLogin
      .send('get_stocks_location', body)
      .toPromise();
    return res;
  }
  async getCollections(collections: any) {
    const res = await this.clienteLogin
      .send('get_collections', collections)
      .toPromise();
    return res;
  }
  async loadCategories() {
    const res = await this.clienteLogin
      .send('load', { data: 'make' })
      .toPromise();
    return res;
  }
  async deleteCategory(category: any) {
    const res = await this.clienteLogin
      .send('delete_category', category)
      .toPromise();
    return res;
  }
  async getProveedores(proveedor: any) {
    const res = await this.clienteLogin
      .send('get_proveedores', proveedor)
      .toPromise();
    return res;
  }
  async getLogs(log: any) {
    const res = await this.clienteLogin.send('get_logs', log).toPromise();
    return res;
  }
  async getProveedor(proveedor: any) {
    const res = await this.clienteLogin
      .send('get_proveedor', proveedor)
      .toPromise();
    return res;
  }
  async getUsers(user: any) {
    const res = {
      data: [
        {
          user: 'test 1',
          email: 'test#1@gmail.com',
          tipoDeUsuario: 'principal',
          role: 'administador',
          img: {
            src: 'https://www.w3schools.com/howto/img_avatar.png',
            alt: 'Avatar',
          },
          text: 'text de prueba',
          description: 'test de descripcion',
          date: '2021-04-18 14:28:01',
          status: {
            pago: 'activo',
            tipoDeCuenta: 'demo',
          },
        },
        {
          user: 'test 2',
          email: 'test#2@gmail.com',
          tipoDeUsuario: 'secundario',
          role: 'administrador',
          img: {
            src: 'https://www.w3schools.com/howto/img_avatar.png',
            alt: 'Avatar',
          },
          text: 'text de prueba',
          description: 'test de descripcion',
          date: '2021-04-18 14:28:01',
          status: {
            pago: 'lead',
            tipoDeCuenta: 'premiun',
          },
        },
        {
          user: 'test 4',
          email: 'test#4@gmail.com',
          tipoDeUsuario: 'secundario',
          role: 'commercial',
          img: {
            src: 'https://www.w3schools.com/howto/img_avatar.png',
            alt: 'Avatar',
          },
          text: 'text de prueba',
          description: 'test de descripcion',
          date: '2021-04-18 14:28:01',
          status: {
            pago: 'lead',
            tipoDeCuenta: 'demo',
          },
        },
        {
          user: 'test 3',
          email: 'test#3@gmail.com',
          tipoDeUsuario: 'secundario',
          role: 'cotizador',
          img: {
            src: 'https://www.w3schools.com/howto/img_avatar.png',
            alt: 'Avatar',
          },
          text: 'text de prueba',
          description: 'test de descripcion',
          date: '2021-04-18 14:28:01',
          status: {
            pago: 'desactivado',
            tipoDeCuenta: 'premium',
          },
        },
        {
          user: 'test 5',
          email: 'test#5@gmail.com',
          tipoDeUsuario: 'principal',
          role: 'administador',
          img: {
            src: 'https://www.w3schools.com/howto/img_avatar.png',
            alt: 'Avatar',
          },
          text: 'text de prueba',
          description: 'test de descripcion',
          date: '2021-04-18 14:28:01',
          status: {
            pago: 'activo',
            tipoDeCuenta: 'gratuita',
          },
        },
      ],
    };
    return res;
  }
  async getUser(user: any) {
    const res = {
      data: [
        {
          user: 'test 5',
          img: {
            src: 'https://www.w3schools.com/howto/img_avatar.png',
            alt: 'Avatar',
          },
          text: 'text de prueba',
          description: 'test de descripcion',
          date: '2021-04-18 14:28:01',
          status: {
            pago: 'activo',
            tipoDeCuenta: 'gratuita',
          },
        },
      ],
    };
    return res;
  }
  async getStocks(data: any) {
    const res = await this.clienteLogin.send('get_stocks', data).toPromise();
    return res;
  }
  async loadApiCdo(data: any) {
    const res = await this.clienteLogin.send('load_api_cdo', data).toPromise();
    return res;
  }
  async loadApiPromos(data: any) {
    const res = await this.clienteLogin
      .send('loadProductsApiPromos', data)
      .toPromise();
    return res;
  }
  async crons(data: any) {
    return {
      data: [
        {
          id: randomUUID(),
          name: 'cronsPromos',
          status: 'Success',
          date: '2021-12-28 14:28:01',
          description: 'crons de promociones',
          errors: [{error: 'Product conflict "Lapíz azul" in field "description"', date: '2021-12-28 14:28:01'}],
        },
        {
          id: randomUUID(),
          name: 'cronsCdo',
          status: 'Error',
          date: '2021-12-28 14:40:20',
          description: 'crons de cdo',
          errors: [{error: 'Category not register "navidad"', date: '2021-12-28 14:40:20'}],
        },
        {
          id: randomUUID(),
          name: 'cronsPromos',
          status: 'Error',
          date: '2022-01-05 08:09:31',
          description: 'crons de promociones',
          errors: [{error: 'Timeout', date: '2022-01-05 08:09:31'}],
        },

        {
          id: randomUUID(),
          name: 'cronsPromos',
          status: 'Success',
          date: '2022-02-03 08:48:33',
          description: 'crons de promociones',
          errors: [],
        },
        {
          id: randomUUID(),
          name: 'cronsCdo',
          status: 'Success',
          date: '2022-02-06 09:22:12',
          description: 'crons de cdo',
          errors: [],
        },

      ],
    };
  }
  async updateCategory(data: any) {
    const res = await this.clienteLogin
      .send('update_category', data)
      .toPromise();
    return res;
  }
  async updateSupplier(data: any) {
    const res = await this.clienteLogin
      .send('update_supplier', data)
      .toPromise();
    return res;
  }
  async setSupplier(data: any) {
    const res = await this.clienteLogin.send('set_proveedor', data).toPromise();
    return res;
  }
  async convertImagesToBase64(data: any) {
  /*convertir una imagen a base 64 */
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(data);
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.onerror = (error) => {
      reject(error);
    };
  });
} 
async apiPromosProducts(data: any) {
  const res = await this.clienteLogin
    .send('api_promos_products', data)
    .toPromise();
    console.log(res,'res')
  return res;
}
async loadApiMarpico(data: any) {
  const res = await this.clienteLogin
    .send('load_api_marpico', data)
    .toPromise();
  return res;
}
async loadApiPromoOpcion(data: any) {
  const res = await this.clienteLogin
    .send('load_api_promoopcion', data)
    .toPromise();
  return res;
}
async loadPricePromoOpcion(data: any) {
  const res = await this.clienteLogin
    .send('load_price_promoopcion', data)
    .toPromise();
  return res;
  }
async processCsv(data: any) {
  const res = await this.clienteLogin.send('process_csv', data).toPromise();
  return res;
}
}