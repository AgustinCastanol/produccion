/* eslint-disable prettier/prettier */
import { Controller, Body, Post, Query, UseGuards, Res, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { CorsGuard } from './guards/corsGuard';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }
  @UseGuards(CorsGuard)
  @Post('/login')
  // eslint-disable-next-line @typescript-eslint/ban-types
  async newLogin(@Body() body: any): Promise<Object> {
    const res = await this.appService.login(body);
    return { data: res };
  }
  @UseGuards(CorsGuard)
  @Post('/')
  // eslint-disable-next-line @typescript-eslint/ban-types
  async home(@Body() body: any): Promise<Object> {
    const res = await this.appService.home(body);
    return res;
  }
  @UseGuards(CorsGuard)
  @Post('/get_products')
  // eslint-disable-next-line @typescript-eslint/ban-types
  async getProducts(@Body() body: any): Promise<Object> {
    const res = await this.appService.getProducts(body);
    return res;
  }
  @UseGuards(CorsGuard)
  @Post('/get_products/search')
  // eslint-disable-next-line @typescript-eslint/ban-types
  async getProductsSearch(@Body() body: any): Promise<any> {
    const res = await this.appService.searchProduct(body);
    return res;
  }
  @UseGuards(CorsGuard)
  @Post('/get_product')
  // eslint-disable-next-line @typescript-eslint/ban-types
  async getProduct(@Body() body: any): Promise<Object> {
    const res = await this.appService.getProduct(body);
    return res;
  }
  @UseGuards(CorsGuard)
  @Post('/get_variants')
  // eslint-disable-next-line @typescript-eslint/ban-types
  async getVariants(@Body() body: any): Promise<Object> {
    const res = await this.appService.getVariants(body);
    return res;
  }
  @UseGuards(CorsGuard)
  @Post('/get_proveedores')
  // eslint-disable-next-line @typescript-eslint/ban-types
  async getProveedores(@Body() body: any): Promise<Object> {
    const res = await this.appService.getProveedores(body);
    return res;
  }
  @UseGuards(CorsGuard)
  @Post('/get_proveedor')
  // eslint-disable-next-line @typescript-eslint/ban-types
  async getProveedor(@Body() body: any): Promise<Object> {
    const res = await this.appService.getProveedor(body);
    return res;
  }
  @UseGuards(CorsGuard)
  @Post('/get_categories')
  // eslint-disable-next-line @typescript-eslint/ban-types
  async getCategories(@Body() body: any): Promise<Object> {
    const res = await this.appService.getCategories(body);
    return res;
  }
  @UseGuards(CorsGuard)
  @Post('/set_category')
  // eslint-disable-next-line @typescript-eslint/ban-types
  async setCategory(@Body() body: any): Promise<Object> {
    const res = await this.appService.setCategory(body);
    return { data: "ok" };
  }
  @UseGuards(CorsGuard)
  @Post('/get_category')
  // eslint-disable-next-line @typescript-eslint/ban-types
  async getCategory(@Body() body: any): Promise<Object> {
    const res = await this.appService.getCategory(body);
    return res;
  }
  @UseGuards(CorsGuard)
  @Post('/delete_category')
  // eslint-disable-next-line @typescript-eslint/ban-types
  async deleteCategory(@Body() body: any): Promise<Object> {
    const res = await this.appService.deleteCategory(body);
    return res;
  }
  @UseGuards(CorsGuard)
  @Post('/get_users')
  // eslint-disable-next-line @typescript-eslint/ban-types
  async getUsers(@Body() body: any): Promise<Object> {
    const res = await this.appService.getUsers(body);
    return res;
  }
  @UseGuards(CorsGuard)
  @Post('/get_user')
  // eslint-disable-next-line @typescript-eslint/ban-types
  async getUser(@Body() body: any): Promise<Object> {
    const res = await this.appService.getUser(body);
    return res;
  }
  @UseGuards(CorsGuard)
  @Post('/edit_user')
  // eslint-disable-next-line @typescript-eslint/ban-types
  async editUser(@Body() body: any): Promise<Object> {
    // const res = await this.appService.editUser(body);
    return { data: { message: 'edicion exitosa', stat: 200 } };
  }
  @UseGuards(CorsGuard)
  @Post('/get_logs')
  // eslint-disable-next-line @typescript-eslint/ban-types
  async getLogs(@Body() body: any): Promise<Object> {
    const res = await this.appService.getLogs(body);
    return res;
  }
  @UseGuards(CorsGuard)
  @Post('/getStocks')
  // eslint-disable-next-line @typescript-eslint/ban-types
  async getStocks(@Body() body: any): Promise<Object> {
    const res = await this.appService.getStocks(body);
    return res;
  }
  @UseGuards(CorsGuard)
  @Post('/loadApiCdo')
  // eslint-disable-next-line @typescript-eslint/ban-types
  async loadApiCdo(@Body() body: any): Promise<Object> {
    const res = await this.appService.loadApiCdo(body);
    return res;
  }
  @UseGuards(CorsGuard)
  @Post('/loadApiPromos')
  // eslint-disable-next-line @typescript-eslint/ban-types
  async loadApiPromos(@Body() body: any): Promise<Object> {
    const res = await this.appService.loadApiPromos(body);
    console.log(res)
    return res;
  }
  @UseGuards(CorsGuard)
  @Post('/crons')
  // eslint-disable-next-line @typescript-eslint/ban-types
  async crons(@Body() body: any): Promise<Object> {
    const res = await this.appService.crons(body);
    return res;
  }
  @UseGuards(CorsGuard)
  @Post('/update_category')
  // eslint-disable-next-line @typescript-eslint/ban-types
  async updateCategory(@Body() body: any): Promise<Object> {
    const res = await this.appService.updateCategory(body);
    return res;
  }
  @UseGuards(CorsGuard)
  @Post('/update_supplier')
  // eslint-disable-next-line @typescript-eslint/ban-types
  async updateSupplier(@Body() body: any): Promise<Object> {
    const res = await this.appService.updateSupplier(body);
    return res;
  }
  @UseGuards(CorsGuard)
  @Post('/set_supplier')
  // eslint-disable-next-line @typescript-eslint/ban-types
  async setSupplier(@Body() body: any): Promise<Object> {
    const res = await this.appService.setSupplier(body);
    return res;
  }
  @UseGuards(CorsGuard)
  @Post('/run_crons')
  // eslint-disable-next-line @typescript-eslint/ban-types
  async runCrons(@Body() body: any): Promise<Object> {
    if (body.code == 'cronsPromos') {
      const res = await this.appService.loadApiPromos(body);
      return res;
    }
    if (body.code == 'cronsCdo') {
      const res = await this.appService.loadApiCdo(body);
      return res;
    }
  }
  @UseGuards(CorsGuard)
  @Post('/get_collections')
  // eslint-disable-next-line @typescript-eslint/ban-types
  async getCollections(@Body() body: any): Promise<Object> {
    const res = await this.appService.getCollections(body);
    return res;
  }
  @UseGuards(CorsGuard)
  @Post('/get_stocks_locations')
  // eslint-disable-next-line @typescript-eslint/ban-types
  async getStocksLocations(@Body() body: any): Promise<Object> {
    const res = await this.appService.getStockLocation(body);
    return res;
  }
  @UseGuards(CorsGuard)
  @Post('/set_product_form')
  // eslint-disable-next-line @typescript-eslint/ban-types
  async setFormProduct(@Body() body: any): Promise<Object> {
    const res = await this.appService.setFormProduct(body);
    return res;
  }
  @UseGuards(CorsGuard)
  @Post('/convert_images_to_base64')
  // eslint-disable-next-line @typescript-eslint/ban-types
  async convertImagesToBase64(@Body() body: any): Promise<Object> {
    const res = await this.appService.convertImagesToBase64(body);
    return res;
  }
  @UseGuards(CorsGuard)
  @Post('/apiPromosProducts')
  // eslint-disable-next-line @typescript-eslint/ban-types
  async apiPromosProducts(@Body() body: any, @Req() require: any): Promise<Object> {
    console.log(require.hostname)
    const res = await this.appService.apiPromosProducts(body);
    return { res };
  }
  @UseGuards(CorsGuard)
  @Post('/loadApiMarpico')
  // eslint-disable-next-line @typescript-eslint/ban-types
  async loadApiMarpico(@Body() body: any): Promise<Object> {
    const res = await this.appService.loadApiMarpico(body);
    return res;
  }
  @UseGuards(CorsGuard)
  @Post('/loadApiPromoOpcion')
  // eslint-disable-next-line @typescript-eslint/ban-types
  async loadApiPromoOpcion(@Body() body: any): Promise<Object> {
    const res = await this.appService.loadApiPromoOpcion(body);
    return res;
  }
  @UseGuards(CorsGuard)
  @Post('/loadPricePromoOpcion')
  async loadPricePromoOpcion(@Body() body: any): Promise<any> {
    const res = await this.appService.loadPricePromoOpcion(body);
    return res;
  }
  @UseGuards(CorsGuard)
  @Post('/processCsv')
  async processCsv(@Body() body: any): Promise<any> {
    const res = await this.appService.processCsv(body);
    return res;
  }
  @UseGuards(CorsGuard)
  @Post('/procesCsvProducts')
  async processCsvProducts(@Body() body: any): Promise<any> {
    const res = await this.appService.processCsvProducts(body);
    return res;
  }
}
