/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { EventPattern } from '@nestjs/microservices';
import { PromosService } from './promos/promos.service';
import { find, findIndex } from 'rxjs';
import { CdoService } from './cdo/cdo.service';
import { MarpicoService } from './marpico/marpico.service';
import { PromoopcionService } from './promoopcion/promoopcion.service';
import { EsferosService } from './esferos/esferos.service';
import { DOMParser } from '@xmldom/xmldom';
import fs, { readFileSync, writeFileSync } from 'fs';
@Controller()
export class AppController {
  constructor(
    private readonly aphService: AppService,
    private readonly promos: PromosService,
    private readonly cdoService: CdoService,
    private readonly marpicoService: MarpicoService,
    private readonly promosOpcion: PromoopcionService,
    private readonly esferosService: EsferosService,
  ) { }
  @EventPattern('home')
  async handleHome(data: any) {
    const res = await this.aphService.home(data);
    const count = await this.aphService.getCountPRoveedores(data);
    return { res, countProductsSuppliers: count};
  }
  @EventPattern('get_logs')
  async handleGetLogs(data: any) {
    const res = await this.aphService.getLogs(data);
    return res;
  }
  @EventPattern('get_products')
  async handleGetProducts(data: any) {
    const res = await this.aphService.getProducts(data);
    return res;
  }
  @EventPattern('api_promos_products')
  async handleApiPromosProducts(data: any) {

    // const categorias = await this.promos.getCategories();

    // let count = 0;
    // for (let i = 0; i < categorias.length; i++) {
    //   const productos = await this.promos.getProductsByCategory(categorias[i]);
    //   await new Promise((resolve) => setTimeout(resolve, 200));
    //   categorias[i].productos = productos;
    //   count += productos.length;
    //   console.log(count, categorias[i].nombre + " : " + productos.length);
    // }

    // return { count };
    const products = await this.promos.getProductsByCategory({id:71});
    const references = products[1659];
    return references;
  }

  @EventPattern('get_stocks')
  async handleGetStock(data: any) {
    const res = await this.aphService.getStocks(data);
    return res;
  }
  @EventPattern('get_stocks_location')
  async handleGetStockByLocation(data: any) {
    const res = await this.aphService.getStocksByLocation(data);
    return res;
  }
  @EventPattern('get_product')
  async handleGetProduct(data: any) {
    const res = await this.aphService.getProduct(data);
    return res;
  }
  @EventPattern('search_product')
  async handleSearchProduct(data: any) {
    const res = await this.aphService.searchProduct(data);
    return res;
  }
  @EventPattern('get_variants')
  async handleGetVariants(data: any) {
    const res = await this.aphService.getVariants(data);
    return res;
  }
  @EventPattern('get_proveedores')
  async handleGetProveedores(data: any) {
    const res = await this.aphService.getProveedores(data);
    const count = await this.aphService.getCountPRoveedores(data);
    return { res, count };
  }
  @EventPattern('update_category')
  async handleUpdateCategory(data: any) {
    const res = await this.aphService.updateCategory(data);
    return res;
  }
  @EventPattern('get_collections')
  async handleGetCollections(data: any) {
    const res = await this.aphService.getCollections(data);
    return res;
  }

  @EventPattern('get_proveedor')
  async handleGetProveedor(data: any) {
    const res = await this.aphService.getProveedor(data);
    return res;
  }
  @EventPattern('set_proveedor')
  async handleSetProveedor(data: any) {
    const res = await this.aphService.setProveedor(data);
    return res;
  }

  @EventPattern('update_supplier')
  async handleUpdateSupplier(data: any) {
    const res = await this.aphService.updateSupplier(data);
    return res;
  }

