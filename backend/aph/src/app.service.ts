/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { v4 as uuidv1 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';
@Injectable()
export class AppService {
  constructor(private sequelize: Sequelize) { }
  async getProducts(data: any) {
    try {
      const limit = data.limit || 10;
      const offset = data.offset || 0;
      //OFFSET ${offset} LIMIT ${limit}
      const res = await this.sequelize.query(`SELECT * FROM "public"."products" 
      join "public"."collection" on "public"."products"."collection_id" = "public"."collection"."idCollection" 
      join "public"."supplier" on "public"."products"."supplier" = "public"."supplier"."id"
      join "public"."price" on "public"."products"."idProducts" = "public"."price"."productId"
      join "public"."categories" on "public"."products"."category_id" = "public"."categories"."id_categorias"
      join "public"."productImages" on "public"."products"."idProducts" = "public"."productImages"."productId"
      OFFSET ${offset} LIMIT ${limit}`);
      const count = <any>await this.sequelize.query(`SELECT COUNT(*) FROM "public"."products"`);
      return { data: res[0], totalRows: count[0][0].count };
    } catch (err) {
      console.log('err', err);
      return err;
    }
  }
  async updateProduct(data: any) {
    try {
      /* UPDATE public.products
  SET name_product=?, reference=?, description_product=?, metadata=?, channel=?, available_on=?, is_published=?, weight=?, category_id=?, product_class_id=?, "idProducts"=?, supplier=?, price_base=?, collection_id=?
  WHERE <condition>;*/
      if (data.idProducts == null) {
        return {
          data: null,
          message: 'missing id_productos',
        };
      }
      const obj = {
        id_productos: data.idProducts,
        nombre: data.nombre ? data.nombre : data.name_product,
        referencia: data.referencia ? data.referencia : data.reference,
        descripcion: data.description_product ? data.description_product : data.descripcion,
        metadata:JSON.stringify(data.metadata),
        channel: data.channel,
        disponible: data.disponible ? new Date(data.disponible).toISOString().slice(0, 19).replace('T', ' ') : new Date(data.available_on).toISOString().slice(0, 19).replace('T', ' '),
        is_published: data.is_published,
        peso: data.peso ? data.peso : data.weight,
        category_id: data.category_id,
        product_class_id: data.product_class_id,
        proveedor: data.proveedor ? data.proveedor : data.supplier,
        price_base: data.price ? data.price : data.price_base,
        collection_id: data.collection_id
      };
      await this.sequelize.query(`UPDATE public.products 
      SET name_product='${obj.nombre}', reference='${obj.referencia}', description_product='${obj.descripcion}', metadata='${obj.metadata}', channel='${obj.channel}', available_on='${obj.disponible}', is_published=${obj.is_published}, weight=${obj.peso}, category_id='${obj.category_id}', product_class_id=${obj.product_class_id}, supplier='${obj.proveedor}', price_base=${obj.price_base == undefined || obj.price_base == null ? null : `'${obj.price_base}'`}, collection_id=${obj.collection_id == undefined || obj.collection_id == null ? null : `'${obj.collection_id}'`} WHERE "idProducts" = '${obj.id_productos}'`);

      return { data: obj, message: 'product updated' };
    } catch (err) {
      console.log('err', err);
      throw new Error(err.message);
    }
  }
  async getCategory(data: any) {
    try {
      console.log('data', data.id);
      if (data.id == null) {
        return { message: 'Empty category' }
      }
      const res = await this.sequelize.query(`SELECT * FROM "public"."categories" WHERE "id_categorias" = '${data.id}'`);
      return { data: res[0] };
    } catch (err) {
      console.log(err)
      return err;
    }
  }
  async home(data: any) {
    try {
      return [{ message: 'hello world' }]
    } catch (err) {
      console.log('err', err);
      return err;
    }
  }
  async setProduct(data: any) {
    /*INSERT INTO public.products(
  name_product, reference, description_product, metadata, channel, available_on, is_published, weight, category_id, product_class_id, "idProducts", supplier, price_base)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?); */
    try {
      if (
        data.nombre == null ||
        data.referencia == null ||
        data.channel == null ||
        data.category_id == null ||
        data.proveedor == null
      ) {
        return {
          data: null,
          message:
            'product not created, missing name or reference or channel or is_published or category_id or proveedor',
        };
      }
      const obj = {
        id_productos: uuidv1(),
        nombre: data.nombre,
        referencia: data.referencia,
        descripcion: data.description_product ? data.description_product : "not description",
        metadata: JSON.stringify(data.metadata),
        channel: data.channel,
        disponible: new Date().toISOString().slice(0, 19).replace('T', ' '),
        is_published: data.is_published,
        peso: data.peso,
        category_id: data.category_id,
        product_class_id: data.product_class_id,
        proveedor: data.proveedor,
        price_base: data.price,
        collection_id: data.collection_id
      };
      console.log("obj_priice", obj.price_base)
      console.log("data_price", data.price)
      await this.sequelize.query(`INSERT INTO public.products(
	name_product, reference, description_product, metadata, channel, available_on, is_published, weight, category_id, product_class_id, "idProducts", supplier, price_base,collection_id)
	VALUES ('${obj.nombre}','${obj.referencia}','${obj.descripcion}','${obj.metadata}','${obj.channel}','${obj.disponible}',${obj.is_published},${obj.peso},'${obj.category_id}',${obj.product_class_id},'${obj.id_productos}','${obj.proveedor}',${obj.price_base == undefined || obj.price_base == null ? null : `'${obj.price_base}'`}, ${obj.collection_id == undefined || obj.collection_id == null ? null : `'${obj.collection_id}'`})`);

      return obj;
    } catch (err) {
      console.log('err', err);
      return err;
    }
  }
  async setProductImage(data: any) {
    try {
      if (data.productId == null) {
        return {
          data: null,
          message: 'missing id_productos',
        };
      }
      const obj = {
        id_productos: data.productId,
        image: data.image ? data.image : null,
        alt: data.alt ? data.alt : "image",
        url: data.url ? data.url : null,
        idImage: uuidv1(),
      };
      await this.sequelize.query(`INSERT INTO public."productImages"(
        "idImage", "productId", image, alt, "urlImage")
        VALUES ('${obj.idImage}', '${obj.id_productos}', ${obj.image ? `'${obj.image}'` : null}, '${obj.alt}', ${obj.url ? `'${obj.url}'` : null});`)
      return obj;
    } catch (err) {
      console.log('err', err);
      return err;
    }
  }
  async deleteImagesProducts({ id }: any) {
    /*DELETE FROM public."productImages"
  WHERE <condition>; */
    try {
      if (id == null) {
        return {
          data: null,
          message: 'missing idImage',
        };
      }
      await this.sequelize.query(`DELETE FROM public."productImages"
    WHERE "idImage" = '${id}'`);
      return { data: id, message: 'image deleted' };
    } catch (err) {
      return err;
    }
  }
  async updateImagesProducs(data: any) {
    /*UPDATE public."productImages"
  SET "idImage"=?, "productId"=?, image=?, alt=?, "urlImage"=?
  WHERE <condition>; */
    try {
      if (data.idImage == null) {
        console.log('data', data)
        return {
          data: null,
          message: 'missing idImage',
        };
      }
      const obj = {
        idImage: data.idImage,
        productId: data.productId,
        image: data.image ? data.image : null,
        alt: data.alt ? data.alt : "image",
        url: data.url ? data.url : null,
      };
      console.log(obj, 'objeto imagenes')
      await this.sequelize.query(`UPDATE public."productImages"
    SET "productId"='${obj.productId}', image=${obj.image ? `'${obj.image}'` : null}, alt='${obj.alt}', "urlImage"=${obj.url ? `'${obj.url}'` : null}
    WHERE "idImage" = '${obj.idImage}';`)
      return obj;
    } catch (err) {
      console.log('err', err);
      return err;
    }
  }
  async getProduct(data: any) {
    try {
      if (data.id_productos == null) {
        return {
          data: null,
          message: 'missing id_productos',
        };
      }
      /*      join "public"."price" on "public"."products"."idProducts" = "public"."price"."id" */
      const product = await this.sequelize.query(`
      SELECT * FROM public.products
      join "public"."collection" on "public"."products"."collection_id" = "public"."collection"."idCollection" 
      join "public"."categories" on "public"."products"."category_id" = "public"."categories"."id_categorias" 
      join "public"."supplier" on "public"."products"."supplier" = "public"."supplier"."id"
      WHERE "public"."products"."idProducts" = '${data.id_productos}'
      `);
      return { data: product[0][0] };
    } catch (err) {
      console.log(err);
      return err;
    }
  }
  async getProductByReference(data: any) {
    try {
      if (data.reference == null) {
        return {
          data: null,
          message: 'missing reference',
        };
      }
      const product = await this.sequelize.query(`
      SELECT * FROM public.products
      WHERE reference = '${data.reference}'`);
      return product[0];
    } catch (err) {
      console.log(err);
    }
  }
  async getProductByReferenceAndSupplier({reference, supplier}: any) {
    try {
      if (reference == null) {
        return {
          data: null,
          message: 'missing reference',
        };
      }
      const product = await this.sequelize.query(`
      SELECT * FROM public.products
      WHERE reference = '${reference}' and supplier = '${supplier}'`);
      return product[0];
    } catch (err) {
      console.log(err);
    }
  }
  async searchProduct(data: any) {
    try {
      if (data.search == null) {
        return {
          data: null,
          message: 'missing search',
        };
      }
      const product = await this.sequelize.query(`
      SELECT * FROM public.products
      join "public"."collection" on "public"."products"."collection_id" = "public"."collection"."idCollection" 
      join "public"."supplier" on "public"."products"."supplier" = "public"."supplier"."id"
      join "public"."price" on "public"."products"."idProducts" = "public"."price"."productId"
      join "public"."categories" on "public"."products"."category_id" = "public"."categories"."id_categorias"
      join "public"."productImages" on "public"."products"."idProducts" = "public"."productImages"."productId"
      WHERE name_product LIKE '%${data.search}%'`);
      return product[0];
    } catch (err) {
      console.log(err);
      return err;
    }
  }
  async getVariants(data: any) {
    console.log("getVariants1")
    try {
      if (data.idProducts == undefined || data.idProducts == null) {
        return { message: 'missing idProducts' }
      }
      const res = await this.sequelize.query(
        `SELECT * FROM "public"."variants" 
    where product_id = '${data.idProducts}'`,
      );
      return res[0];
    } catch (err) {
      console.log(err)
      return err;
    }
  }
  async getVariant(data: any) {
    try {
      if (data.id_variant == undefined || data.id_variant == null) {
        return { message: 'missing id_variant' }
      }
      const res = await this.sequelize.query(
        `SELECT * FROM "public"."variants" 
        where id_variant = '${data.id_variant}'`,
      );
      return res;
    } catch (err) {
      console.log(err)
      return err;
    }
  }
  async getVariantBySku(data: any) {
    try {
      if (data.sku == undefined || data.sku == null) {
        return { message: 'missing sku' }
      }
      const res = await this.sequelize.query(
        `SELECT * FROM "public"."variants"
        where sku = '${data.sku}'`,
      );
      return res[0];
    } catch (err) {
      console.log(err)
    }
  }

  async setVariant(data: any) {
    try {
      if (data.name_variants == null || data.brand == null || data.sku == null || data.product_id == null) {
        return {
          data: null,
          message: 'variant not created, missing name or description or brand or sku',
        }
      }
      const obj = {
        id_variant: uuidv1(),
        name_variant: data.name_variants,
        metadata_variant: JSON.stringify(data.metadata_variant),
        description_variant: data.description_variant ? data.description_variant : "  ",
        brand: data.brand,
        price_override: data.price_override,
        weight_override: data.weight_override,
        sku: data.sku,
        product_id: data.product_id
      };
      const res = await this.sequelize.query(`
  INSERT INTO public.variants(
	id_variant, name_variant,metadata_variant,description_variant,brand,price_override,weight_override, sku, product_id)
	VALUES ('${obj.id_variant}','${obj.name_variant}','${obj.metadata_variant}','${obj.description_variant}','${obj.brand}',${obj.price_override},${obj.weight_override},'${obj.sku}','${obj.product_id}')`);
      console.log('res', res);
      return obj;
    } catch (err) {
      console.log('err', err);
      return err;
    }
  }

  async getStocks(data: any) {
    try {
      if (data.id_variant == null) {
        return {
          data: null,
          message: 'missing id_variant',
        }
      }
      const res = await this.sequelize.query(`
      SELECT * FROM public.stock 
      join "public"."stockLocation" on "public"."stockLocation"."idStockLocation" = "public"."stock"."locationId"
      WHERE variant_id = '${data.id_variant}'`);
      return res[0];
    } catch (err) {
      console.log(err);
      return err;
    }
  }
  async getStockByVariant(data: any) {
    try {
      if (data.id_variant == null) {
        return {
          data: null,
          message: 'missing id_variant',
        }
      }
      const res = await this.sequelize.query(`
      SELECT * FROM public.stock 
      join "public"."stockLocation" on "public"."stockLocation"."idStockLocation" = "public"."stock"."locationId"
      WHERE variant_id = '${data.id_variant}'`);
      return res[0];
    } catch (err) {
      console.log(err);
      return err
    }
  }
  async updateStock(data: any) {
    try {
      if (data.id_variant == null || data.quantity == null) {
        return {
          data: null,
          message: 'missing id_variant or quantity',
        }
      }
      const res = await this.sequelize.query(`
      UPDATE public.stock
      SET quantity = ${data.quantity}
      WHERE variant_id = '${data.id_variant}' and "locationId" = '${data.locationId}'`);
      return res;
    } catch (err) {
      console.log(err);
      return err;
    }
  }
  async getProveedores(data: any) {
    try {
      const res = await this.sequelize.query(`
      SELECT * FROM public."supplier"`);

      return { data: res[0] };
    } catch (err) {
      console.log(err)
      return err;
    }
  }
  async getCountPRoveedores(data) {
    try {
      const res = <any>await this.sequelize.query(`
      SELECT "public"."supplier"."name_supplier" ,count("public"."supplier"."id") 
      FROM public."supplier"
            join "public"."products" on "public"."products"."supplier" = "public"."supplier"."id"
          group by ("public"."supplier"."id","public"."supplier"."name_supplier")
      `);
      console.log("count", res[0])
      return res[0];
    } catch (err) {
      console.log(err)
      return err;
    }
  }
  async updateSupplier(data: any) {
    /*UPDATE public.supplier
  SET id=?, name_supplier=?, description_supplier=?, metadata_supplier=?
  WHERE <condition>; */
    try {
      console.log(data)
      const res = await this.sequelize.query(`
      UPDATE public.supplier
      SET name_supplier = '${data.name_supplier}', description_supplier = ${data.description_supplier == null ? null : `'${data.description_supplier}'`}, metadata_supplier = ${data.metadata_supplier == null ? null : `'${data.metadata_supplier}'`} WHERE id= '${data.id}'`);
      return { data: res[0], message: 'Supplier updated' };

    } catch (err) {
      console.log(err)
      return err;
    }
  }
  async setProveedor(data: any) {
    /*INSERT INTO public.supplier(
  id, name_supplier, description_supplier, metadata_supplier)
  VALUES (?, ?, ?, ?); */
    try {

      const obj = {
        id_supplier: uuidv1(),
        name: data.name,
        metadata: data.metadata == null ? JSON.stringify({ data: null }) : JSON.stringify(data.metadata),
        description: data.description ? data.description : "not-description",
      };
      const res = await this.sequelize.query(`
INSERT INTO public.supplier(
  id, name_supplier, description_supplier, metadata_supplier)
  VALUES ('${obj.id_supplier}','${obj.name}','${obj.description}','${obj.metadata}')`);
      console.log(data)
      return obj;
    } catch (err) {
      console.log(err)

    }
  }
  async getLogs(data: any) {
    try {
      return [{
        id: 1,
        service: 'api',
        function: 'Promocionales',
        errors: [],
        date: new Date(),
        status: 'success',
        message: 'ok',
      }, {
        id: 2,
        service: 'api',
        function: 'Promocionales',
        errors: [{ error: 'Product "lapiz celeste" have a error' }, { error: 'Category "productos navideños" have a error or is not created' }],
        date: new Date(),
        status: 'warning',
        message: 'Something went wrong, but i finished the process',
      }, {
        id: 3,
        service: 'api',
        function: 'Promocionales',
        errors: [{ error: 'Service timeout' }],
        date: new Date(),
        status: 'error',
        message: 'Something went wrong',
      }]
    } catch (err) {
      console.log(err)
      return err;
    }
  }
  async getProveedor(data: any) {
    try {
      if (data.id_supplier == null) {
        return {
          data: null,
          message: 'missing id_supplier',
        }
      }
      const res = await this.sequelize.query(`
      SELECT DISTINCT "products".category_id, "categories"."name_category" FROM "public"."products"
join "public"."categories" on "public"."products"."category_id" = "public"."categories"."id_categorias"
WHERE (supplier = '${data.id_supplier}' and  "categories"."parent" is null)`);
      return res[0]
    } catch (err) {
      console.log(err)
    }
  }
  async getProveedorByName(data: any) {
    try{
      if(data.name == null){
        return {
          data: null,
          message: 'missing name',
        }
      }
      const res = await this.sequelize.query(`
      SELECT * FROM public."supplier" WHERE name_supplier = '${data.name}'`);
      return res[0]
    }catch(err){
      console.log(err)
      return err;
    }
  }
  async getstockLocation() {
    /*SELECT "idStockLocation", name
    FROM public."stockLocation"; */
    try {
      return await this.sequelize.query(`
      SELECT * FROM public."stockLocation"`);
    } catch (err) {
      console.log(err)
      return err;
    }
  }

  async setStock(data: any) {
    try {
      const obj = {
        idStock: uuidv1(),
        locationId: data.locationId,
        variantId: data.variant_id,
        quantity: data.quantity,
        quantity_allocated: data.quantity_allocated,
      }
      console.log(obj,"obj")
      console.log(data,"daya")

      await this.sequelize.query(`
      INSERT INTO public.stock(
        "idStock", "locationId", variant_id, quantity, quantity_allocated)
        VALUES ('${obj.idStock}', '${obj.locationId}', '${obj.variantId}', ${obj.quantity}, ${obj.quantity_allocated});`);
      return { data: obj, message: 'stock created' };
    } catch (err) {
      console.log(err)
      return err
    }
  }
  async getStocksByLocation(data: any) {
    try {
      const res = await this.sequelize.query(`SELECT "idStockLocation", name
      FROM public."stockLocation";`)
      return { data: res[0] };
    } catch (err) {
      console.log(err)
      return err;
    }
  }
  async getCollections(data: any) {
    const res = await this.sequelize.query(
      `SELECT * FROM "public"."collection"`,
    );
    return res[0];
  }

  async setCollection(data: any) {
    try {
      if (data.nombre == null || data.slug == null) {
        return {
          data: null,
          message: 'collection not created, missing name or slug',
        };
      }
      const obj = {
        id_colecciones: uuidv1(),
        name: data.nombre,
        slug: data.slug,
        metadata: data.metadata,
      };
      await this.sequelize.query(`
      INSERT INTO public.collection(
        "idCollection", name, slug, metadata)
        VALUES (${obj.id_colecciones}, ${obj.name}, ${obj.slug}, ${obj.metadata == null ? null : obj.metadata
        });`);
    } catch (err) {
      console.log('err', err);
      return err;
    }
  }

  async getCategories(data: any) {
    const res = await this.sequelize.query(
      `SELECT * FROM "public"."categories"`,
    );
    return { data: res[0] };
  }
  async getCategoryBySlug(data: any) {
    try {
      if (data == null || data == undefined || data == '') {
        return null
      }
      const res = <any>await this.sequelize.query(
        `SELECT * FROM "public"."categories" WHERE slug_category = '${data.slug}'`,
      );

      return res[0][0];
    } catch (err) {
      console.log('err', err);
      return err;
    }
  }
  async setCategory(data: any) {
    try {
      console.log('data', data);
      if (data.name_category == null || data.slug_category == null) {
        return {
          data: null,
          message: 'category not created, missing name or slug',
        };
      }
      const obj = {
        id_categorias: uuidv1(),
        nombre: data.name_category,
        slug: data.slug,
        metadata: JSON.stringify(data.metadata_category),
        parent: data.parent,
        tree_id: data.tree_id,
      };
      await this.sequelize.query(
        `INSERT INTO "public"."categories" VALUES ('${obj.id_categorias}', '${obj.nombre
        }', '${obj.slug}', '${obj.metadata}', ${obj.parent == null ? null : obj.parent
        }, ${obj.tree_id == null ? null : obj.tree_id})`,
      );
      return { data: obj, message: 'category created' };
    } catch (err) {
      console.log('err', err);
      return err;
    }
  }
  async updateCategory(data: any) {
    /*UPDATE public.categories
  SET id_categorias=?, name_category=?, slug_category=?, metadata_category=?, parent=?, tree_id=?
  WHERE <condition>; */
    try {
      if (data.id_categorias == null || data.name_category == null || data.slug_category == null) {
        return {
          data: null,
          message: 'category not created, missing name or slug',
        };
      }
      const obj = {
        id_categorias: data.id_categorias,
        nombre: data.name_category,
        slug: data.slug_category,
        metadata: JSON.stringify(data.metadata_category),
        parent: data.parent,
        tree_id: data.tree_id,
      };
      // await this.sequelize.query(
      //   `UPDATE "public"."categories" SET name_category = '${obj.nombre
      //   }', slug_category = '${obj.slug}', metadata_category = '${obj.metadata
      //   }', parent = ${obj.parent == null ? null : obj.parent}, tree_id = ${obj.tree_id == null ? null : obj.tree_id} WHERE id_categorias = '${obj.id_categorias}'`,
      // );
      return { data: obj, message: 'category updated' };
    } catch (err) {
      console.log(err)
      return err
    }
  }

  async loadCategories() {
    try {
      // eslint-disable-next-line prettier/prettier
      const categories = JSON.parse(fs.readFileSync(path.join(__dirname, '../diccionary.json'), 'utf-8'));
      for (let c = 0; categories.length > c; c++) {
        /*crear un intervalo para no romper la cola */
        await new Promise((resolve) => setTimeout(resolve, 1000));
        if (categories[c]['SUBCATEGORIA AVE'] == '') {
          const aux = await this.sequelize.query(
            `SELECT * FROM "public"."categories" WHERE name = '${categories[c]['CATEGORIA AVE']}'`,
          );
          if (aux[0].length == 0) {
            /*make a slug */
            let slug = categories[c]['CATEGORIA AVE'].toLowerCase();
            slug = slug.replace(/ /g, '-');
            slug = slug.replace(/[^\w-]+/g, '');
            await this.sequelize.query(
              `INSERT INTO "public"."categories" VALUES ('${uuidv1()}', '${categories[c]['CATEGORIA AVE']
              }', '${slug}', null, null, null)`,
            );
          }
        } else {
          const aux = await this.sequelize.query(
            `SELECT * FROM "public"."categories" WHERE name = '${categories[c]['SUBCATEGORIA AVE']}'`,
          );
          if (aux[0].length == 0) {
            /*make a slug */
            let slug = categories[c]['SUBCATEGORIA AVE'].toLowerCase();
            slug = slug.replace(/ /g, '-');
            slug = slug.replace(/[^\w-]+/g, '');
            const father: any = await this.sequelize.query(
              `SELECT * FROM "public"."categories" WHERE name = '${categories[c]['CATEGORIA AVE']}'`,
            );
            if (father[0].length > 0) {
              await this.sequelize.query(
                `INSERT INTO "public"."categories" VALUES ('${uuidv1()}', '${categories[c]['SUBCATEGORIA AVE']
                }', '${slug}', null, '${father[0][0].id_categorias}', null)`,
              );
            }
          }
        }
      }
      return { message: 'categories loaded' };
    } catch (e) {
      console.log(e);
      return e;
    }
  }
  async loadApiCDO() {
    try {
      return { message: 'categories loaded' };
    } catch (e) {
      console.log(e);
      return e;
    }
  }
  async loadProductsPromo() {
    try {
      console.log('hola');
    } catch (e) {
      console.log(e);
      return e;
    }
  }

  async deleteCategory(id: any) {
    try {
      await this.sequelize.query(
        `DELETE FROM "public"."categories" WHERE id_categorias = '${id.id}'`,
      );
      return { message: 'category deleted' };
    } catch (e) {
      console.log(e);
      return e;
    }
  }
  async setPrice(price: any) {
    /*INSERT INTO public.price(
  id, price, currency, type, metadata, "productId")
  VALUES (?, ?, ?, ?, ?, ?); */
    try {
      const obj = {
        id_price: uuidv1(),
        price: price.price,
        currency: price.currency,
        type: price.type==undefined?'no type':price.type,
        metadata: JSON.stringify(price.metadata),
        productId: price.productId,
      };
      await this.sequelize.query(`
    INSERT INTO public.price(
      id, price, currency, type, metadata_price, "productId")
      VALUES ('${obj.id_price}', ${obj.price}, '${obj.currency}', '${obj.type}', '${obj.metadata}', ${obj.productId == null ? null : `'${obj.productId}'`});`);
      return obj;
    } catch (e) {
      console.log(e);
      return e;
    }
  }
  async updatePrice(price: any) {
    /*UPDATE public.price */
    try {
      const obj = {
        id_price: price.id_price == null ? price.id : price.id_price,
        price: price.price,
        currency: price.currency,
        type: price.type,
        metadata: price.metadata,
        productId: price.productId,
      };
      console.log(obj, 'obj price')
      await this.sequelize.query(`
      UPDATE public.price
      SET price=${obj.price}, currency='${obj.currency}', type='${obj.type}', metadata_price='${obj.metadata}', "productId"='${obj.productId}'
      WHERE id = '${obj.id_price}';`);
      return obj;
    } catch (e) {
      console.log(e);
      return e;
    }
  }
  async getCollectionsBySlug({slug}) {
    try{
      const res = await this.sequelize.query(`
      SELECT * FROM public.collection WHERE slug_collection = '${slug}';`);
      return res[0];
    }catch(e){
      console.log(e);
      return e;
    }
  }
  async getPrice({ id }: any) {
    try {

      const res = await this.sequelize.query(`
      SELECT * FROM public.price WHERE "productId" = '${id}';`);
      return res[0];
    } catch (e) {
      console.log(e);
      return e;
    }
  }
  async getPriceById({ id }: any) {
    try {
      const res = await this.sequelize.query(`
      SELECT * FROM public.price WHERE id = '${id}';`);
      return res[0];
    } catch (e) {
      console.log(e);
      return e;
    }
  }
  async checkProduct(referencia: any) {
    try {
      const res = await this.sequelize.query(`
      SELECT * FROM public.products WHERE reference = '${referencia}';`);
      return res[0];
    } catch (e) {
      console.log(e);
      return e;
    }
  }
  async getImagesProduct({ id }: any) {
    /*SELECT "idImage", "productId", image, alt, "urlImage"
  FROM public."productImages"; */
    try {
      const res = await this.sequelize.query(`
      SELECT "idImage", "productId", image, alt, "urlImage"
      FROM public."productImages" WHERE "productId" = '${id}';`);
      return res[0];
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  async updateProductPrice({ id, price }: any) {
    try {
      const res = await this.sequelize.query(`
      UPDATE public.products
      SET price_base='${price}'
      WHERE "idProducts" = '${id}';`);
      return res[0];
    } catch (e) {
      console.log(e);
      return e;
    }
  }
  async setVariantImage(image: any) {
    try {
      /*INSERT INTO public."productVariantImage"(
  "idImage", "variantId", image, alt, "urlImage")
  VALUES (?, ?, ?, ?, ?); */
      console.log(image, 'objeto')
      const obj = {
        idImage: uuidv1(),
        variantId: image.variantId,
        image: image.image == null ? null : image.image,
        alt: image.alt == null ? 'imagen' : image.alt,
        urlImage: image.urlImage,
      };
      await this.sequelize.query(`
      INSERT INTO public."productVariantImage"(
        "idImage", "variantId", image, alt, "urlImage")
        VALUES ('${obj.idImage}', '${obj.variantId}', ${obj.image == null ? null : `'${obj.image}'`}, '${obj.alt}', '${obj.urlImage}');`);
      return obj;

    } catch (e) {
      console.log(e);
      return e;
    }
  }
  async getVariantImage({ id }: any) {
    try {
      const res = await this.sequelize.query(`
      SELECT * FROM public."productVariantImage" WHERE "variantId" = '${id}';`);
      return res[0];
    } catch (e) {
      console.log(e);
      return e;
    }
  }
  async updateVariantImage(image: any) {
    /*UPDATE public."productVariantImage"
  SET "idImage"=?, "variantId"=?, image=?, alt=?, "urlImage"=?
  WHERE <condition>; */
    try {
      const obj = {
        idImage: image.idImage,
        variantId: image.variantId,
        image: image.image ? image.image : null,
        alt: image.alt ? image.alt : 'imagen',
        urlImage: image.urlImage,
      };
      await this.sequelize.query(`
    UPDATE public."productVariantImage"
    SET "variantId"='${obj.variantId}', image=${obj.image == null ? null : `'${obj.image}'`}, alt='${obj.alt}', "urlImage"='${obj.urlImage}'
    WHERE "idImage" = '${obj.idImage}';`);
      return obj;

    } catch (e) {
      console.log(e);
      return e.message;
    }
  }
  async updateVariant(variant: any) {
    /*UPDATE public.variants
  SET id_variant=?, name_variant=?, metadata_variant=?, description_variant=?, brand=?, price_override=?, weight_override=?, sku=?, product_id=?
  WHERE <condition>; */
    try {
      const obj = {
        id_variant: variant.id_variant,
        name_variant: variant.name_variant,
        metadata_variant: variant.metadata_variant,
        description_variant: variant.description_variant,
        brand: variant.brand,
        price_override: variant.price_override,
        weight_override: variant.weight_override,
        sku: variant.sku,
        product_id: variant.product_id,
      };
      await this.sequelize.query(`
      UPDATE public.variants
      SET name_variant='${obj.name_variant}', metadata_variant='${obj.metadata_variant}', description_variant='${obj.description_variant}', brand='${obj.brand}', price_override=${obj.price_override}, weight_override=${obj.weight_override}, sku='${obj.sku}', product_id='${obj.product_id}'
      WHERE id_variant = '${obj.id_variant}'`);
      return obj;
    } catch (e) {
      console.log(e);
      return e;
    }
  }
}