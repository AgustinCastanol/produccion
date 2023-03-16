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
@Controller()
export class AppController {
  constructor(
    private readonly aphService: AppService,
    private readonly promos: PromosService,
    private readonly cdoService: CdoService,
    private readonly marpicoService: MarpicoService,
    private readonly promosOpcion: PromoopcionService,
  ) { }
  @EventPattern('home')
  async handleHome(data: any) {
    const res = await this.aphService.home(data);
    const count = await this.aphService.getCountPRoveedores(data);
    return { res, countProductsSuppliers: count };
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
    const categorias = await this.promos.getCategories();
    let count = 0;
    for (let i = 0; i < categorias.length; i++) {
      const productos = await this.promos.getProductsByCategory(categorias[i]);
      await new Promise((resolve) => setTimeout(resolve, 200));
      categorias[i].productos = productos;
      count += productos.length;
      console.log(count, categorias[i].nombre + " : " + productos.length);
    }
    return { count };
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
      for (let i = 2; categorias.length > i; i++) {
        await new Promise((resolve) => setTimeout(resolve, 300));
        const categoriaHomologada = <any>await this.promos.getCategoriasHomologadas(categorias[i]);
        const categorias_aph = await this.aphService.getCategoryBySlug(categoriaHomologada);
        if (categorias_aph != undefined && (categorias_aph.id_categorias !== undefined || categorias_aph.id_categorias !== null)) {
          const products = await this.promos.getProductsByCategory(categorias[i]);
          const size = products.length
          for (let j = 0; size > j; j++) {
            try {
              await new Promise((resolve) => setTimeout(resolve, 300));
              const checkProduct = await this.aphService.checkProduct(products[j].referencia)
              if (!(checkProduct.length > 0)) {
                const aux = await this.promos.clearName(products[j].nombre);
                const price = products[j].descripcionPrecio1 == "precio neto" ? products[j].precio1 : 0;
                const productaux = {
                  nombre: aux.str,
                  referencia: products[j].referencia,
                  description_product: products[j].descripcionProducto.replace(/(\r\n|\n|\r)/igm, "").replace(/"/ig, '\\"').replace(/(<([^>]+)>)/ig, ""),
                  metadata: null,
                  precio: products[j].precio,
                  channel: 'promocionales',
                  disponible: true,
                  is_published: true,
                  peso: 0,
                  category_id: categorias_aph.id_categorias,
                  product_class_id: null,
                  proveedor: proveedor,
                  price: null,
                  collection_id: aux.collection
                }

                const price_db = await this.aphService.setPrice({ price, currency: 'COP', type: 'Precio Neto', metadata: null, productId: null });
                productaux.price = price_db.id_price;
                const productDB = await this.aphService.setProduct(productaux);
                price_db.productId = productDB.id_productos;
                await this.aphService.updatePrice(price_db);
                await this.aphService.setProductImage({ productId: productDB.idProducts, url: JSON.stringify([base_url_image + products[j].imageUrl]) })
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
                const product_db = checkProduct[0];
                const price_db = await this.aphService.getPrice({ id: product_db.idProducts });
                await this.aphService.updatePrice(
                  {
                    id: price_db[0].id,
                    type: 'Precio Neto',
                    metadata: JSON.stringify({ precioSugerido: products[j].descripcionPrecio1 == "precio neto" ? 0 : products[j].precio1 }),
                    currency: 'COP',
                    price: products[j].descripcionPrecio1 == "precio neto" ? products[j].precio1 : 0,
                    productId: price_db[0].productId
                  })
                  product_db.category_id = categorias_aph.id_categorias;
                  await this.aphService.updateProduct(product_db)

                  await new Promise((resolve) => setTimeout(resolve, 300));
                const variants = await this.promos.getStock(products[j]);
                for (let k = 0; variants.length > k; k++) {
                  const variant_db = <any>await this.aphService.getVariantBySku({ sku: variants[k].referencia + '-' + variants[k].color });
                  console.log("variants", variant_db)
                  console.log("variants[k]", variants[k])
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
                          if ((products[j]['descripcionPrecio' + x].replace(/\s+/g, '')).includes(found[0])) {
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
                    const new_variant = await this.aphService.setVariant(productVariant);
                    await this.aphService.setStock({ locationId: locations[0].id, quantity: variants[k].bodegaLocal, variant_id: new_variant.id_variant, quantity_allocated: 0 });
                    await this.aphService.setStock({ locationId: locations[1].id, quantity: variants[k].bodegaZonaFranca, variant_id: new_variant.id_variant, quantity_allocated: 0 });
                    await this.aphService.setStock({ locationId: locations[3].id, quantity: variants[k].totalDisponible, variant_id: new_variant.id_variant, quantity_allocated: 0 });
                  }
                  if (variant_db.length != 0) {
                    if (products[j].descripcionPrecio1 == 'precio neto') {
                      variant_db[0].price_override = 0;
                    } else {
                      const regex = /\d+GB/g;
                      const str = variant_db[0].sku.replace(/\s+/g, '');
                      const found = str.match(regex);
                      if (found) {
                        for (let x = 1; x < 6; x++) {
                          if ((products[j]['descripcionPrecio' + x].replace(/\s+/g, '')).includes(found[0])) {
                            variant_db[0].price_override = products[j]['precio' + x];
                            variant_db[0].description_variant = products[j]['descripcionPrecio' + x];
                            if (products[j]['descripcionPrecio' + x].toLowerCase().includes('precio neto')) {
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
          const { id_categorias } = await this.aphService.getCategoryBySlug(categoriaHomologada);
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
                console.log("products[i].variants[c].picture.original",products[i].variants[c].picture.original)
                const variantImage_db = await this.aphService.setVariantImage({ variantId: variant_db.id_variant, url: JSON.stringify([products[i].variants[c].picture.original]) })
              }
            } else {
              const product_db = checkProduct[0];
              const price_db = await this.aphService.getPrice({ id: product_db.idProducts })
              console.log({ metadata: JSON.stringify({ precioSugerido: products[i].variants[0].list_price }) })
              await this.aphService.updatePrice(
                {
                  id:price_db[0].id,
                  type:'Precio Neto',
                  metadata:JSON.stringify({precioSugerido:products[i].variants[0].list_price}),
                  currency:'COP',
                  price:price_db[0].price,
                  productId:price_db[0].productId
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
      const categorias_db = <any>await this.aphService.getCategoryBySlug(categoriaHomologada);
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
        const product_db = checkProduct[0];
        const variant_db = await this.aphService.getVariants({ idProducts: product_db.idProducts });
        // for (let j = 0; j < variant_db.length; j++) {
        //   const image = await this.aphService.getVariantImage({ id: variant_db[j].id_variant });
        //   const variant_api = res.results[i].materiales.find((item: any) => variant_db[j].name_variant === product_db.reference + '-' + item.color_nombre)
        //   const arrayUrls = variant_api.imagenes.map((item: { imagen: { file: any; }; }) => { return item.imagen.file })
        //   await this.aphService.updateVariantImage({
        //     idImage: image[0].idImage,
        //     urlImage: JSON.stringify(arrayUrls),
        //     alt: variant_api.color_nombre,
        //     variantId: variant_db[j].id_variant
        //   })
        // }
        /*checkeo el precio */
        let priceChange = false;
        const arrayUrls = res.results[i].imagenes.map((item: { imagen: { file: any; }; }) => {
          return item.imagen.file
        })
        // await this.aphService.setProductImage({ productId: product_db[0].idProducts, url: JSON.stringify(arrayUrls) })
        const price_db = await this.aphService.getPrice({ id: product_db.idProducts });
        await this.aphService.updatePrice(
          {
            id: price_db[0].id,
            type: 'Precio Neto',
            metadata: JSON.stringify({ precioSugerido: res.results[i].materiales[0].precio }),
            currency: 'COP',
            price: 0,
            productId: price_db[0].productId
          })

        if(price_db == null || price_db == undefined){
          priceChange = true;
         const newPrice = await this.aphService.setPrice({ price:res.results[i].materiales[0].precio, currency: 'COP', type: null, metadata: null, productId: product_db[0].idProducts });
        await this.aphService.updateProductPrice({ id: product_db[0].idProducts, price: newPrice[0].id_price });
        }

        /*checkeo el stock */
        for (let c = 0; c < res.results[i].materiales.length; c++) {
          const variant_db = <any>await this.aphService.getVariantBySku({ sku: res.results[i].familia + '-' + res.results[i].materiales[c].color_nombre + '-' + res.results[i].materiales[c].codigo });
          const stock_db = <any>await this.aphService.getStockByVariant({ id_variant: variant_db[0].id_variant });
          console.log(stock_db, 'stock_db')
          if (stock_db[0].quantity != res.results[i].materiales[c].inventario) {
            console.log("actualizo stock")
            await this.aphService.updateStock({ locationId: locations[0].id, quantity: res.results[i].materiales[c].inventario, variant_id: variant_db.idVariant, quantity_allocated: 0 });
            await this.aphService.updateStock({ locationId: locations[1].id, quantity: 0, variant_id: variant_db.idVariant, quantity_allocated: 0 });
            await this.aphService.updateStock({ locationId: locations[3].id, quantity: res.results[i].materiales[c].inventario, variant_id: variant_db.idVariant, quantity_allocated: 0 });
          }
          if (priceChange) {
            await this.aphService.updateVariant({
              name_variant: variant_db.name_variant,
              sku: variant_db.sku,
              price_override: res.results[i].materiales[c].precio,
              metadata_variant: { descuento: res.results[i].materiales[c].descuento, estado: res.results[i].materiales[c].estado },
              weight_override: 0,
              brand: 'not-brand',
              description_variant: '',
              product_id: variant_db.product_id,
              idVariant: variant_db.idVariant
            })
          }
        }
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
        console.log(Stocks.length,"Stocks.length")
        await new Promise((resolve) => setTimeout(resolve, 300));
        const categoriaHomologada = await this.promosOpcion.getCategoriaHomologada(response[i].categorias);
        const categorias_db = <any>await this.aphService.getCategoryBySlug(categoriaHomologada);
        const checkProduct = await this.aphService.checkProduct(response[i].skuPadre);
        console.log(Stocks.length,"Stocks.length")

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
          console.log(Stocks.length,"Stocks.length")

          if(Stocks.length == 0 || Stocks == undefined){
            aux.push({ id: product_db,producto: response[i], iteracion :i })
          }
          for (let c = 0; response[i].hijos.length > c; c++) {
            console.log(Stocks.length,"Stocks.length")
            console.log("iteracion",i,"hijo",c)

            const variants = <any>await this.aphService.getVariantBySku({ sku: response[i].hijos[c].skuHijo });
            if(variants.length == 1){
              console.log(variants)
              /*buscar si el sku de la variante (variants[0].sku) es igual a el material del stock (Stock["Material"]) y obtener el objeto del stock */
              const stock = Stocks.find((stock:{"Material":string,"Stock":number,"Planta":string}) => stock["Material"] == variants[0].sku);
              if(stock!=-1){
                const location = await this.aphService.getStockByVariant({id_variant:variants[0].id_variant})
                console.log(location)
                /*buscar en la constante location el objeto que contiene el name de 'Local' */
                if(location.length>0){
                  const location_local = location.find((location:{"name":string}) => location["name"] == 'Local' );
                  const location_total = location.find((location:{"name":string}) => location["name"] == 'Total' );
                  await this.aphService.updateStock({id_variant:location_local.variant_id,quantity:stock == undefined?0:stock.Stock ,locationId:location_local.locationId})
                  await this.aphService.updateStock({id_variant:location_total.variant_id,quantity:stock == undefined?0:stock.Stock,locationId:location_total.locationId})
                }else{
                  await this.aphService.setStock({ locationId: locations[0].id, quantity: stock == undefined?0:stock.Stock, variant_id: variants[0].id_variant, quantity_allocated: 0 });
                  await this.aphService.setStock({ locationId: locations[1].id, quantity: stock == undefined?0:stock.Stock, variant_id: variants[0].id_variant, quantity_allocated: 0 });
                  await this.aphService.setStock({ locationId: locations[3].id, quantity: stock == undefined?0:stock.Stock, variant_id: variants[0].id_variant, quantity_allocated: 0 });
                }
                if(stock == undefined){
                aux.push({id: product_db, variants,error:"no existe el stock, pero se cargo como 0"})
                }
              }else{
                console.log("no existe el stock")
                aux.push({id: product_db, variants,error:"no existe el stock"})
              }
            }
            if(variants.length>1){
              aux.push({id: product_db, variants,error:"mas de una variante"})
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
try{
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
const check_product = <any> await this.aphService.getProductByReference({ reference: product.reference })
if(check_product.length >0){
  console.log("el producto ya existe")
  return {message:"el producto ya existe", err:check_product}
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
  metadata: { precioSugerido: product.collection.name_collection == 'precio sugerido'?product.price:0 },
  currency: product.currency.currency,
  price: product.collection.name_collection == 'precio neto'?product.price:0,
  productId: null
})
productaux.price = price_db.id_price
// console.log(price_db)
const product_db = await this.aphService.setProduct(productaux)
await this.aphService.updatePrice({...price_db, productId: product_db.id_productos})
await this.aphService.setProductImage({ productId: product_db.id_productos, url: JSON.stringify([product.image]) })
for(let i = 0; i < variants.length; i++){
  const productVariant = {
    name_variants: variants[i].name_variant,
    sku: variants[i].sku,
    price_override: variants[i].price,
    metadata_variants: { },
    weight_override: variants[i].weight,
    brand: variants[i].marca,
    description_variant: variants[i].description,
    product_id: product_db.id_productos
  }
  const variant_db = await this.aphService.setVariant(productVariant);
  console.log(variant_db,"variante_db")
  await this.aphService.setVariantImage({ variantId: variant_db.id_variant, url: JSON.stringify([variants[i].image]) })
  for(let j = 0; j < variants[i].stock.length; j++){
  await this.aphService.setStock({ locationId: variants[i].stock[j].name.idStockLocation, quantity: variants[i].stock[j].quantity, variant_id: variant_db.id_variant, quantity_allocated: 0 });
  }
}
return {data:'producto creado'}
}catch(err){
  return {data:null,error:err.message}
}
  }

}