  @EventPattern('get_categories')
  async handleGetCategories(data: any) {
    const res = await this.aphService.getCategories(data);
    return res;
  }
  @EventPattern('set_category')
  async handleSetCategory(data: any) {
    const res = await this.aphService.setCategory(data);
    return res;
  }
  @EventPattern('get_category')
  async handleGetCategory(data: any) {
    console.log(data)
    const res = await this.aphService.getCategory(data);
    return res;
  }
  @EventPattern('loadProductsApiPromos')
  async handleLoads() {
    try {
      const proveedor = '5691faaf-9ef8-4c64-8264-9ef99b6d8334'
      // eslint-disable-next-line no-var
      var errores = [{ categorias: null, products: [{}], err: '' }]
      // eslint-disable-next-line no-var
      var err_categorias = []
      // eslint-disable-next-line no-var
      var categorias_cargadas = []
      const locations = [
        { id: '0994b3d5-becd-401f-983f-47447352ce19', name: 'local' },
        { id: '9b245cdf-acc8-4655-9738-ee432f654e20', name: 'ZonaFranca' },
        { id: 'a5db0dfa-2d96-4950-b382-839b3acfd6ae', name: 'transito' },
        { id: '3b257993-638c-4505-ad1d-5a6dd24d9ac5', name: 'total' },
      ]
      const base_url_image = 'https://www.catalogospromocionales.com'
      const categorias = await this.promos.getCategories();
      for (let i = 0; categorias.length > i; i++) {
        await new Promise((resolve) => setTimeout(resolve, 300));
        const categoriaHomologada = <any>await this.promos.getCategoriasHomologadas(categorias[i]);
        const categorias_aph = await this.aphService.getCategoryBySlug({ slug: categoriaHomologada });
        if (categorias_aph != undefined && (categorias_aph.id_categorias !== undefined || categorias_aph.id_categorias !== null)) {
          const products = await this.promos.getProductsByCategory(categorias[i]);
          const size = products.length
          for (let j = 0; size > j; j++) {
            try {
              await new Promise((resolve) => setTimeout(resolve, 300));
              const checkProduct = await this.aphService.checkProduct(products[j].referencia)
              if (!(checkProduct.length > 0)) {
                const producto_promos = await this.promos.getProduct({ referencia: products[j].referencia });
                console.log(producto_promos)
                const aux = await this.promos.clearName(producto_promos.nombre);
                const price = producto_promos.descripcionPrecio1 == "precio neto" ? producto_promos.precio1 : 0;
                await new Promise((resolve) => setTimeout(resolve, 100));
                const true_category = await this.promos.getCategoryById(producto_promos.idCategoria);
                const category = await this.aphService.getCategoryBySlug({ slug: true_category });
               
                const productaux = {
                  nombre: aux.str,
                  referencia: producto_promos.referencia,
                  description_product: producto_promos.descripcionProducto.replace(/(\r\n|\n|\r)/igm, "").replace(/"/ig, '\\"').replace(/(<([^>]+)>)/ig, ""),
                  metadata: null,
                  precio: producto_promos.precio1,
                  channel: 'promocionales',
                  disponible: true,
                  is_published: true,
                  peso: 0,
                  category_id: category || categorias_aph.id_categorias,
                  product_class_id: null,
                  proveedor: proveedor,
                  price: null,
                  collection_id: aux.collection
                }
                console.log("setear precio")
                const price_db = await this.aphService.setPrice({
                  price,
                  currency: 'COP',
                  type: 'Precio Neto',
                  metadata: { precioSugerido: producto_promos.descripcionPrecio1 == "precio neto" ? 0 : producto_promos.precio1 },
                  productId: null
                });
                productaux.price = price_db.id_price;
                console.log("setear producto")
                const productDB = await this.aphService.setProduct(productaux);
                console.log(productDB)
                await new Promise((resolve) => setTimeout(resolve, 100));
                price_db.productId = productDB.id_productos;
                console.log("setear precio actualizado")
                await this.aphService.updatePrice(price_db);
                const images_array = producto_promos.imagenes.map((e: string) => 'https:' + e)
                images_array.push(base_url_image + producto_promos.imageUrl)
                await this.aphService.setProductImage({ productId: productDB.idProducts, url: JSON.stringify(images_array) })
                await new Promise((resolve) => setTimeout(resolve, 300));
                const variants = await this.promos.getStock(products[j]);

                for (let k = 0; variants.length > k; k++) {
                  const productVariant = {
                    name_variants: variants[k].referencia + '-' + variants[k].color,
                    metadata_variants: {},
                    price_override: variants[k].precio != undefined ? variants[k].precio : 0,
                    weight_override: variants[k].peso != undefined ? variants[k].peso : 0,
                    sku: variants[k].referencia + '-' + variants[k].color,
                    description_variant: variants[k].estadoOrden,
                    brand: variants[k].marca != undefined ? variants[k].marca : 'not-brand',
                    product_id: productDB.id_productos,
                  }
                  const variant_db = await this.aphService.setVariant(productVariant);
                  await this.aphService.setStock({ locationId: locations[0].id, quantity: variants[k].bodegaLocal, variant_id: variant_db.id_variant, quantity_allocated: 0 });
                  await this.aphService.setStock({ locationId: locations[1].id, quantity: variants[k].bodegaZonaFranca, variant_id: variant_db.id_variant, quantity_allocated: 0 });
                  await this.aphService.setStock({ locationId: locations[3].id, quantity: variants[k].totalDisponible, variant_id: variant_db.id_variant, quantity_allocated: 0 });

                }
              } else {
                /*actualizo el precio */
                console.log("updatePrice")
                await new Promise((resolve) => setTimeout(resolve, 150));
                const producto_promos = await this.promos.getProduct({ referencia: products[j].referencia });
                const true_category = await this.promos.getCategoryById(producto_promos.idCategoria);
                await new Promise((resolve) => setTimeout(resolve, 150));
                const category = await this.aphService.getCategoryBySlug({ slug: true_category });
                // console.log("category", category)
                const product_db = checkProduct[0];
                const price_db = await this.aphService.getPrice({ id: product_db.idProducts });
                await this.aphService.updatePrice(
                  {
                    id: price_db[0].id,
                    type: 'Precio Neto',
                    metadata: JSON.stringify({ precioSugerido: producto_promos.descripcionPrecio1 == "precio neto" ? 0 : producto_promos.precio1 }),
                    currency: 'COP',
                    price: producto_promos.descripcionPrecio1 == "precio neto" ? producto_promos.precio1 : 0,
                    productId: price_db[0].productId
                  })
                  console.log(category, "category")
                  product_db.category_id = category == undefined ? categorias_aph.id_categorias : category.id_categorias;   
                  product_db.description_product= producto_promos.descripcionProducto.replace(/(\r\n|\n|\r)/igm, "").replace(/"/ig, '\\"').replace(/(<([^>]+)>)/ig, "");
                await this.aphService.updateProduct(product_db)
                await new Promise((resolve) => setTimeout(resolve, 300));
                const variants = await this.promos.getStock(products[j]);
                for (let k = 0; variants.length > k; k++) {
                  const variant_db = <any>await this.aphService.getVariantBySku({ sku: variants[k].referencia + '-' + variants[k].color });
                  if (variant_db.length == 0) {
                    const productVariant = {
                      name_variants: variants[k].referencia + '-' + variants[k].color,
                      metadata_variant: {},
                      price_override: 0,
                      weight_override: variants[k].peso != undefined ? variants[k].peso : 0,
                      sku: variants[k].referencia + '-' + variants[k].color,
                      description_variant: variants[k].estadoOrden,
                      brand: variants[k].marca != undefined ? variants[k].marca : 'not-brand',
                      product_id: product_db.idProducts,
                    }
                    if (products[j].descripcionPrecio1 == 'precio neto') {
                      productVariant.price_override = 0;
                    } else {
                      const regex = /\d+GB/g;
                      const str = variants[k].color.replace(/\s+/g, '');
                      const found = str.match(regex);
                      if (found) {
                        for (let x = 1; x < 6; x++) {
                          if ((producto_promos['descripcionPrecio' + x].replace(/\s+/g, '')).includes(found[0])) {
                            productVariant.price_override = products[j]['precio' + x];
                            productVariant.description_variant = products[j]['descripcionPrecio' + x];
                            if (products[j]['descripcionPrecio' + x].toLowerCase().includes('precio neto')) {
                              productVariant.metadata_variant = { type: 'Precio Neto' };
                            }
                          }
                          break;
                        }
                      }
                    }
                    await new Promise((resolve) => setTimeout(resolve, 100));
                    const new_variant = await this.aphService.setVariant(productVariant);
                    await this.aphService.setStock({ locationId: locations[0].id, quantity: variants[k].bodegaLocal, variant_id: new_variant.id_variant, quantity_allocated: 0 });
                    await this.aphService.setStock({ locationId: locations[1].id, quantity: variants[k].bodegaZonaFranca, variant_id: new_variant.id_variant, quantity_allocated: 0 });
                    await this.aphService.setStock({ locationId: locations[3].id, quantity: variants[k].totalDisponible, variant_id: new_variant.id_variant, quantity_allocated: 0 });
                  }
                  if (variant_db.length != 0) {
                    if (producto_promos.descripcionPrecio1 == 'precio neto') {
                      variant_db[0].price_override = 0;
                    } else {
                      const regex = /\d+GB/g;
                      const str = variant_db[0].sku.replace(/\s+/g, '');
                      const found = str.match(regex);
                      if (found) {
                        for (let x = 1; x < 6; x++) {
                          if ((products[j]['descripcionPrecio' + x].replace(/\s+/g, '')).includes(found[0])) {
                            variant_db[0].price_override = producto_promos['precio' + x];
                            variant_db[0].description_variant = producto_promos['descripcionPrecio' + x];
                            if (producto_promos['descripcionPrecio' + x].toLowerCase().includes('precio neto')) {
                              variant_db[0].metadata_variant = JSON.stringify({ type: 'Precio Neto' });
                            }
                            break;
                          }
                        }
                      }

                    }
                    await this.aphService.updateVariant(variant_db[0]);
                  }
                }

                // const price = products[j].precio1;
                // const product_db = <any>await this.aphService.getProductByReference({ reference: products[j].referencia });
                // const price_db = await this.aphService.getPrice({ id: product_db[0].idProducts });
                // if (price_db.price != price) {
                //   price_db[0].price = price;
                //   await this.aphService.updatePrice(price_db[0]);
                // }
                // /*actualizo el stock */
                // const variants = await this.promos.getStock(products[j]);
                // for (let k = 0; variants.length > k; k++) {
                //   await new Promise((resolve) => setTimeout(resolve, 300));
                //   const variant_db = <any>await this.aphService.getVariantBySku({ reference: variants[k].referencia + '-' + variants[k].color });
                //   const stock_db = <any>await this.aphService.getStockByVariant({ id_variant: variant_db.idVariant });
                //   const stockBodegaLocal = <any>find(stock_db, { name: 'local' });
                //   const stockBodegaZonaFranca = <any>find(stock_db, { name: 'ZonaFranca' });
                //   const stockBodegaTotalDisponible = <any>find(stock_db, { name: 'Total' });
                //   if (stockBodegaLocal.quantity != variants[k].bodegaLocal) {
                //     stockBodegaLocal.quantity = variants[k].bodegaLocal;
                //     await this.aphService.updateStock(stockBodegaLocal);
                //   }
                //   if (stockBodegaZonaFranca.quantity != variants[k].bodegaZonaFranca) {
                //     stockBodegaZonaFranca.quantity = variants[k].bodegaZonaFranca;
                //     await this.aphService.updateStock(stockBodegaZonaFranca);
                //   }
                //   if (stockBodegaTotalDisponible.quantity != variants[k].totalDisponible) {
                //     stockBodegaTotalDisponible.quantity = variants[k].totalDisponible;
                //     await this.aphService.updateStock(stockBodegaTotalDisponible);
                //   }

                // }
              }
            } catch (err) {
              console.log(err)
              errores.push({
                err: err.message,
                products: products[j],
                categorias: undefined,
              })
            }
          }
          categorias_cargadas.push({ categoria: categorias[i].nombre, categoriaHomologada, categorias_aph })
        } else {
          err_categorias.push({ category: categorias[i].nombre, categoriaHomologada: categorias[i].categoriaHomologada, categorias_aph })
        }
      }
      return { message: 'Correct cron', errores, categorias_cargadas, err_categorias };
    } catch (err) {
      console.log(err)
      return {
        message: 'Error cron', err: err.message, errores: {
          err_categorias: err_categorias
        }
      };
    }
  }
  @EventPattern('delete_category')
  async handleDeleteCategory(data: any) {
    const res = await this.aphService.deleteCategory(data);
    return res;
  }
  @EventPattern('load_api_cdo')
  async handleLoadApiCDO(data: any) {
    try {
      const collection = 'b4995e35-2373-4b36-a3f8-d147f6833a5a' // precio neto
      const locations = [
        { id: '0994b3d5-becd-401f-983f-47447352ce19', name: 'local' },
        { id: '9b245cdf-acc8-4655-9738-ee432f654e20', name: 'ZonaFranca' },
        { id: 'a5db0dfa-2d96-4950-b382-839b3acfd6ae', name: 'transito' },
        { id: '3b257993-638c-4505-ad1d-5a6dd24d9ac5', name: 'total' },
      ]
      const proveedor = '408afa0a-41c1-4c31-a831-8de0dfc3d30a';
      const products = await this.cdoService.getProducts();
      const size = products.length;
      const aux = []
      for (let i = 0; size > i; i++) {
        const categoriaHomologada = await this.cdoService.getCategoriaHomologada(products[i].category);
        if (categoriaHomologada != undefined && categoriaHomologada != '') {
          const { id_categorias } = await this.aphService.getCategoryBySlug({ slug: categoriaHomologada });
          if (id_categorias != undefined && id_categorias != '') {
            const checkProduct = await this.aphService.checkProduct(products[i].code)
            if (!(checkProduct.length > 0)) {
              const price = products[i].variants[0].net_price
              const priceList = products[i].variants[0].list_price
              const productaux = {
                nombre: products[i].name,
                referencia: products[i].code,
                description_product: products[i].description,
                metadata: null,
                precio: products[i].precio,
                channel: 'CDO',
                disponible: true,
                is_published: true,
                peso: 0,
                category_id: id_categorias,
                product_class_id: null,
                proveedor: proveedor,
                price: null,
                collection_id: collection
              }
              const price_db = await this.aphService.setPrice({ price, currency: 'COP', type: 'Precio Neto', metadata: { precioSugerido: priceList }, productId: null })
              productaux.price = price_db.id_price;
              const product_db = await this.aphService.setProduct(productaux);
              price_db.productId = product_db.id_productos;
              await this.aphService.updatePrice(price_db);
              await this.aphService.setProductImage({ productId: product_db.id_productos, url: JSON.stringify([products[i].variants[0].picture.original]) })
              await new Promise((resolve) => setTimeout(resolve, 200));
              for (let c = 0; products[i].variants.length > c; c++) {
                await new Promise((resolve) => setTimeout(resolve, 200));
                const productVariant = {
                  name_variants: products[i].code + '-' + products[i].variants[c].color,
                  sku: products[i].code + '-' + products[i].variants[c].color,
                  price_override: products[i].variants[c].net_price,
                  metadata_variants: { netPrice: products[i].variants[c].net_price, listPrice: products[i].variants[c].list_price },
                  weight_override: 0,
                  brand: 'not-brand',
                  description_variant: '',
                  product_id: product_db.id_productos
                }
                const variant_db = await this.aphService.setVariant(productVariant);
                await new Promise((resolve) => setTimeout(resolve, 200));
                await this.aphService.setStock({ locationId: locations[3].id, quantity: products[i].variants[c].stock_available, variant_id: variant_db.id_variant, quantity_allocated: products[i].variants[c].stock_existent })
                console.log("products[i].variants[c].picture.original", products[i].variants[c].picture.original)
                const variantImage_db = await this.aphService.setVariantImage({ variantId: variant_db.id_variant, url: JSON.stringify([products[i].variants[c].picture.original]) })
              }
            } else {
              const product_db = checkProduct[0];
              const price_db = await this.aphService.getPrice({ id: product_db.idProducts })
              console.log({ metadata: JSON.stringify({ precioSugerido: products[i].variants[0].list_price }) })
              await this.aphService.updatePrice(
                {
                  id: price_db[0].id,
                  type: 'Precio Neto',
                  metadata: JSON.stringify({ precioSugerido: products[i].variants[0].list_price }),
                  currency: 'COP',
                  price: price_db[0].price,
                  productId: price_db[0].productId
                })
              try {

                const variants_db = await this.aphService.getVariants({ idProducts: product_db.idProducts })
                // aux.push({ product: product_db, variants: variants_db })
                for (let c = 0; variants_db.length > c; c++) {
                  // const variantImage_db = await this.aphService.setVariantImage({ variantId: variants_db[c].id_variant, urlImage: JSON.stringify([products[i].variants[c].picture.original]) })
                  await this.aphService.setStock({ locationId: locations[3].id, quantity: products[i].variants[c].stock_available, variant_id: variants_db[c].id_variant, quantity_allocated: products[i].variants[c].stock_existent })

                }
              } catch (e) {
                console.log("error", e)
                aux.push({ product: `error ${e.message}`, variants: [] })
              }


            }
          }
        }
      }
      return { data: aux };
    } catch (e) {
      return e;
    }
  }
  @EventPattern('load_api_marpico')
  async handleLoadApiMarpico(data: any) {
    const proveedor = 'ea43c130-8df1-4eb8-9231-e84c1bc156e4'
    const collection = 'b4995e35-2373-4b36-a3f8-d147f6833a5a'
    const locations = [
      { id: '0994b3d5-becd-401f-983f-47447352ce19', name: 'local' },
      { id: '9b245cdf-acc8-4655-9738-ee432f654e20', name: 'ZonaFranca' },
      { id: 'a5db0dfa-2d96-4950-b382-839b3acfd6ae', name: 'transito' },
      { id: '3b257993-638c-4505-ad1d-5a6dd24d9ac5', name: 'total' },
    ]
    const res = await this.marpicoService.getProducts(data);
    const aux = []
    console.log(res.results.length)
    for (let i = 0; i < res.results.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      const categoriaHomologada = await this.marpicoService.getCategoriaHomologada(res.results[i].subcategoria_1.nombre);
      const categorias_db = <any>await this.aphService.getCategoryBySlug({ slug: categoriaHomologada });
      const checkProduct = await this.aphService.checkProduct(res.results[i].familia);
      if (!(checkProduct.length > 0)) {
        const productObject =
        {
          nombre: res.results[i].descripcion_comercial,
          referencia: res.results[i].familia,
          description_product: res.results[i].descripcion_larga,
          metadata: {
            material: res.results[i].material,
            empaque_individual: res.results[i].empaque_individual,
            empaque_unds_caja: res.results[i].empaque_unds_caja,
            empaque_und_medida: res.results[i].empaque_und_medida,
            empaque_largo: res.results[i].empaque_largo,
            empaque_ancho: res.results[i].empaque_ancho,
            empaque_alto: res.results[i].empaque_alto,
            empaque_peso_neto: res.results[i].empaque_peso_neto,
            empaque_peso_bruto: res.results[i].empaque_peso_bruto,
            area_impresion: res.results[i].area_impresion,
            medidas_largo: res.results[i].medidas_largo,
            medidas_ancho: res.results[i].medidas_ancho,
            medidas_alto: res.results[i].medidas_alto,
            medidas_diametro: res.results[i].medidas_diametro,
            medidas_peso_neto: res.results[i].medidas_peso_neto,
            tecnica_marca_codigo: res.results[i].tecnica_marca_codigo,
            tecnica_marca_tecnica: res.results[i].tecnica_marca_tecnica,
            tecnica_marca_precio: res.results[i].tecnica_marca_precio,
            tecnica_marca_num_tintas: res.results[i].tecnica_marca_num_tintas,
            tecnica_marca_descripcion: res.results[i].tecnica_marca_descripcion,
          },
          channel: 'Marpico',
          disponible: true,
          is_published: true,
          peso: 0,
          category_id: categorias_db.id_categorias,
          product_class_id: null,
          proveedor: proveedor,
          price: null,
          collection_id: collection
        }
        const price_db = await this.aphService.setPrice({ price: res.results[i].materiales[0].precio, currency: 'COP', type: null, metadata: null, productId: null });
        productObject.price = price_db.id_price;

        const product_db = await this.aphService.setProduct(productObject);
        await new Promise((resolve) => setTimeout(resolve, 200));
        const arrayUrls = res.results[i].imagenes.map((item: { imagen: { file: any; }; }) => {
          return item.imagen.file
        })
        await this.aphService.setProductImage({ productId: product_db.idProducts, url: JSON.stringify([arrayUrls]) })

        await new Promise((resolve) => setTimeout(resolve, 200));
        for (let c = 0; c < res.results[i].materiales.length; c++) {
          await new Promise((resolve) => setTimeout(resolve, 300));

          const variante = {
            name_variants: res.results[i].familia + '-' + res.results[i].materiales[c].color_nombre,
            sku: res.results[i].familia + '-' + res.results[i].materiales[c].color_nombre + '-' + res.results[i].materiales[c].codigo,
            price_override: res.results[i].materiales[c].precio,
            metadata_variants: { descuento: res.results[i].materiales[c].descuento, estado: res.results[i].materiales[c].estado },
            weight_override: 0,
            brand: 'not-brand',
            description_variant: '',
            product_id: product_db.id_productos
          }
          const variant_db = await this.aphService.setVariant(variante);
          console.log(variant_db, 'variant_db')
          await this.aphService.setStock({ locationId: locations[0].id, quantity: res.results[i].materiales[c].inventario, variant_id: variant_db.id_variant, quantity_allocated: 0 });
          await this.aphService.setStock({ locationId: locations[1].id, quantity: 0, variant_id: variant_db.id_variant, quantity_allocated: 0 });
          await this.aphService.setStock({ locationId: locations[3].id, quantity: res.results[i].materiales[c].inventario, variant_id: variant_db.id_variant, quantity_allocated: 0 });
          const variantImage_db = await this.aphService.setVariantImage({ variantId: variant_db.id_variant, url: JSON.stringify([arrayUrls]) })
        }
      } else {
        let product_db = checkProduct[0];
        if(product_db[0] !== undefined){
          console.log('entro', product_db[0])
          product_db = product_db[0];
        }
        console.log(product_db, 'product_db')
        const variant_db = await this.aphService.getVariants({ idProducts: product_db.idProducts });
        for (let j = 0; j < variant_db.length; j++) {
          const image = await this.aphService.getVariantImage({ id: variant_db[j].id_variant });
          if (image.length === 0) {
            const variant_api = res.results[i].materiales.find((item: any) => variant_db[j].name_variant === product_db.reference + '-' + item.color_nombre)
            const arrayUrls = variant_api.imagenes.map((item: { imagen: { file: any; }; }) => { return item.imagen.file })
            await this.aphService.setVariantImage({ variantId: variant_db[j].id_variant, url: JSON.stringify(arrayUrls) })
          }else{

            const variant_api = res.results[i].materiales.find((item: any) => variant_db[j].name_variant === product_db.reference + '-' + item.color_nombre)
            const arrayUrls = variant_api.imagenes.map((item: { imagen: { file: any; }; }) => { return item.imagen.file })
            await this.aphService.updateVariantImage({
              idImage: image[0].idImage,
              urlImage: JSON.stringify(arrayUrls),
              alt: variant_api.color_nombre,
              variantId: variant_db[j].id_variant
            })
          }
        }
        /*checkeo el precio */
        // let priceChange = false;
        // const arrayUrls = res.results[i].imagenes.map((item: { imagen: { file: any; }; }) => {
        //   return item.imagen.file
        // })
        // // await this.aphService.setProductImage({ productId: product_db.idProducts, url: JSON.stringify(arrayUrls) })
        // const price_db = await this.aphService.getPrice({ id: product_db.idProducts });
        // if (price_db == null || price_db == undefined || price_db.length== 0) {
        //   priceChange = true;
        //   const newPrice = await this.aphService.setPrice({ price: res.results[i].materiales[0].precio, currency: 'COP', type: null, metadata: null, productId: product_db.idProducts });
        //   await this.aphService.updateProductPrice({ id: product_db.idProducts, price: newPrice[0].id_price });
        // }else{
        //   await this.aphService.updatePrice(
        //     {
        //       id: price_db[0].id,
        //       type: 'Precio Neto',
        //       metadata: JSON.stringify({ precioSugerido: res.results[i].materiales[0].precio }),
        //       currency: 'COP',
        //       price: 0,
        //       productId: price_db.productId
        //     })
  
        // }

        // /*checkeo el stock */
        // for (let c = 0; c < res.results[i].materiales.length; c++) {
        //   await new Promise((resolve) => setTimeout(resolve, 300));
        //   const variant_db = <any>await this.aphService.getVariantBySku({ sku: res.results[i].familia + '-' + res.results[i].materiales[c].color_nombre + '-' + res.results[i].materiales[c].codigo });
        //   console.log(variant_db, 'variant_db')
        //   if(variant_db == undefined || variant_db.length == 0){
        //     const variante = {
        //       name_variants: res.results[i].familia + '-' + res.results[i].materiales[c].color_nombre,
        //       sku: res.results[i].familia + '-' + res.results[i].materiales[c].color_nombre + '-' + res.results[i].materiales[c].codigo,
        //       price_override: res.results[i].materiales[c].precio,
        //       metadata_variants: { descuento: res.results[i].materiales[c].descuento, estado: res.results[i].materiales[c].estado },
        //       weight_override: 0,
        //       brand: 'not-brand',
        //       description_variant: '',
        //       product_id: product_db.id_productos
        //     }
        //     const variant_db = await this.aphService.setVariant(variante);
        //     console.log(variant_db, 'variant_db')
        //     await this.aphService.setStock({ locationId: locations[0].id, quantity: res.results[i].materiales[c].inventario, variant_id: variant_db.id_variant, quantity_allocated: 0 });
        //     await this.aphService.setStock({ locationId: locations[1].id, quantity: 0, variant_id: variant_db.id_variant, quantity_allocated: 0 });
        //     await this.aphService.setStock({ locationId: locations[3].id, quantity: res.results[i].materiales[c].inventario, variant_id: variant_db.id_variant, quantity_allocated: 0 });
        //     const variantImage_db = await this.aphService.setVariantImage({ variantId: variant_db.id_variant, url: JSON.stringify([arrayUrls]) })
        //   }else{
        //   const stock_db = <any>await this.aphService.getStockByVariant({ id_variant: variant_db[0].id_variant });
        //   // console.log(stock_db, 'stock_db')
        //   if (stock_db[0].quantity != res.results[i].materiales[c].inventario) {
        //     console.log("actualizo stock")
        //     await this.aphService.updateStock({ locationId: locations[0].id, quantity: res.results[i].materiales[c].inventario, variant_id: variant_db[0].id_variant, quantity_allocated: 0 });
        //     await this.aphService.updateStock({ locationId: locations[1].id, quantity: 0, variant_id: variant_db[0].id_variant, quantity_allocated: 0 });
        //     await this.aphService.updateStock({ locationId: locations[3].id, quantity: res.results[i].materiales[c].inventario, variant_id: variant_db[0].id_variant, quantity_allocated: 0 });
        //   }
        //   if (priceChange) {
        //     await this.aphService.updateVariant({
        //       name_variant: variant_db[0].name_variant,
        //       sku: variant_db[0].sku,
        //       price_override: res.results[i].materiales[c].precio,
        //       metadata_variant: { descuento: res.results[i].materiales[c].descuento, estado: res.results[i].materiales[c].estado },
        //       weight_override: 0,
        //       brand: 'not-brand',
        //       description_variant: '',
        //       product_id: variant_db[0].product_id,
        //       id_variant: variant_db[0].id_variant
        //     })
        //   }
        // }
        // }
      }

    }

    return { data: aux };
  }
  @EventPattern('load_api_promoopcion')
  async handleLoadApiPromoopcion(data: any) {
    try {
      const supplier = '72775493-e7d6-43e7-847f-2b9c4565d480'
      const collection = 'b4995e35-2373-4b36-a3f8-d147f6833a5a'
      const locations = [
        { id: '0994b3d5-becd-401f-983f-47447352ce19', name: 'local' },
        { id: '9b245cdf-acc8-4655-9738-ee432f654e20', name: 'ZonaFranca' },
        { id: 'a5db0dfa-2d96-4950-b382-839b3acfd6ae', name: 'transito' },
        { id: '3b257993-638c-4505-ad1d-5a6dd24d9ac5', name: 'total' },
      ]
      const { response } = await this.promosOpcion.getProducts(data);
      const { Stocks } = await this.promosOpcion.getExistencias(data);
      // eslint-disable-next-line no-var
      var aux = []
      for (let i = 68; i < response.length; i++) {
        console.log("voy por aca", i)
        console.log(Stocks.length, "Stocks.length")
        await new Promise((resolve) => setTimeout(resolve, 300));
        const categoriaHomologada = await this.promosOpcion.getCategoriaHomologada(response[i].categorias);
        const categorias_db = <any>await this.aphService.getCategoryBySlug({ slug: categoriaHomologada });
        const checkProduct = await this.aphService.checkProduct(response[i].skuPadre);
        console.log(Stocks.length, "Stocks.length")

        if (checkProduct.length == 0) {
          const obj = {
            nombre: response[i].nombrePadre,
            referencia: response[i].skuPadre,
            description_product: response[i].descripcion,
            metadata: {
              material: response[i].material,
              capacidad: response[i].capacidad,
              medidas: response[i].medidas,
              paquete: response[i].paquete,
              impresion: response[i].impresion,
            },
            channel: 'PromoOpcion',
            disponible: true,
            is_published: true,
            peso: response[i].paquete.pesoNeto,
            category_id: categorias_db.id_categorias,
            product_class_id: null,
            proveedor: supplier,
            price: null,
            collection_id: collection
          }
          const price_db = await this.aphService.setPrice({ price: 0, currency: 'COP', type: null, metadata: null, productId: null })
          obj.price = price_db.id_price;
          console.log(price_db)
          const product = await this.aphService.setProduct(obj);
          await this.aphService.setProductImage({ productId: product.id_productos, url: JSON.stringify(response[i].imagenesPadre) })

          for (let c = 0; response[i].hijos.length > c; c++) {
            await new Promise((resolve) => setTimeout(resolve, 300));
            console.log("1")
            const variant = {
              name_variants: response[i].hijos[c].nombreHijo,
              sku: response[i].hijos[c].skuHijo,
              price_override: 0,
              metadata_variant: {
                talla: response[i].hijos[c].talla,
                color: response[i].hijos[c].color,
                estatus: response[i].hijos[c].estatus,
              },
              weight_override: 0,
              brand: 'not-brand',
              description_variant: '',
              product_id: product.id_productos,
              idVariant: null,
            }
            console.log("2")
            const variant_db = await this.aphService.setVariant(variant);
            console.log("3", variant_db)
            await this.aphService.setVariantImage({ variantId: variant_db.id_variant, urlImage: JSON.stringify(response[i].hijos[c].imagenesHijo) })
            console.log("4")
            await new Promise((resolve) => setTimeout(resolve, 300));
            await this.aphService.setStock({ locationId: locations[0].id, quantity: 0, variant_id: variant_db.id_variant, quantity_allocated: 0 });
            await this.aphService.setStock({ locationId: locations[1].id, quantity: 0, variant_id: variant_db.id_variant, quantity_allocated: 0 });
            await this.aphService.setStock({ locationId: locations[3].id, quantity: 0, variant_id: variant_db.id_variant, quantity_allocated: 0 });
          }
        } else {
          const product_db = <any>await this.aphService.getProductByReference({ reference: response[i].skuPadre });
          // const newPrice = await this.aphService.setPrice({ price: 0, currency: 'COP', type: null, metadata: null, productId: product_db[0].idProducts });
          // await this.aphService.updateProductPrice({ id: product_db[0].idProducts, price: newPrice.id_price });
          // const price_db = await this.aphService.getPrice({ id: product_db[0].idProducts })
          // await this.aphService.updatePrice(
          //   {
          //     id: price_db[0].id,
          //     type: 'Precio Neto',
          //     metadata: JSON.stringify({ precioSugerido: 0 }),
          //     currency: 'COP',
          //     price: price_db[0].price,
          //     productId: price_db[0].productId
          //   })
          // console.log(product_db, price_db)
          // aux.push({ id: product_db, price: price_db })
          console.log(Stocks.length, "Stocks.length")

          if (Stocks.length == 0 || Stocks == undefined) {
            aux.push({ id: product_db, producto: response[i], iteracion: i })
          }
          for (let c = 0; response[i].hijos.length > c; c++) {
            console.log(Stocks.length, "Stocks.length")
            console.log("iteracion", i, "hijo", c)

            const variants = <any>await this.aphService.getVariantBySku({ sku: response[i].hijos[c].skuHijo });
            if (variants.length == 1) {
              console.log(variants)
              /*buscar si el sku de la variante (variants[0].sku) es igual a el material del stock (Stock["Material"]) y obtener el objeto del stock */
              const stock = Stocks.find((stock: { "Material": string, "Stock": number, "Planta": string }) => stock["Material"] == variants[0].sku);
              if (stock != -1) {
                const location = await this.aphService.getStockByVariant({ id_variant: variants[0].id_variant })
                console.log(location)
                /*buscar en la constante location el objeto que contiene el name de 'Local' */
                if (location.length > 0) {
                  const location_local = location.find((location: { "name": string }) => location["name"] == 'Local');
                  const location_total = location.find((location: { "name": string }) => location["name"] == 'Total');
                  await this.aphService.updateStock({ id_variant: location_local.variant_id, quantity: stock == undefined ? 0 : stock.Stock, locationId: location_local.locationId })
                  await this.aphService.updateStock({ id_variant: location_total.variant_id, quantity: stock == undefined ? 0 : stock.Stock, locationId: location_total.locationId })
                } else {
                  await this.aphService.setStock({ locationId: locations[0].id, quantity: stock == undefined ? 0 : stock.Stock, variant_id: variants[0].id_variant, quantity_allocated: 0 });
                  await this.aphService.setStock({ locationId: locations[1].id, quantity: stock == undefined ? 0 : stock.Stock, variant_id: variants[0].id_variant, quantity_allocated: 0 });
                  await this.aphService.setStock({ locationId: locations[3].id, quantity: stock == undefined ? 0 : stock.Stock, variant_id: variants[0].id_variant, quantity_allocated: 0 });
                }
                if (stock == undefined) {
                  aux.push({ id: product_db, variants, error: "no existe el stock, pero se cargo como 0" })
                }
              } else {
                console.log("no existe el stock")
                aux.push({ id: product_db, variants, error: "no existe el stock" })
              }
            }
            if (variants.length > 1) {
              aux.push({ id: product_db, variants, error: "mas de una variante" })
            }

          }

        }
      }
      return { data: aux };
    } catch (err) {
      console.log(err)
      return { message: 'error', err: err, data: aux };
    }
  }
  @EventPattern('set_form_product')
  async setFormProduct(data: any) {
    try {
      /*{
    product: {
      name_product: 'test',
      description: 'test',
      reference: 'test-test',
      price: '15000',
      canal: 'adminAVe',
      supplier: {
        id: '20c2cfda-b7f4-4dea-a15f-8d48cd379db8',
        name_supplier: 'ProveedorAdministrador(back)',
        description_supplier: 'not-description',
        metadata_supplier: '[object Object]'
      },
      peso: '15',
      currency: { currency: 'COP' },
      category: '77b7817a-3dcf-40cd-a891-84298f43ee7c',
      collection: {
        idCollection: 'b4995e35-2373-4b36-a3f8-d147f6833a5a',
        name_collection: 'precio neto',
        slug_collection: 'precio-neto',
        metadata_collection: null
      },
      is_published: { is_published: 'Si' },
      raiting: 4,
      subCategory: 'no-subcategory',
      image: 'http://46.101.159.194/img/01.png'
    },
    variants: [
      {
        name_variant: 'test-variante',
        sku: 'test-variante',
        price: '0',
        stock: [Array],
        description: 'kansldnaosind',
        weight: '0',
        marca: 'no brand',
        image: 'http://46.101.159.194/img/01.png'
      }
    ]
  } */
      const product = data.product
      const variants = data.variants
      console.log(variants[0].stock)
      const check_product = <any>await this.aphService.getProductByReference({ reference: product.reference })
      if (check_product.length > 0) {
        console.log("el producto ya existe")
        return { message: "el producto ya existe", err: check_product }
      }
      const productaux = {
        nombre: product.name_product,
        referencia: product.reference,
        description_product: product.description,
        metadata: null,
        channel: product.canal,
        disponible: product.is_published.is_published == 'Si' ? true : false,
        is_published: product.is_published.is_published == 'Si' ? true : false,
        peso: product.peso,
        category_id: product.category,
        product_class_id: null,
        proveedor: product.supplier.id,
        price: null,
        collection_id: product.collection.idCollection,
      }
      const price_db = await this.aphService.setPrice({
        metadata: { precioSugerido: product.collection.name_collection == 'precio sugerido' ? product.price : 0 },
        currency: product.currency.currency,
        price: product.collection.name_collection == 'precio neto' ? product.price : 0,
        productId: null
      })
      productaux.price = price_db.id_price
      // console.log(price_db)
      const product_db = await this.aphService.setProduct(productaux)
      await this.aphService.updatePrice({ ...price_db, productId: product_db.id_productos })
      await this.aphService.setProductImage({ productId: product_db.id_productos, url: JSON.stringify([product.image]) })
      for (let i = 0; i < variants.length; i++) {
        const productVariant = {
          name_variants: variants[i].name_variant,
          sku: variants[i].sku,
          price_override: variants[i].price,
          metadata_variants: {},
          weight_override: variants[i].weight,
          brand: variants[i].marca,
          description_variant: variants[i].description,
          product_id: product_db.id_productos
        }
        const variant_db = await this.aphService.setVariant(productVariant);
        console.log(variant_db, "variante_db")
        await this.aphService.setVariantImage({ variantId: variant_db.id_variant, urlImage: JSON.stringify([variants[i].image]) })
        for (let j = 0; j < variants[i].stock.length; j++) {
          await this.aphService.setStock({ locationId: variants[i].stock[j].name.idStockLocation, quantity: variants[i].stock[j].quantity, variant_id: variant_db.id_variant, quantity_allocated: 0 });
        }
      }
      return { data: 'producto creado' }
    } catch (err) {
      return { data: null, error: err.message }
    }
  }
  @EventPattern('load_price_promoopcion')
  async loadPricePromoopcion(data: any) {
    try {
      const supplier = '72775493-e7d6-43e7-847f-2b9c4565d480'
      const jsonPrice = await this.promosOpcion.getJsonPrice({})
      const aux = []
      for (let i = 0; i < jsonPrice.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 150));
        
        const product = await <any>this.aphService.getProductByReferenceAndSupplier({ reference: jsonPrice[i].referencia, supplier })
        if (product.length > 0) {
          const price = await this.aphService.getPriceById({ id: product[0].price_base })
          console.log(jsonPrice[i].precio)
          
          if (price.length > 0) {
            const priceUpdate = await this.aphService.updatePrice(
              {
                price: jsonPrice[i].tipo == "PRECIO ÚNICO" ? jsonPrice[i].precio * 5/3 : 0,
                metadata: JSON.stringify({ precioSugerido: jsonPrice[i].tipo == "NORMAL" ? jsonPrice[i].precio : 0 }),
                id: price[0].id,
                currency: price[0].currency,
                productId: price[0].productId,
                type: price[0].type
              })
            await new Promise((resolve) => setTimeout(resolve, 150));
          } else {
            aux.push({ id: product[0].id_productos, price: null, error: "no existe el precio" })
          }
          const variant = await <any>this.aphService.getVariantBySku({ sku: jsonPrice[i].sku })
          if (variant.length > 0) {
            const variantUpdate = await this.aphService.updateVariant(
              {
                ...variant[0],
                price_override: jsonPrice[i].precio,
              })
            await new Promise((resolve) => setTimeout(resolve, 150));

          }
        } else {
          aux.push({ id: null, price: null, error: "no existe el producto" })

        }
      }
      return { message: 'Precios cargados', dato: { jsonPrice, length: aux.length }, error: [] }
    } catch (err) {
      return { data: null, message: "error", error: err.message }
    }
  }

  @EventPattern('process_csv')
  async processCsv(data: any) {
    /*  {
    'sku padre': 'MU',
    'sku hijo': 'MU-100',
    nombre: 'prueba',
    'descripcion corta': 'kdansdonasdon',
    'precio neto': '0',
    'precio sugerido': '0',
    peso: '0',
    marca: 'no brand',
    material: '0',
    talla: '0',
    color: '0',
    medidas: '0',
    coleccion: 'precio sugerido',
    categoria: 'antiestres',
    subcategoria: '0',
    proveedor: 'ProveedorAdministrador(back)',
    publicado: 'si',
    'disponible desde': '21/03/2023',
    imagen: 'http://46.101.159.194/img/01.png',
    stock: '123',
    'localizacion del stock': 'total'
  } */
    try {
      const aux = [{}]
      const products = []
      let product = {}

      for (let c = 0; c < data.length; c++) {
        const check_product = <any>await this.aphService.getProductByReference({ reference: data[c]['sku padre'] })
        console.log(check_product, "check_product")
        if (check_product.length == 0) {
          console.log("el producto no existe")
          const catergoria = await this.aphService.getCategoryBySlug({ slug: data[c]['categoria'] })
          const collection = await this.aphService.getCollectionsBySlug({ slug: data[c]['coleccion'] })
          const supplier = await this.aphService.getProveedorByName({ name: data[c]['proveedor'] })
          console.log(catergoria, "categorias")
          console.log(collection, "coleccion")
          console.log(supplier, "proveedor")
          product = {
            nombre: data[c]['nombre'],
            referencia: data[c]['sku padre'],
            description_product: data[c]['descripcion corta'],
            metadata: { medidas: data[c]['medidas'], material: data[c]['material'], talla: data[c]['talla'], color: data[c]['color'] },
            channel: data[c]['proveedor'],
            is_published: data[c]['publicado'] == 'si' ? true : false,
            peso: data[c]['peso'],
            category_id: catergoria != undefined ? { id: catergoria.id_categorias, name: catergoria.name_category, slug: catergoria.slug_category } : { name: null, id: null },
            product_class_id: null,
            collection_id: collection != undefined ? { name: collection[0].name_collection, id: collection[0].idCollection, slug: collection[0].slug_collection } : { name: null, id: null },
            proveedor: supplier != undefined ? { id: supplier[0].id, name: supplier[0].name_supplier } : { name: null, id: null },
            price: data[c]['precio neto'],
            image: data[c]['imagen'],
          }
          console.log(product, "product")
        }
        const check_variant = <any>await this.aphService.getVariantBySku({ sku: data[c]['sku hijo'] })
        if (check_variant.length > 0) {
          console.log("la variante ya existe")
          aux.push({ message: "la variante ya existe", err: check_variant, data: data[c] })
          continue
        }
        product = check_product.length > 0 ? check_product[0] : product
        const productVariant = {
          name_variants: data[c]['nombre'],
          sku: data[c]['sku hijo'],
          price_override: data[c]['precio sugerido'],
          metadata_variants: { color: data[c]['color'], talla: data[c]['talla'], material: data[c]['material'], medidas: data[c]['medidas'] },
          weight_override: data[c]['peso'],
          brand: data[c]['marca'],
          description_variant: data[c]['descripcion'],
          image: data[c]['imagen'],
          stock: [
            {
              location: data[c]['localizacion del stock'],
              quantity: data[c]['stock']
            }
          ]
        }
        products.push({
          ...product,
          variants: [productVariant]
        })
      }
      console.log(products, "products")
      return { message: 'Productos cargados', data: { products, length: aux.length }, error: [] }
    } catch (err) {
      console.log(err)
      return { data: null, error: err.message }
    }
  }
  @EventPattern('process_csv_products')//problema con la carga de imagenes
  async processCsvProducts(data: any) {
    try {
      // console.log(data)
      //agrupar por referencia
      const locations = [
        { id: '0994b3d5-becd-401f-983f-47447352ce19', name: 'local' },
        { id: '9b245cdf-acc8-4655-9738-ee432f654e20', name: 'ZonaFranca' },
        { id: 'a5db0dfa-2d96-4950-b382-839b3acfd6ae', name: 'transito' },
        { id: '3b257993-638c-4505-ad1d-5a6dd24d9ac5', name: 'total' },
      ]
      let product_db: any = []
      const products = data.reduce((acc, item) => {
        const key = item.referencia;
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(item);
        return acc;
      }
        , {});
      for (const key in products) {
        const check_product = <any>await this.aphService.getProductByReference({ reference: key })
        if (check_product.length == 0) {
          const product_aux = {
            nombre: products[key][0].nombre,
            referencia: products[key][0].referencia,
            description_product: products[key][0].description_product,
            metadata: products[key][0].metadata,
            channel: products[key][0].channel,
            is_published: products[key][0].is_published,
            peso: products[key][0].peso,
            category_id: products[key][0].category_id.id,
            collection_id: products[key][0].collection_id.id,
            proveedor: products[key][0].proveedor.id,
            price: products[key][0].price,
            image: products[key][0].imagen,
            product_class_id: products[key][0].product_class_id
          }
          const price_db = await this.aphService.setPrice({
            metadata: { precioSugerido: products[key][0].collection_id.name == 'precio sugerido' ? products[key][0].price : 0 },
            price: products[key][0].collection_id.name == 'precio neto' ? products[key][0].price : 0,
            product_id: null,
            currency: products[key][0].currency == undefined ? 'COP' : products[key][0].currency,
            type: "Precio Neto"
          })
          product_aux.price = price_db.id_price
          product_db = await this.aphService.setProduct(product_aux)
          await this.aphService.updatePrice({ ...price_db, productId: product_db.id_productos })
          await this.aphService.setProductImage({ productId: product_db.id_productos, url: JSON.stringify([products[key][0].image]) })
        }

        for (let i = 0; i < products[key].length; i++) {
          const check_variant = <any>await this.aphService.getVariantBySku({ sku: products[key][i].variants[0].sku })
          if (check_variant.length == 0) {
            const variant_db = await this.aphService.setVariant({
              name_variants: products[key][i].variants[0].name_variants,
              sku: products[key][i].variants[0].sku,
              price_override: products[key][i].variants[0].price_override,
              metadata_variants: products[key][i].variants[0].metadata_variants,
              weight_override: products[key][i].variants[0].weight_override,
              brand: products[key][i].variants[0].brand,
              description_variant: JSON.stringify(products[key][i].variants[0].metadata_variants),
              product_id: check_product.length > 0 ? check_product[0].id_productos : product_db.id_productos,
            })
            console.log(variant_db, "variant")
            await this.aphService.setVariantImage({ variantId: variant_db.id_variant, urlImage: JSON.stringify([products[key][i].variants[0].image]) })
            const idStock = locations.find((item) => item.name.toLowerCase() == products[key][i].variants[0].stock[0].location.toLowerCase())
            console.log(idStock, "stocl")
            await this.aphService.setStock({
              locationId: idStock.id,
              quantity: products[key][i].variants[0].stock[0].quantity,
              variant_id: variant_db.id_variant,
              quantity_allocated: 0
            })
          } else {
            const price_db = await this.aphService.getPrice({ id: check_variant[0].idProducts })
            await this.aphService.updatePrice({
              id: price_db[0].id,
              type: 'Precio Neto',
              metadata: { precioSugerido: products[key][0].collection_id.name == 'precio sugerido' ? products[key][0].price : 0 },
              currency: 'COP',
              price: products[key][0].collection_id.name == 'precio neto' ? products[key][0].price : 0,
              productId: price_db[0].productId
            })
            const stock_update = locations.find((item) => item.name.toLowerCase() == products[key][i].variants[0].stock[0].location.toLowerCase())
            const stock_db = await this.aphService.getStockByVariant({ id_variant: check_variant[0].id_variant })
            const check_stock = stock_db.find((item) => item.location == stock_update.id)
            if (check_stock) {
              await this.aphService.updateStock({ variant_id: check_variant.idVariant, quantity: products[key][i].variants[0].stock[0].quantity, quantity_allocated: 0, location: stock_update.id })
            } else {
              await this.aphService.setStock({
                location: stock_update.id,
                quantity: products[key][i].variants[0].stock[0].quantity,
                variant_id: check_variant[0].id_variant,
                quantity_allocated: 0
              })
            }
          }
        }

      }
    } catch (err) {
      console.log(err)
      return { error: err.message, message: "productos " }
    }
  }
  @EventPattern('load_esferos_products')
  async loadEsferos(data: any) {
    try {
      const jsonProducts = []
      const products = await this.esferosService.getProducts()
      const parser = new DOMParser();
      // console.log(products)
      const xmlDoc = parser.parseFromString(products, 'text/xml');

      const productElements = xmlDoc.getElementsByTagName('product');
      const productIds = [];

      for (let i = 0; i < productElements.length; i++) {
        const productId = productElements[i].getAttribute('id');
        productIds.push(productId);
      }
      for (let i = 0; i < productIds.length; i++) {
        console.log(i, productIds[i], "product")
        await new Promise(resolve => setTimeout(resolve, 400));

        //obtener productos y sus categorias
        const product = await this.esferosService.getProductById(productIds[i])
        const xmlAux = parser.parseFromString(product, 'text/xml');
        const productElement = xmlAux.getElementsByTagName("product")[0];
        const id = productElement.getElementsByTagName("reference")[0].textContent;
        const categoryName = productElement.getElementsByTagName("id_category_default")[0].textContent;
        const price = productElement.getElementsByTagName("price")[0].textContent;
        const weight = productElement.getElementsByTagName("weight")[0].textContent;
        const height = productElement.getElementsByTagName("height")[0].textContent;
        const width = productElement.getElementsByTagName("width")[0].textContent;
        const name = productElement.getElementsByTagName("name")[0].getElementsByTagName("language")[0].textContent;
        let image = <any>productElement.getElementsByTagName("image")
        if (image.length == 0) {
          continue
        }
        image = image[0].getAttribute('xlink:href');
        const description = productElement.getElementsByTagName("description_short")[0].getElementsByTagName("language")[0].textContent;
        const stock = productElement.getElementsByTagName("stock_availables")[0].getElementsByTagName("stock_available")[0].getElementsByTagName("id")[0].textContent;
        console.log("hasta aca 1")
        //stock
        const stock_quantity = await this.esferosService.getStockById(stock)
        const auxStock = parser.parseFromString(stock_quantity, 'text/xml');
        const stockAvailable = auxStock.getElementsByTagName("stock_available")[0];
        const quantity = stockAvailable.getElementsByTagName("quantity")[0].textContent;
        console.log("hasta aca 2")

        //categoria
        const category_name = await this.esferosService.getCategoryById(categoryName)
        const auxCategory = parser.parseFromString(category_name, 'text/xml');
        const nameElement = auxCategory.getElementsByTagName("name")[0].getElementsByTagName("language")[0].textContent;
        console.log("hasta aca 3")


        //cargar aux
        const aux = {
          id: productIds[i],
          reference: id,
          categorie: nameElement,
          price,
          weight,
          height,
          width,
          name,
          description,
          image,
          stock: quantity,
          variants: []
        }


        //Variantes
        const combinaciones = productElement.getElementsByTagName("combination");
        const idCombination = []
        // Recorrer los elementos <combination> y obtener los IDs
        for (let i = 0; i < combinaciones.length; i++) {
          const combinacion = combinaciones[i];
          const idElement = combinacion.getElementsByTagName("id")[0];

          // Verificar si el elemento <id> está presente y no está vacío
          if (idElement && idElement.textContent) {
            const id = idElement.textContent;
            idCombination.push(id)
            console.log("ID de la combinacion " + (i + 1) + ": " + id);
          } else {
            console.log("La combinacion " + (i + 1) + " está vacía.");
          }
        }
        console.log("hasta aca 4")
        for (let i = 0; i < idCombination.length; i++) {
          await new Promise(resolve => setTimeout(resolve, 200));
          const combination = await this.esferosService.getCombinatiosById(idCombination[i])
          const auxCombination = parser.parseFromString(combination, 'text/xml');
          const combinationElement = auxCombination.getElementsByTagName("combination")[0];
          const reference = combinationElement.getElementsByTagName("reference")[0].textContent;
          const price = combinationElement.getElementsByTagName("price")[0].textContent;
          const weight = combinationElement.getElementsByTagName("weight")[0].textContent;
          const stock = combinationElement.getElementsByTagName("quantity")[0].textContent;
          const imagenes = combinationElement.getElementsByTagName("image");
          const images = []
          // Recorrer los elementos <image> y obtener los atributos xlink:href y <id>
          for (let i = 0; i < imagenes.length; i++) {
            const imagen = imagenes[i];
            const href = imagen.getAttribute("xlink:href");
            images.push(href)
          }
          // obtener atributos
          const atributId = combinationElement.getElementsByTagName("product_option_value")[0].getElementsByTagName("id")[0].textContent;
          const atrib = await this.esferosService.getPropsById(atributId)
          const atribAux = parser.parseFromString(atrib, 'text/xml');
          const atribElement = atribAux.getElementsByTagName("name")[0].getElementsByTagName("language")[0].textContent;
          aux.variants.push({
            id: productIds[i],
            sku: reference,
            categorie: nameElement,
            price,
            weight,
            height,
            width,
            name,
            description,
            images,
            stock,
            atribut: atribElement
          })
        }


        jsonProducts.push(aux)
      }
      //crear un archivo json
      const json = JSON.stringify(jsonProducts);
      writeFileSync('products.json', json);

      return { message: 'ok', data: json }
    } catch (error) {
      console.log(error)
      return { error: error }
    }
  }
  @EventPattern('load_esferos')
  async loadProductsEsferos(data: any) {
    try {
      const location = '3b257993-638c-4505-ad1d-5a6dd24d9ac5'
      const proveedor = '9c124ac9-ceaa-4ccb-b026-8906d75fc430'
      const collection = 'b4995e35-2373-4b36-a3f8-d147f6833a5a'
      const products = JSON.parse(readFileSync('products.json', 'utf8'))
      const aux = []
      for (let i = 0; i < products.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 200));
        const categoria = await this.esferosService.getCategoriasHomologadas(products[i].categorie)
        console.log(categoria, "homo")
        if (categoria.error !== '') {
          continue
        }
        const category = await this.aphService.getCategoryBySlug({ slug: categoria.ave })
        console.log(category, "aph")
        let slug_aux = products[i].name.split(' ')
        slug_aux = slug_aux.join('-')
        slug_aux = slug_aux.toLowerCase()
        slug_aux = products[i].id + '-' + slug_aux.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        const reference = products[i].reference === '' ? slug_aux : products[i].reference
        const check_product = await this.aphService.checkProduct(reference)
        console.log(check_product)
        if (check_product.length == 0) {
          const descripcion = await this.esferosService.clearTagsHtml(products[i].description);
          const productaux = {
            nombre: products[i].name,
            referencia: reference,
            description_product: descripcion,
            metadata: null,
            precio: null,
            channel: 'esferos',
            disponible: true,
            is_published: true,
            peso: 0,
            category_id: category.id_categorias,
            product_class_id: null,
            proveedor: proveedor,
            price: null,
            collection_id: collection
          }
          const price = products[i].price.split('.')[0]
          const price_db = await this.aphService.setPrice({
            price,
            currency: 'COP',
            type: 'Precio Neto',
            metadata: { precioSugerido: price * 3 / 5 },
            productId: null
          })
          productaux.price = price_db.id_price
          await new Promise(resolve => setTimeout(resolve, 200));
          const product_db = await this.aphService.setProduct(productaux)
          price_db.productId = product_db.id_productos;
          await this.aphService.updatePrice(price_db);
          await this.aphService.setProductImage({
            productId: product_db.id_productos,
            image: null,
            url: JSON.stringify([products[i].image])
          })
          if (products[i].variants.length > 0) {
            for (let j = 0; j < products[i].variants.length; j++) {
              await new Promise(resolve => setTimeout(resolve, 200));
              const variant = products[i].variants[j];
              const variantaux = {
                name_variants: reference + '-' + variant.atribut,
                metadata_variants: {},
                price_override: variant.price.split('.')[0] * 3 / 5,
                weight_override: variant.weight.split('.')[0],
                sku: variant.sku + '-' + variant.atribut,
                description_variant: descripcion,
                brand: 'not-brand',
                product_id: product_db.id_productos,
              }
              const variant_db = await this.aphService.setVariant(variantaux)
              console.log(variant_db, "variant")
              console.log(variant, "images")
              await this.aphService.setStock({
                location: location,
                quantity: variant.stock,
                variantId: variant_db.id_variant,
                quantity_allocated: 0
              })
              await this.aphService.setVariantImage({
                variantId: variant_db.id_variant,
                image: null,
                urlImage: JSON.stringify(variant.images)
              })
            }
          } else {
            const variantaux = {
              name_variants: reference,
              metadata_variants: {},
              price_override: 0,
              weight_override: 0,
              sku: reference + '-' + 'default',
              description_variant: descripcion,
              brand: 'not-brand',
              product_id: product_db.id_productos,
            }
            const variant_db = await this.aphService.setVariant(variantaux)
            await this.aphService.setStock({
              location: location,
              quantity: products[i].stock,
              variantId: variant_db.id_variant,
              quantity_allocated: 0
            })
            await this.aphService.setVariantImage({
              variantId: variant_db.id_variant,
              image: null,
              urlImage: JSON.stringify(products[i].image)
            })
          }
        } else {
          const product_db = check_product[0];
          const variant_db = await this.aphService.getVariants({ idProducts: product_db.idProducts });
          const price_db = await this.aphService.getPrice({ id: product_db.idProducts });
          const price = products[i].price.split('.')[0]
          if(price_db.length == 0){
            const price_db = await this.aphService.setPrice({
              price,
              currency: 'COP',
              type: 'Precio Neto',
              metadata: { precioSugerido: price * 3 / 5 },
              productId: null
            })
            product_db.price = price_db.id_price
            await this.aphService.updateProduct(product_db)
          }else{
            await this.aphService.updatePrice(
              {
                id: price_db[0].id,
                type: 'Precio Neto',
                metadata: JSON.stringify({ precioSugerido:price * 3 / 5 }),
                currency: 'COP',
                price: 0,
                productId: price_db[0].productId
              })
          }
          if(products[i].variants.length == 0){
            continue;
          }
          for (let c = 0; products[i].variants.length > c; c++) {
            await new Promise(resolve => setTimeout(resolve, 200));
            const variant = <any>await this.aphService.getVariantBySku({ sku: variant_db[c].sku });
            const stock_db = <any>await this.aphService.getStockByVariant({ id_variant: variant[0].id_variant });
            await this.aphService.updateStock({
              locationId: location,
              quantity: products[i].variants[c].stock,
              id_variant: variant[0].id_variant,
            })
            await this.aphService.updateVariant({
              name_variant:variant[0].name_variant,
              metadata_variant:variant[0].metadata_variant,
              price_override:products[i].variants[c].price.split('.')[0] * 3 / 5,
              weight_override:0,
              sku:variant[0].sku,
              description_variant:variant[0].description_variant,
              brand:variant[0].brand,
              product_id:variant[0].product_id,
            })
          }
        }
        aux.push(products[i])

      }
      return { message: 'ok', data: aux }
    } catch (err) {
      console.log(err)
      return { error: err }
    }
  }
}
/* 
  multiplicar el precio neto por 3/5
SELECT name_category, COUNT(p."idProducts") as cantidad_productos
FROM categories c
INNER JOIN products p ON p.category_id = c.id_categorias
GROUP BY c.name_category
]*/