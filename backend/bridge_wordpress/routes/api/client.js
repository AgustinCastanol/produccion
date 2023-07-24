import express from "express";
import Users from "../../models/usersAdmin.js";
import childrenUser from "../../models/users.js"
import fs from "fs";
import utls from "../../helpers/utils.js"
import utils from "../../helpers/utils.js";
import axios from "axios";
import { DOMParser } from "@xmldom/xmldom";
import knex from "knex";
import { exec } from "child_process";
var router = express.Router();

router.post("/property", async function (request, response, next) {
  try {
    const { id_wordpress } = request.body;
    const users = new Users({ email: null, password: null, id_wordpress: id_wordpress, user: null });
    if (!id_wordpress) {
      return response.status(400).json({ error: ["Error falta id_wordpress", "Error al obtener id_wordpress"] })
    }
    const user_id = await users.getUserId({ id_wordpress });
    if (user_id.error == true) {
      return response.status(400).json({ error: ["Error al obtener user_id", user_id.message] })
    }
    const check_property = await users.getFullProperties({ user_id })
    if (check_property.error == true) {
      return response.status(400).json({ error: ["Error al obtener property", check_property.message] })
    }
    response.status(200).send({ property: check_property })
  } catch (err) {
    console.log(err);
    next(err.message);
  }
})
router.post("/get_users", async function (request, response, next) {
  try {
    const user = new Users({ email: null, password: null, id_wordpress: null, user: null });
    const users = await user.getFullUsers();
    if (users.error == true) {
      return response.status(400).json({ error: ["Error al obtener users", users.message] })
    }
    response.status(200).send({ users: users })
  } catch (err) {
    console.log(err);
    next(err.message);
  }
})
router.post("/validate_CSV", async function (request, response, next) {
  try {
    fs.readFile('temp/products.csv', "utf8", async function (err, data) {

      if (err) {
        return response.status(400).json({ error: ["Error al leer el archivo CSV", err.message] })
      }
      const lines = data.split("\n");
      const headers = lines[0].split(";");
      //quiero contar todos los que tengan posean el tipo de producto == variable y agruparlos por brand
      console.log("validate_CSV 2");
      let products = [];
      let proveedores = {
        "Promos": 0,
        "cdo": 0,
        "marpico": 0,
        "promoopcion": 0,
      }
      let products_per_proveedor = {
        "Promos": [],
        "cdo": [],
        "marpico": [],
        "promoopcion": [],
      }
      let errors = [];
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].split(";");
        let product = {};
        for (let j = 0; j < headers.length; j++) {
          product[headers[j]] = line[j];
        }

        if (product["Tipo"] == "variable") {
          if (product["Brands"] == "Promos") {
            proveedores["Promos"] += 1;
            products_per_proveedor["Promos"].push(product["SKU"])
          } else if (product["Brands"] == "CDO") {
            proveedores["cdo"] += 1;
            products_per_proveedor["cdo"].push(product["SKU"])
          } else if (product["Brands"] == "Marpico") {
            proveedores["marpico"] += 1;
            products_per_proveedor["marpico"].push(product["SKU"])
          } else if (product["Brands"] == "PromoOpcion") {
            proveedores["promoopcion"] += 1;
            products_per_proveedor["promoopcion"].push(product["SKU"])
          } else {
            errors.push(product);
          }
          products.push(product["SKU"]);
        }
      }
      response.status(200).send(JSON.stringify({ products, proveedores: proveedores, products_per_proveedor, errors: errors }))

    })

  } catch (err) {
    next(err.message)
  }
})

router.post("/validate_supplier", async function (request, response, next) {
  try {
    let products = [];
    const query = `SELECT * FROM public."products"
    LEFT JOIN public."collection" ON "products"."collection_id" = "collection"."idCollection"
    LEFT JOIN public."categories" ON "products"."category_id" = "categories"."id_categorias"
    LEFT JOIN public."productImages" ON "products"."idProducts" = "productImages"."productId"
    LEFT JOIN public."supplier" ON "products"."supplier" = "supplier"."id"
    LEFT JOIN public."price" ON "products"."idProducts" = "price"."productId"
	where (supplier = 'ea43c130-8df1-4eb8-9231-e84c1bc156e4')`
    const products_db = await knex_products_db.raw(query);
    // for (let c = 0; c < products_db.rows.length; c++) {
    //   try {
    //     await new Promise((resolve) => setTimeout(resolve, 300));
    //     const temp = products_db.rows[c];
    //     const variants = await knex_products_db("variants").select("*").where("product_id", temp.idProducts);
    //     for (let i = 0; i < variants.length; i++) {
    //       const variant = variants[i];
    //       await new Promise((resolve) => setTimeout(resolve, 200));
    //       const variant_images = await knex_products_db.raw(`SELECT * FROM public."productVariantImage" WHERE "variantId" = '${variants[i].id_variant}'`)
    //       const variant_stock = await knex_products_db("stock").select("*")
    //         .join("stockLocation", "stockLocation.idStockLocation", "=", "stock.locationId")
    //         .where("variant_id", variants[i].id_variant);
    //     console.log("temp", c, products_db.rows.length);
    //   } catch (err) {
    //     continue;
    //   }
    // }

    // agrupar por producto repetido siguiendo el valor de la referencia
    for (let i = 0; i < products_db.rows.length; i++) {
      const temp = products_db.rows[i];
      //buscar si en la variable products ya existe el producto
      const index = products.findIndex((product) => product["SKU"] == temp["reference"]);
      if (index == -1) {
        //si no existe el producto, lo agrego
        products.push({
          "count": 1,
          "SKU": temp["reference"],
          "products": [temp],
        })
      } else {
        //si existe el producto, lo agrego al array de productos
        products[index]["products"].push(temp);
        products[index]["count"] += 1;
      }

    }
    for (let i = 0; i < products.length; i++) {
      const temp = products[i];
      if (temp.products.length >= 1) {
        for (let c = 1; c < temp.products.length; c++) {
          const product = temp.products[c];
          console.log("producto", product.name_product);
          const variants = await knex_products_db("variants").select("*").where("product_id", product.idProducts);
          for (let i = 0; i < variants.length; i++) {
            const variant = variants[i];
            console.log("varian", variant.id_variant, variant.name_variant);
            await new Promise((resolve) => setTimeout(resolve, 200));
            const variant_images = await knex_products_db.raw(`SELECT * FROM public."productVariantImage" WHERE "variantId" = '${variants[i].id_variant}'`)
            const variant_stock = await knex_products_db("stock").select("*")
              .join("stockLocation", "stockLocation.idStockLocation", "=", "stock.locationId")
              .where("variant_id", variants[i].id_variant);
            await new Promise((resolve) => setTimeout(resolve, 300));

            for (let x = 0; x < variant_images.rows.length; x++) {
              await new Promise((resolve) => setTimeout(resolve, 400));

              const image = variant_images.rows[x];
              await knex_products_db("productVariantImage").delete().where("idImage", image.idImage);
            }
            for (let x = 0; x < variant_stock.length; x++) {

              await new Promise((resolve) => setTimeout(resolve, 200));

              const stock = variant_stock[x];
              await knex_products_db("stock").delete().where("idStock", stock.idStock);
            }
            await new Promise((resolve) => setTimeout(resolve, 200));

            await knex_products_db("variants").delete().where("id_variant", variant.id_variant);
            console.log("variant", i, variants.length);
          }
          await new Promise((resolve) => setTimeout(resolve, 1000));

          await knex_products_db("price").delete().where("productId", product.idProducts);
          await knex_products_db("productImages").delete().where("productId", product.idProducts);
          await knex_products_db("products").delete().where("idProducts", product.idProducts);
        }
      }
      console.log("product", i, products.length);
    }


    return response.status(200).send({ products })
  } catch (err) {
    next(err.message)
  }
})
router.post("/clear_esferos", async function (request, response, next) {
  try {
    // const URL = "http://back.soyave.com:48700/create_image_product"
    const URL = "http://localhost:48700/create_image_product"
    const USER = 'DKLL9S98JGMC4RRGLQF2Z4Z2J1RTLJ3N'
    fs.readFile('temp/esferos.json', 'utf8', async function (err, data_esferos) {
      if (err) {
        console.log("An error occured while reading JSON Object from File.");
        return console.log(err);
      }
      const products = await knex_products_db("products").select("*").where("supplier", "9c124ac9-ceaa-4ccb-b026-8906d75fc430");
      const size = products.length;
      for (let i = 0; i < size; i++) {
        try {
          console.log("temp", i, products.length)
          const esferos = JSON.parse(data_esferos);
          const product = products[i];
          const productImages = await knex_products_db("productImages").select("*").where("productId", product.idProducts);
          console.log(productImages, "imagenes")
          let urlImage = JSON.parse(productImages[0].urlImage);
          console.log(urlImage, "url")
          //buscar los productos con products[i].name_product en el json que tiene un array de productos
          const index = esferos.findIndex((esfero) => esfero.name == product.name_product);
          console.log(index, "index")
          if (index == -1) {
            continue;
          }
          // console.log(esferos[index].image, "esfero")
          const imagenes = esferos[index].image;

          if (imagenes.length == 0) {
            continue;
          }
          if (urlImage.length == imagenes.length && urlImage[0].includes('https://back.soyave.com')) {
            console.log("iguales")
            continue;
          }

          const arrayImage = [];
          for (let x = 0; x < imagenes.length; x++) {
            console.log(imagenes[x], "imagen")
              const imageBit = await axios.get(imagenes[x], { auth: { username: USER, password: "" }, responseType: 'arraybuffer' });
              const formData = new FormData();
              formData.append('image', new Blob([imageBit.data]), `${product.reference + x}.png`);
              const newPath = await axios.post(URL, formData, {
                headers: {
                  'Content-Type': 'multipart/form-data'
                }
              });
              console.log(newPath.data.data.path, "path")
              arrayImage.push(newPath.data.data.path);
            }
            console.log(arrayImage, "array")
            urlImage = JSON.stringify(arrayImage);
            console.log(urlImage, "url")
            await knex_products_db("productImages").update({ urlImage }).where("productId", product.idProducts);

            // const variants = await knex_products_db("variants").select("*").where("product_id", product.idProducts);
            // for (let c = 0; variants.length > c; c++) {
            //   const variant = variants[c];
            //   console.log(variant, "variantes")
            //   const variant_images = await knex_products_db.raw(`SELECT * FROM public."productVariantImage" WHERE "variantId" = '${variant.id_variant}'`)
            //   console.log(variant_images.rows[0], "imagenes")
            //   let variants_image = JSON.parse(variant_images.rows[0].urlImage);
            //   console.log(variants_image, "variantes")
            //   if (variants_image[0] == 'h') {
            //     console.log("entreo")
            //     const imageBit = await axios.get(variants_image, { auth: { username: USER, password: "" }, responseType: 'arraybuffer' });
            //     const formData = new FormData();
            //     formData.append('image', new Blob([imageBit.data]), `${product.reference}-${variant.sku}.png`);
            //     const newPath = await axios.post(URL, formData, {
            //       headers: {
            //         'Content-Type': 'multipart/form-data'
            //       }
            //     });
            //     console.log(newPath.data.data.path, "path")
            //     variants_image = newPath.data.data.path;
            //     await knex_products_db("productVariantImage").update({ urlImage: JSON.stringify(variants_image) }).where("idImage", variant_images.rows[0].idImage);

            //   } else {
            //     if (variants_image.length !== 0) {
            //       for (let x = 0; variants_image.length > x; x++) {
            //         console.log(variants_image[x], "imagenes")
            //         if (variants_image[x] == null || variants_image[x] == undefined || variants_image[x] == '' || variant_images[x].urlImage.includes('https://back.soyave.com')) continue;
            //         //   try{
            //         const imageBit = await axios.get(variants_image[x], { auth: { username: USER, password: "" }, responseType: 'arraybuffer' });
            //         const formData = new FormData();
            //         formData.append('image', new Blob([imageBit.data]), `${product.reference}-${variant.sku}.png`);
            //         const newPath = await axios.post(URL, formData, {
            //           headers: {
            //             'Content-Type': 'multipart/form-data'
            //           }
            //         });
            //         console.log(newPath.data.data.path, "path")
            //         variants_image[x] = newPath.data.data.path;

            //         //   }catch(err){
            //         //     variants_image[x] = '';
            //         //     continue
            //         //   }
            //       }
            //       await knex_products_db("productVariantImage").update("urlImage", JSON.stringify(variants_image)).where("idImage", variant_images.rows[0].idImage);
            //     }
            //   }
            // }

            // const imageBit = await axios.get(urlImage, { auth: { username: USER, password: "" }, responseType: 'arraybuffer' });
          // }
        } catch (err) {
          console.log(err)
          console.log("tempo", i)
        }
      }
    });
    return response.status(200).send({ message: "ok" })
  } catch (err) {
    console.log(err)
    next(err.message)
  }
})
router.post("/clear_variants", async function (request, response, next) {
  try {
    const products = await knex_products_db("products").select("*").where("supplier", "408afa0a-41c1-4c31-a831-8de0dfc3d30a");
    const size = products.length;
    for (let i = 0; i < size; i++) {
      const product = products[i];
      const variantesAgrupadas = new Map();
      const variants = await knex_products_db("variants").select("*").where("product_id", product.idProducts);
      // console.log(variants, "variantes db")
      variants.forEach(variant => {
        const key = variant.sku;
        const collection = variantesAgrupadas.get(key);
        if (!collection) {
          variantesAgrupadas.set(key, [variant]);
        } else {
          collection.push(variant);
        }
      }
      );
      // console.log(variantesAgrupadas, "variantes")
      const variantes = Array.from(variantesAgrupadas.values());
      // console.log(variantes, "variantes")
      for (let x = 0; variantes.length > x; x++) {
        const variant = variantes[x];
        if (variant.length > 1) {
          for (let y = 1; variant.length > y; y++) {
            console.log("id variant")
            const image = await knex_products_db("productVariantImage").select("*").where("variantId", variant[y].id_variant);
            // console.log(image, "imagen")
            if (image.length == 0) {
              console.log("sin imagen")
              const stock = await knex_products_db("stock").select("*").where("variant_id", variant[y].id_variant);
              for (let z = 0; stock.length > z; z++) {
                console.log("stock eliminado", stock[z].idStock)
                await knex_products_db("stock").where("idStock", stock[z].idStock).del();
              }
              console.log("variant eliminado", variant[y].id_variant)
              await knex_products_db("variants").where("id_variant", variant[y].id_variant).del();
            }
          }
        }
      }
    }
    return response.status(200).send({ message: "ok" })
  } catch (err) {
    next(err.message)
  }
})
router.post("/load_CSV", async function (request, response, next) {
  try {
    const count = await knex_products_db("products").count("idProducts as total");
    const total = count[0].total;
    const times = Math.floor(total / 1000);
    const limit = 1000;
    const offset = 1000;
    let products = [];
    let proveedores = {
      "Promos": 0,
      "cdo": 0,
      "marpico": 0,
      "promoopcion": 0,
      "esferos": 0

    }
    let errors = [];
    // const products_db = await knex_products_db("products").select("*")
    //   .join("collection", "products.collection_id", "=", "collection.idCollection")
    //   .join("categories", "products.category_id", "=", "categories.id_categorias")
    //   .join("productImages", "products.idProducts", "=", "productImages.productId")
    //   .join("supplier", "products.supplier", "=", "supplier.id")
    //   .join("price", "products.idProducts", "=", "price.productId")
    //   .limit(limit).offset(i * offset);
    const { rows } = await global.knex_products_db.raw(`
      SELECT * FROM public."products"
      LEFT JOIN public."collection" ON "products"."collection_id" = "collection"."idCollection"
      LEFT JOIN public."categories" ON "products"."category_id" = "categories"."id_categorias"
      LEFT JOIN public."productImages" ON "products"."idProducts" = "productImages"."productId"
      LEFT JOIN public."supplier" ON "products"."supplier" = "supplier"."id"
      LEFT JOIN public."price" ON "products"."idProducts" = "price"."productId"
      `);
    const products_db = rows;

    for (let c = 0; c < products_db.length; c++) {
      if (products_db[c].name_supplier == 'Promos') {
        // continue;
        proveedores.Promos++;
      }
      if (products_db[c].name_supplier == 'CDO') {
        proveedores.cdo++;
      }
      if (products_db[c].name_supplier == 'Marpico') {
        proveedores.marpico++;
      }
      if (products_db[c].name_supplier == 'PromoOpcion') {
        proveedores.promoopcion++;
      }
      if (products_db[c].name_supplier == 'ProveedorAdministrador(back)') {
        continue;
      }
      if (products_db[c].name_supplier == 'esferos') {
        proveedores.esferos++;
        // continue;

      }
      console.log(products_db[c].reference)
      products_db[c].metadata = "{}"
      try {
        if (products_db[c].parent_id != null) {
          const parent_category = await knex_products_db("categories").select("name_category").where("id_categorias", products_db[c].parent_id);
          products_db[c].parent = parent_category[0].name_category;
        }
        const variants = await knex_products_db("variants").select("*").where("product_id", products_db[c].idProducts)
        products_db[c].variants = variants;
        for (let v = 0; v < variants.length; v++) {
          // await new Promise((resolve) => setTimeout(resolve, 100));
          const variant_images = await knex_products_db.raw(`SELECT * FROM public."productVariantImage" WHERE "variantId" = '${variants[v].id_variant}'`)
          const variant_stock = await knex_products_db("stock").select("*")
            .join("stockLocation", "stockLocation.idStockLocation", "=", "stock.locationId")
            .where("variant_id", variants[v].id_variant);
          variants[v].images = variant_images.rows;
          variants[v].stock = variant_stock;
        }
      } catch (err) {
        console.log(err)
        errors += err;
        continue;
      }
    }
    console.log("hola")
    products = [...products, ...products_db, errors];
    console.log("hola 2")
    // convertirlo en un archivo json a los datos obtenidos y guardarlos en la carpeta temp
    const json = JSON.stringify(products);
    console.log("hola3")
    fs.writeFile('temp/products.json', json, 'utf8', function (err) {
      if (err) {
        console.log("An error occured while writing JSON Object to File.");
        return console.log(err);
      }
      console.log("JSON file has been saved.");
    });
    // await get_CSV(request, response, next);
    response.status(200).send({message: "ok"})
  } catch (err) {
    console.log(err);
    next(err.message);
  }
})
router.post("/get_CSV", async function (request, response, next) {
  try {
    const collection_ofeta = '88f91efa-e7f0-4a68-b330-9f3720a738c5'
    const collection_precio_neto = 'b4995e35-2373-4b36-a3f8-d147f6833a5a'
    let price_type = 'S'
    let error = []
    //leer el archivo que esta en la carpeta temp
    let proveedores = {
      "Promos": 0,
      "cdo": 0,
      "marpico": 0,
      "promoopcion": 0,
      "esferos": 0,
      "promoline":0

    }
    fs.readFile('temp/products.json', 'utf8', async function (err, data) {
      if (err) {
        console.log("An error occured while reading JSON Object from File.");
        return console.log(err);
      }
      const products = JSON.parse(data);
      let products_csv = `Tipo;SKU;Nombre;Descripción corta;Descripción;¿Existencias?;Inventario;Inventario Local;Inventario Zona Franca; Inventario En Transito;Peso (kg);Longitud (cm);Anchura (cm);Altura (cm);Empaque (und);Precio rebajado;Precio normal;Precio neto;Categorías;Etiquetas;Imágenes;Superior;Posición;Brands;Gestión de inventario;Tipo de Precio;Orden;Nombre del atributo 1;Valor(es) del atributo 1;Atributo visible 1;Atributo global 1;Nombre del atributo 2;Valor(es) del atributo 2;Atributo visible 2;Atributo global 2\n`;
      for (let i = 0; i < products.length; i++) {
        let priority = 0;
        if (products[i].variants == undefined) {
          error.push(products[i])
          continue;
        }
        if (products[i].name_supplier == 'Promos') {
          if (products[i].urlImage == null) {
            error.push(products[i])
            continue;
          }
          if (products[i].description_product == 'undefined') {
            products[i].description_product = products[i].name_product;
          }
          proveedores.Promos++;
          // if (products[i].reference == 'VA-948') {
          //   console.log(products[i].variants[0].stock)
          // }
          if (products[i].variants.length == 0) {
            products[i].variants = [
              {
                id_variant: '',
                name_variant: products[i].name_product,
                metadata_variant: '{}',
                description_variant: '  ',
                brand: 'not-brand',
                price_override: 0,
                weight_override: 0,
                sku: products[i].reference+"-v",
                product_id: products[i].idProducts,
                images: [],
                stock: [
                  {
                    idStock: 'd2ea49b6-fed4-45ed-aa34-7b4f44c533ed',
                    locationId: '0994b3d5-becd-401f-983f-47447352ce19',
                    quantity: 0,
                    quantity_allocated: 0,
                    variant_id: 'c71e4de0-8a6a-441e-aee9-f7b7e344c590',
                    idStockLocation: '0994b3d5-becd-401f-983f-47447352ce19',
                    name: 'Local'
                  },
                  {
                    idStock: '32573227-6b09-4ca9-baf4-5abc7f0f0d46',
                    locationId: '9b245cdf-acc8-4655-9738-ee432f654e20',
                    quantity: 0,
                    quantity_allocated: 0,
                    variant_id: 'c71e4de0-8a6a-441e-aee9-f7b7e344c590',
                    idStockLocation: '9b245cdf-acc8-4655-9738-ee432f654e20',
                    name: 'ZonaFranca'
                  },
                  {
                    idStock: '2b769b65-c3e7-49a1-9d53-5c62a7eacc64',
                    locationId: '3b257993-638c-4505-ad1d-5a6dd24d9ac5',
                    quantity: 0,
                    quantity_allocated: 0,
                    variant_id: 'c71e4de0-8a6a-441e-aee9-f7b7e344c590',
                    idStockLocation: '3b257993-638c-4505-ad1d-5a6dd24d9ac5',
                    name: 'Total'
                  },
                  {
                    idStock: 'aa21b916-d484-4238-b77e-6461fe9e6378',
                    locationId: 'a5db0dfa-2d96-4950-b382-839b3acfd6ae',
                    quantity: 0,
                    quantity_allocated: 0,
                    variant_id: 'c71e4de0-8a6a-441e-aee9-f7b7e344c590',
                    idStockLocation: 'a5db0dfa-2d96-4950-b382-839b3acfd6ae',
                    name: 'Transito'
                  
              }]
          }]
        }
      }
        if (products[i].name_supplier == 'CDO') {
          proveedores.cdo++;
          priority = -1;
          // continue;
        }
        if (products[i].name_supplier == 'Marpico') {
          proveedores.marpico++;
          // continue;
        }
        if (products[i].name_supplier == 'PromoOpcion') {
          proveedores.promoopcion++;
          // continue;
          if(products[i].urlImage == null || products[i].urlImage == undefined || products[i].urlImage == '' || products[i].urlImage == '[]'){
            error.push(products[i])
            continue;
          }
          if(products[i].description_product == 'undefined' || products[i].description_product == undefined){
            console.log(products[i].name_product,"producto sin descripcion de promoopcion")
            products[i].description_product = products[i].name_product;
          }
          let name_aux = '';
          name_aux = products[i].name_product.replace(/;/g, "");
          name_aux = name_aux.replace(/(\r\n|\n|\r)/gm, " ");
          name_aux = utils.corregirTexto(name_aux);
          products[i].name_product = name_aux;
        }
        if (products[i].name_supplier == 'ProveedorAdministrador(back)') {
          continue;
        }
        if (products[i].name_supplier == 'esferos') {
          // console.log(products[i])
          if (products[i].urlImage != null && products[i].urlImage.includes('https://esferos.com')) {
            error.push(products[i])
            continue
          }
          proveedores.esferos++;
          products[i].variants.map((variant) => {
            if (products[i].urlImage != null && products[i].urlImage.includes('https://esferos.com')) {
              products[i].urlImage = '';
            }
            if (variant.images.length !== 0 && variant.images[0].urlImage.includes('https://esferos.com')) {
              variant.images[0].urlImage = ''
            }
          })
        }
        if(products[i].name_supplier == 'PROMOLINE'){
          proveedores.promoline++;
          products[i].reference = 'P'+products[i].reference
          if(products[i].urlImage == '' || products[i].urlImage == null || products[i].urlImage == '[""]'){
            error.push(products[i])
            continue;
          }
          products[i].variants.map((variant) => {
            if(variant.images.length !=0){
              variant.images.map((image) => {
                if(!image.urlImage.includes('https://')){
                  image.urlImage = '';
                }
              })
            }
          })
        }
        if(products[i].price == null){
          products[i].price = 0;
        }
        let metadata = null;
        let oferta = false;
        if(products[i].collection_id == collection_ofeta){
          oferta = true;
        }
        //reemplazar los . y los ; de las descripciones si lo tienen
        // console.log(products[i].description_product)
        let description_product = '';
        if (products[i].description_product != 'undefined' || products[i].description_product != undefined || products[i].description_product != null || products[i].description_product != '' || products[i].description_product != 'null') {
          //quietar los saltos de linea
          // console.log(products[i].description_product, 'description_product', products[i].name_product)
          description_product = products[i].description_product.replace(/;/g, "");
          description_product = description_product.replace(/(\r\n|\n|\r)/gm, " ");
          description_product = utils.corregirTexto(description_product);

        } else {
          description_product = '';
        }
        if (products[i].description_product == 'not description') {
          description_product = products[i].name_product;
        }
        let precio_sugerido = 0;
        if (products[i].metadata !== '[object Object]' && products[i].metadata !== '' ) {
          metadata = products[i].metadata != null ? JSON.parse(products[i].metadata) : null;
        }
        precio_sugerido = JSON.parse(products[i].metadata_price);
        if (products[i].metadata_price == "{}") {
          precio_sugerido = 0;
        } else {
          // if(products[i].name_supplier == 'esferos'){
          //   precio_sugerido = products[i].price * 5/3;
          // }
          if (products[i].name_supplier == 'Promos' || products[i].name_supplier == 'PromoOpcion' || products[i].name_supplier == 'esferos' || products[i].name_supplier == 'PROMOLINE') {
            if (precio_sugerido !== null && precio_sugerido.precioSugerido != undefined) {
              if (typeof precio_sugerido.precioSugerido == 'number') {
                //convertir a int
                precio_sugerido = precio_sugerido.precioSugerido.toString().split(".");
                precio_sugerido = precio_sugerido[0];
              } else {
                precio_sugerido = precio_sugerido.precioSugerido.split(".");
                precio_sugerido = precio_sugerido[0];
              }
            }
          }
          if (products[i].name_supplier == 'CDO') {
            precio_sugerido.precioSugerido = precio_sugerido.precioSugerido * 5/4;
            //eliminar los decimales
            precio_sugerido = precio_sugerido.precioSugerido.toString().split(".")[0];
            // console.log(precio_sugerido)
          }

          if (precio_sugerido != null && precio_sugerido.precioSugerido != undefined) {
            precio_sugerido = (precio_sugerido.precioSugerido !== null && typeof precio_sugerido.precioSugerido != 'number') ? precio_sugerido.precioSugerido.split(".") : precio_sugerido.precioSugerido;
            precio_sugerido = precio_sugerido.length > 0 ? precio_sugerido[0] : precio_sugerido;
          } else {
            if (precio_sugerido == null) {
              precio_sugerido = products[i].price * 1.4;
            }
          }
        }
        if (precio_sugerido < 0) {
          precio_sugerido = 0;
        }
        if (products[i].price < 0) {
          products[i].price = 0;
        }
        let name_product_slug = products[i].name_product.replace(/ /g, ",");
        let imagenes = ""
        if (products[i].urlImage !== null) {
          if (products[i].urlImage[0] == "[") {
            imagenes = JSON.parse(products[i].urlImage);

            for (let m = 0; m < imagenes.length; m++) {
              if (imagenes[m][0] == '[') {
                // console.log(imagenes[m])
                //eliminar ese elemento
                imagenes.splice(m, 1);

              }
            }
            if (products[i].name_supplier == 'PromoOpcion') {
              // console.log(imagenes)
              // console.log("cleaning images")
              //quiero buscar el elemento del array que tenga la palabra padre y ponerlo al frente del array
              for(let t = 0 ; imagenes.length > t ; t++){
                if(imagenes[t].includes('padre')){
                  // console.log("encontrado")
                  let aux = imagenes[t];
                  imagenes.splice(t,1);
                  imagenes.unshift(aux);
                }
              }
              // console.log(imagenes,"sali")
            
          }
            // console.log(imagenes)

            imagenes = imagenes.join(",");
          } else {
            imagenes = products[i].urlImage;
          }
        } else {
          imagenes = '';
          error.push(products[i])
        }

        let colors = await utils.get_colors_at_sku(products[i].variants, products[i].name_supplier == 'PromoOpcion')
        if (colors.length > 0) {
          colors = await utils.homologationcolor(colors);
          colors = colors.join(",");
        } else {
          colors = null;
        }
        let spaces = await utils.get_space_at_sku(products[i].variants)
        if (spaces.length > 0) {
          spaces = [...new Set(spaces)]
          spaces = spaces.join(",");
        } else {
          spaces = null;
        }
        let auxCategories = ''
        let categories = products[i].parent == null ? products[i].name_category : `${products[i].parent} > ${products[i].name_category}`;
        console.log(products[i].parent)
        categories = utils.searchCategoriesExtra(categories, products[i].name_product)
        auxCategories = categories.split(",");
        if (auxCategories.length > 1 && auxCategories[1] == '') {
          // console.log("auxCategories",auxCategories)
          categories = auxCategories[0];
        }
        categories = utils.searchCategoriesAndAppend(categories, products[i].name_product, ['paraguas golf'], 'Paraguas e impermeables > Paraguas Golf', null)
        auxCategories = categories.split(",");
        if (auxCategories.length > 1 && auxCategories[1] == '') {
          // console.log("auxCategories",auxCategories)
          categories = auxCategories[0];
        }
        categories = utils.searchCategoriesAndAppend(categories, products[i].name_product, ['mini paraguas'], 'Paraguas e impermeables > Paraguas Mini', null)
        auxCategories = categories.split(",");
        if (auxCategories.length > 1 && auxCategories[1] == '') {
          // console.log("auxCategories",auxCategories)
          categories = auxCategories[0];
        }
        categories = utils.searchCategoriesAndAppend(categories, products[i].name_product, ['rainpro'], 'Paraguas e impermeables > Paraguas Premium', 'mini')

         auxCategories = categories.split(",");
        if (auxCategories.length > 1 && auxCategories[1] == '') {
          // console.log("auxCategories",auxCategories)
          categories = auxCategories[0];
        }
        if(oferta){
          categories+= ',Ofertas'
        }
        let sum_total_father= 0;
        let sum_franca_father = 0;
        let sum_transito_father = 0;
        let sum_local_father = 0;
        for(let c = 0; c < products[i].variants.length; c++){
          const variation = products[i].variants[c];
          let stock = {
            local: { quantity: 0 },
            zonaFranca: { quantity: 0 },
            total: { quantity: 0 },
            transito: { quantity: 0 }
          }
          if (variation.stock != undefined && variation.stock.length > 0) {
            // console.log("variation.stock", variation.stock)
            let total = variation.stock.find((stock) => {
              return stock.name == "Total"
            })
            let local = variation.stock.find((stock) => {
              return stock.name == "Local"
            })
            let zonaFranca = variation.stock.find((stock) => {
              return stock.name == "ZonaFranca"
            })
            let transito = variation.stock.find((stock) => {
              return stock.name == "Transito"
            });
            // console.log(variation.stock)
            stock.total = total || { quantity: 0 };
            stock.local = local || { quantity: 0 };
            stock.zonaFranca = zonaFranca || { quantity: 0 };
            stock.transito = transito || { quantity: 0 };
          } else {
            stock = {
              local: { quantity: 0 },
              zonaFranca: { quantity: 0 },
              total: { quantity: 0 },
              transito: { quantity: 0 }
            }
          }
          sum_franca_father += stock.zonaFranca.quantity >=0? stock.zonaFranca.quantity: 0;
          sum_transito_father += stock.transito.quantity >=0?stock.transito.quantity:0 ;
          sum_local_father += stock.local.quantity>=0?stock.local.quantity:0;
          sum_total_father += stock.total.quantity>=0?stock.total.quantity:0;
        }
        sum_total_father = sum_total_father >=0?sum_total_father:sum_franca_father+sum_local_father;
        if(sum_total_father == 0 && products[i].name_supplier == 'esferos'){
          continue;
        }
        if(products[i].collection_id == collection_ofeta){ 
          price_type = 'O'
        }else if(products[i].collection_id == collection_precio_neto){
          price_type = 'N'
        }else {
          price_type = 'S'
        }
        let father_product = `variable;${products[i].reference};${products[i].name_product};${description_product};${description_product};instock;${sum_total_father};${sum_local_father};${sum_franca_father};${sum_transito_father};${products[i].weight};${(metadata != null && metadata.medidas_largo != undefined) ? metadata.medidas_largo : ''};${(metadata != null && metadata.medidas_ancho != undefined) ? metadata.medidas_ancho : ''};${(metadata != null && metadata.medidas_alto) ? metadata.medidas_alto : ''};;;${precio_sugerido == null ? 0 : precio_sugerido};${products[i].price};${categories};${products[i].slug_category + ',' +name_product_slug};${imagenes};;0;${products[i].name_supplier};no;${price_type};${priority};`;
        if (colors != null && spaces == null) {
          // console.log("son color")
          // console.log("space", spaces)
          father_product += `;;1;1`;
        }
        if (spaces != null && colors == null) {
          // console.log("son space")
          father_product += `;;1;1`;
        }
        if (spaces != null && colors != null) {
          // console.log("colors", colors)
          // console.log("space", spaces)
          father_product += `;;1;1;`;
          father_product += `;;2;2`;
        }
        father_product += '\n'
        // console.log("precio_sugerido", precio_sugerido, JSON.parse(products[i].metadata_price),i)
        if (products[i].variants.length == 1) {

          const variation = products[i].variants[0];
          let img_variant = variation.images[0] !== undefined ? variation.images[0].urlImage : null;
          if (img_variant != null) {
            if (img_variant[0] == "[") {
              img_variant = JSON.parse(img_variant);
              img_variant = img_variant.join(",");
            } else {
              img_variant = img_variant;
            }
            if (!(img_variant.includes(imagenes))) {
              img_variant = imagenes+ ',' + img_variant;
            }
          } else {
            img_variant = imagenes;
          }
          if (img_variant.startsWith(',')) {
            img_variant = img_variant.substring(1);
          }
          let stock = {
            local: {},
            zonaFranca: {},
            total: {},
            transito: {}
          }
          if (variation.stock != undefined && variation.stock.length > 0) {
            // console.log("variation.stock", variation.stock)
            let total = variation.stock.find((stock) => {
              return stock.name == "Total"
            })
            let local = variation.stock.find((stock) => {
              return stock.name == "Local"
            })
            let zonaFranca = variation.stock.find((stock) => {
              return stock.name == "ZonaFranca"
            })
            let transito = variation.stock.find((stock) => {
              return stock.name == "Transito"
            });
            //console.log(variation.stock)
            stock.total = total || { quantity: 0 };
            stock.local = local || { quantity: 0 };
            stock.zonaFranca = zonaFranca || { quantity: 0 };
            stock.transito = transito || { quantity: 0 };
          } else {
            stock = {
              local: { quantity: 0 },
              zonaFranca: { quantity: 0 },
              total: { quantity: 0 },
              transito: { quantity: 0 }
            }
          }
          let auxCategories = ''
          let categories = products[i].parent == null ? products[i].name_category : `${products[i].parent} > ${products[i].name_category}`;
          categories = utils.searchCategoriesExtra(categories, products[i].name_product)
          
          auxCategories = categories.split(",");
          if (auxCategories.length > 1 && auxCategories[1] == '') {
            // console.log("auxCategories",auxCategories)
            categories = auxCategories[0];
          }
          categories = utils.searchCategoriesAndAppend(categories, products[i].name_product, ['paraguas golf'], 'Paraguas e impermeables > Paraguas Golf', null)
          auxCategories = categories.split(",");
          if (auxCategories.length > 1 && auxCategories[1] == '') {
            // console.log("auxCategories",auxCategories)
            categories = auxCategories[0];
          }
          categories = utils.searchCategoriesAndAppend(categories, products[i].name_product, ['mini paraguas'], 'Paraguas e impermeables > Paraguas Mini', null)
          auxCategories = categories.split(",");
          if (auxCategories.length > 1 && auxCategories[1] == '') {
            // console.log("auxCategories",auxCategories)
            categories = auxCategories[0];
          }
          categories = utils.searchCategoriesAndAppend(categories, products[i].name_product, ['rainpro'], 'Paraguas e impermeables > Paraguas Premium', 'mini')

          auxCategories = categories.split(",");
          if (auxCategories.length > 1 && auxCategories[1] == '') {
            // console.log("auxCategories",auxCategories)
            categories = auxCategories[0];
          }
          if(oferta){
            categories+= ',Ofertas'
          }
          // console.log(categories, "total categories")
          let sum = stock.total.quantity + stock.local.quantity + stock.zonaFranca.quantity;
          if (products[i].reference == "VA-128") {
            console.log("stock", stock)
          }
          father_product = `simple;${products[i].reference};${products[i].name_product};${description_product};${description_product};${stock.total.quantity == undefined || stock.total.quantity == 0 ? "outofstock" : "instock"};${stock.total.quantity == 0 ? sum : stock.total.quantity == undefined ? 0 : stock.total.quantity};${stock.local.quantity};${stock.zonaFranca.quantity};${stock.transito.quantity};${variation.weight_override > 0 ? variation.weight_override : ''};;;;;;${precio_sugerido};${products[i].price};${categories};${products[i].slug_category + ',' + name_product_slug};${img_variant};${products[i].reference};0;${products[i].name_supplier};no;${price_type};${priority};`
          if (colors != null && spaces == null) {
            // console.log("son color")
            // console.log("space", spaces)
            father_product += `Color;${colors};1;1`;
          }
          if (spaces != null && colors == null) {
            // console.log("son space")
            father_product += `Espacio;${spaces};1;1`;
          }
          if (spaces != null && colors != null) {
            // console.log("colors", colors)
            // console.log("space", spaces)
            father_product += `Color;${colors};1;1;`;
            father_product += `Espacio;${spaces};2;2`;
          }
          father_product += '\n'
          products_csv += father_product;
        } else {
          products_csv += father_product;
          for (let c = 0; c < products[i].variants.length; c++) {
            let variation = products[i].variants[c];
            if (variation.sku.startsWith("-")) {

              variation.sku = products[i].reference + variation.sku;
            }
            if (variation.sku.startsWith("#")) {
              variation.sku = variation.sku.replace("#", "");

            }
            let stock = {
              local: { quantity: 0 },
              zonaFranca: { quantity: 0 },
              total: { quantity: 0 },
              transito: { quantity: 0 }
            }
            if (variation.stock != undefined && variation.stock.length > 0) {
              // console.log("variation.stock", variation.stock)
              let total = variation.stock.find((stock) => {
                return stock.name == "Total"
              })
              let local = variation.stock.find((stock) => {
                return stock.name == "Local"
              })
              let zonaFranca = variation.stock.find((stock) => {
                return stock.name == "ZonaFranca"
              })
              let transito = variation.stock.find((stock) => {
                return stock.name == "Transito"
              });
              // console.log(variation.stock)
              stock.total = total || { quantity: 0 };
              stock.local = local || { quantity: 0 };
              stock.zonaFranca = zonaFranca || { quantity: 0 };
              stock.transito = transito || { quantity: 0 };
            } else {
              stock = {
                local: { quantity: 0 },
                zonaFranca: { quantity: 0 },
                total: { quantity: 0 },
                transito: { quantity: 0 }
              }
            }
            let color = await utils.get_color(variation.sku, products[i].name_supplier == 'PromoOpcion');
            color = await utils.homologationcolor(color);
            let space = await utils.get_space(variation.sku);
            let img_variant = variation.images
            if (img_variant == undefined) {
              img_variant = '';
            } else {
              if (img_variant.length > 0) {
                img_variant = img_variant.map(e => {
                  if (e.urlImage == 'empty' || e.urlImage == '' || e.urlImage === 'undefined') {
                    return ''
                  }
                  return JSON.parse(e.urlImage).join(",")
                })
                img_variant = img_variant.join(",");
                //quiero validar si las imagenes de las variantes son distintas que la del padre, si son iguales las dejo vacias
                if (imagenes.includes(img_variant) && imagenes == img_variant) {
                  img_variant = '';
                  // console.log("iguales")
                }
              } else {
                img_variant = '';
              }
            }

            /*
            {"material":"PU (Poliuretano).","empaque_individual":"","empaque_unds_caja":250,"empaque_und_medida":"","empaque_largo":"62.00","empaque_ancho":"31.50","empaque_alto":"29.50","empaque_peso_neto":"5.00","empaque_peso_bruto":"6.00","area_impresion":"2,8 x 2,2 cm.","medidas_largo":null,"medidas_ancho":null,"medidas_alto":null,"medidas_diametro":6.3,"medidas_peso_neto":"20.00","tecnica_marca_codigo":"5500047","tecnica_marca_tecnica":"TAMPO.  ANTIESTRES 1 TINTA","tecnica_marca_precio":null,"tecnica_marca_num_tintas":null,"tecnica_marca_descripcion":"SE SUGIERE: Tampografía para Antiestrés 1 tinta."}*/
            let longitud = ''
            let anchura = ''
            let altura = ''
            let empaque = ''
            if (products.metadata != undefined && products.metadata != null) {
              longitud = products[i].metadata.empaque_largo != undefined || products[i].metadata.empaque_largo !== null ? products[i].metadata.empaque_largo : '';
              anchura = products[i].metadata.empaque_ancho != undefined || products[i].metadata.empaque_ancho !== null ? products[i].metadata.empaque_ancho : '';
              altura = products[i].metadata.empaque_largo != undefined || products[i].metadata.empaque_largo !== null ? products[i].metadata.empaque_largo : '';
              empaque = products[i].metadata.empaque_unds_caja != undefined || products[i].metadata.empaque_unds_caja !== null ? products[i].metadata.empaque_unds_caja : '';
            }
            let sum = stock.total.quantity + stock.local.quantity + stock.zonaFranca.quantity;
            if (products[i].name_supplier == 'CDO') {

              stock.local.quantity = sum;
            }
            let variantPrice = variation.price_override > 0 ? variation.price_override : precio_sugerido;
            if (variation.price_override < precio_sugerido && products[i].name_supplier == 'CDO') {
              variantPrice = precio_sugerido;
            }
            let variant = `variable;${variation.sku};${variation.name_variant};;${description_product};${stock.total.quantity == undefined || stock.total.quantity == 0 ? "outofstock" : "instock"};${stock.total.quantity == 0 ? sum : stock.total.quantity == undefined ? 0 : stock.total.quantity};${stock.local.quantity};${stock.zonaFranca.quantity};${stock.transito.quantity};${variation.weight_override > 0 ? variation.weight_override : ''};${longitud};${anchura};${altura};${empaque};;${variantPrice};${products[i].price};;variante;${img_variant};${products[i].reference};${c + 1};;si;${price_type};${priority};`;
            if (color != null && space == null) {
              variant += `Color;${color};1;1`;
            }
            if (space != null && color == null) {
              variant += `Espacio;${space};1;1`;
            }
            if (space != null && color != null) {
              variant += `Color;${color};1;1;`;
              variant += `Espacio;${space};2;2`;
            }
            variant += `\n`;
            products_csv += variant;
          }
        }
      }
      //convertirlo en un archivo csv a los datos obtenidos y guardarlos en la carpeta temp 
      await new Promise((resolve) => setTimeout(resolve, 150));
      fs.writeFile(`temp/products.csv`, products_csv, 'utf8', function (err) {
        if (err) {
          console.log("An error occured while writing JSON Object to File.");

          return console.log(err);
        }
        console.log("JSON file has been saved.");
      });
      exec('sudo cp /root/code/produccion/backend/bridge_wordpress/temp/products.csv /var/csv/csv/', (error, stdout, stderr) => {
        if (error) {
          console.error(`Error al ejecutar el comando: ${error}`);
          return;
        }
        console.log(`Salida del comando: ${stdout}`);
        console.error(`Error del comando: ${stderr}`);
      });
      response.status(200).send({ proveedores, cantidad_de_errores: error.length, error })
    }
    );
  } catch (
  err
  ) {
    console.log(err);
    next(err.message);
  }
} )
router.post("/get_CSV_sin_promos", async function (request, response, next) {
  try {
    const collection_ofeta = '88f91efa-e7f0-4a68-b330-9f3720a738c5'
    const collection_precio_neto = 'b4995e35-2373-4b36-a3f8-d147f6833a5a'
    let price_type = 'S'
    let error = []
    //leer el archivo que esta en la carpeta temp
    let proveedores = {
      "Promos": 0,
      "cdo": 0,
      "marpico": 0,
      "promoopcion": 0,
      "esferos": 0,
      "promoline":0

    }
    fs.readFile('temp/products.json', 'utf8', async function (err, data) {
      if (err) {
        console.log("An error occured while reading JSON Object from File.");
        return console.log(err);
      }
      const products = JSON.parse(data);
      let products_csv = `Tipo;SKU;Nombre;Descripción corta;Descripción;¿Existencias?;Inventario;Inventario Local;Inventario Zona Franca; Inventario En Transito;Peso (kg);Longitud (cm);Anchura (cm);Altura (cm);Empaque (und);Precio rebajado;Precio normal;Precio neto;Categorías;Etiquetas;Imágenes;Superior;Posición;Brands;Gestión de inventario;Tipo de Precio;Orden;Nombre del atributo 1;Valor(es) del atributo 1;Atributo visible 1;Atributo global 1;Nombre del atributo 2;Valor(es) del atributo 2;Atributo visible 2;Atributo global 2\n`;
      for (let i = 0; i < products.length; i++) {
        let priority = 0;
        if (products[i].variants == undefined) {
          error.push(products[i])
          continue;
        }
        if (products[i].name_supplier == 'Promos') {
          continue;
          if (products[i].urlImage == null) {
            error.push(products[i])
            continue;
          }
          if (products[i].description_product == 'undefined') {
            products[i].description_product = products[i].name_product;
          }
          proveedores.Promos++;
          // if (products[i].reference == 'VA-948') {
          //   console.log(products[i].variants[0].stock)
          // }
          if (products[i].variants.length == 0) {
            products[i].variants = [
              {
                id_variant: '',
                name_variant: products[i].name_product,
                metadata_variant: '{}',
                description_variant: '  ',
                brand: 'not-brand',
                price_override: 0,
                weight_override: 0,
                sku: products[i].reference+"-v",
                product_id: products[i].idProducts,
                images: [],
                stock: [
                  {
                    idStock: 'd2ea49b6-fed4-45ed-aa34-7b4f44c533ed',
                    locationId: '0994b3d5-becd-401f-983f-47447352ce19',
                    quantity: 0,
                    quantity_allocated: 0,
                    variant_id: 'c71e4de0-8a6a-441e-aee9-f7b7e344c590',
                    idStockLocation: '0994b3d5-becd-401f-983f-47447352ce19',
                    name: 'Local'
                  },
                  {
                    idStock: '32573227-6b09-4ca9-baf4-5abc7f0f0d46',
                    locationId: '9b245cdf-acc8-4655-9738-ee432f654e20',
                    quantity: 0,
                    quantity_allocated: 0,
                    variant_id: 'c71e4de0-8a6a-441e-aee9-f7b7e344c590',
                    idStockLocation: '9b245cdf-acc8-4655-9738-ee432f654e20',
                    name: 'ZonaFranca'
                  },
                  {
                    idStock: '2b769b65-c3e7-49a1-9d53-5c62a7eacc64',
                    locationId: '3b257993-638c-4505-ad1d-5a6dd24d9ac5',
                    quantity: 0,
                    quantity_allocated: 0,
                    variant_id: 'c71e4de0-8a6a-441e-aee9-f7b7e344c590',
                    idStockLocation: '3b257993-638c-4505-ad1d-5a6dd24d9ac5',
                    name: 'Total'
                  },
                  {
                    idStock: 'aa21b916-d484-4238-b77e-6461fe9e6378',
                    locationId: 'a5db0dfa-2d96-4950-b382-839b3acfd6ae',
                    quantity: 0,
                    quantity_allocated: 0,
                    variant_id: 'c71e4de0-8a6a-441e-aee9-f7b7e344c590',
                    idStockLocation: 'a5db0dfa-2d96-4950-b382-839b3acfd6ae',
                    name: 'Transito'
                  
              }]
          }]
        }
      }
        if (products[i].name_supplier == 'CDO') {
          proveedores.cdo++;
          priority = -1;
          // continue;
        }
        if (products[i].name_supplier == 'Marpico') {
          proveedores.marpico++;
          // continue;
        }
        if (products[i].name_supplier == 'PromoOpcion') {
          proveedores.promoopcion++;
          // continue;
          if(products[i].urlImage == null || products[i].urlImage == undefined || products[i].urlImage == '' || products[i].urlImage == '[]'){
            error.push(products[i])
            continue;
          }
          if(products[i].description_product == 'undefined' || products[i].description_product == undefined){
            console.log(products[i].name_product,"producto sin descripcion de promoopcion")
            products[i].description_product = products[i].name_product;
          }
          let name_aux = '';
          name_aux = products[i].name_product.replace(/;/g, "");
          name_aux = name_aux.replace(/(\r\n|\n|\r)/gm, " ");
          name_aux = utils.corregirTexto(name_aux);
          products[i].name_product = name_aux;
        }
        if (products[i].name_supplier == 'ProveedorAdministrador(back)') {
          continue;
        }
        if (products[i].name_supplier == 'esferos') {
          // console.log(products[i])
          if (products[i].urlImage != null && products[i].urlImage.includes('https://esferos.com')) {
            error.push(products[i])
            continue
          }
          proveedores.esferos++;
          products[i].variants.map((variant) => {
            if (products[i].urlImage != null && products[i].urlImage.includes('https://esferos.com')) {
              products[i].urlImage = '';
            }
            if (variant.images.length !== 0 && variant.images[0].urlImage.includes('https://esferos.com')) {
              variant.images[0].urlImage = ''
            }
          })
        }
        if(products[i].name_supplier == 'PROMOLINE'){
          proveedores.promoline++;
          products[i].reference = 'P'+products[i].reference
          if(products[i].urlImage == '' || products[i].urlImage == null || products[i].urlImage == '[""]'){
            error.push(products[i])
            continue;
          }
          products[i].variants.map((variant) => {
            if(variant.images.length !=0){
              variant.images.map((image) => {
                if(!image.urlImage.includes('https://')){
                  image.urlImage = '';
                }
              })
            }
          })
        }
        if(products[i].price == null){
          products[i].price = 0;
        }
        let metadata = null;
        let oferta = false;
        if(products[i].collection_id == collection_ofeta){
          oferta = true;
        }
        //reemplazar los . y los ; de las descripciones si lo tienen
        // console.log(products[i].description_product)
        let description_product = '';
        if (products[i].description_product != 'undefined' || products[i].description_product != undefined || products[i].description_product != null || products[i].description_product != '' || products[i].description_product != 'null') {
          //quietar los saltos de linea
          // console.log(products[i].description_product, 'description_product', products[i].name_product)
          description_product = products[i].description_product.replace(/;/g, "");
          description_product = description_product.replace(/(\r\n|\n|\r)/gm, " ");
          description_product = utils.corregirTexto(description_product);

        } else {
          description_product = '';
        }
        if (products[i].description_product == 'not description') {
          description_product = products[i].name_product;
        }
        let precio_sugerido = 0;
        if (products[i].metadata !== '[object Object]' && products[i].metadata !== '' ) {
          metadata = products[i].metadata != null ? JSON.parse(products[i].metadata) : null;
        }
        precio_sugerido = JSON.parse(products[i].metadata_price);
        if (products[i].metadata_price == "{}") {
          precio_sugerido = 0;
        } else {
          // if(products[i].name_supplier == 'esferos'){
          //   precio_sugerido = products[i].price * 5/3;
          // }
          if (products[i].name_supplier == 'Promos' || products[i].name_supplier == 'PromoOpcion' || products[i].name_supplier == 'esferos' || products[i].name_supplier == 'PROMOLINE') {
            if (precio_sugerido !== null && precio_sugerido.precioSugerido != undefined) {
              if (typeof precio_sugerido.precioSugerido == 'number') {
                //convertir a int
                precio_sugerido = precio_sugerido.precioSugerido.toString().split(".");
                precio_sugerido = precio_sugerido[0];
              } else {
                precio_sugerido = precio_sugerido.precioSugerido.split(".");
                precio_sugerido = precio_sugerido[0];
              }
            }
          }
          if (products[i].name_supplier == 'CDO') {
            precio_sugerido.precioSugerido = precio_sugerido.precioSugerido * 5/4;
            //eliminar los decimales
            precio_sugerido = precio_sugerido.precioSugerido.toString().split(".")[0];
            // console.log(precio_sugerido)
          }

          if (precio_sugerido != null && precio_sugerido.precioSugerido != undefined) {
            precio_sugerido = (precio_sugerido.precioSugerido !== null && typeof precio_sugerido.precioSugerido != 'number') ? precio_sugerido.precioSugerido.split(".") : precio_sugerido.precioSugerido;
            precio_sugerido = precio_sugerido.length > 0 ? precio_sugerido[0] : precio_sugerido;
          } else {
            if (precio_sugerido == null) {
              precio_sugerido = products[i].price * 1.4;
            }
          }
        }
        if (precio_sugerido < 0) {
          precio_sugerido = 0;
        }
        if (products[i].price < 0) {
          products[i].price = 0;
        }
        let name_product_slug = products[i].name_product.replace(/ /g, ",");
        let imagenes = ""
        if (products[i].urlImage !== null) {
          if (products[i].urlImage[0] == "[") {
            imagenes = JSON.parse(products[i].urlImage);

            for (let m = 0; m < imagenes.length; m++) {
              if (imagenes[m][0] == '[') {
                // console.log(imagenes[m])
                //eliminar ese elemento
                imagenes.splice(m, 1);

              }
            }
            if (products[i].name_supplier == 'PromoOpcion') {
              // console.log(imagenes)
              // console.log("cleaning images")
              //quiero buscar el elemento del array que tenga la palabra padre y ponerlo al frente del array
              for(let t = 0 ; imagenes.length > t ; t++){
                if(imagenes[t].includes('padre')){
                  // console.log("encontrado")
                  let aux = imagenes[t];
                  imagenes.splice(t,1);
                  imagenes.unshift(aux);
                }
              }
              // console.log(imagenes,"sali")
            
          }
            // console.log(imagenes)

            imagenes = imagenes.join(",");
          } else {
            imagenes = products[i].urlImage;
          }
        } else {
          imagenes = '';
          error.push(products[i])
        }

        let colors = await utils.get_colors_at_sku(products[i].variants, products[i].name_supplier == 'PromoOpcion')
        if (colors.length > 0) {
          colors = await utils.homologationcolor(colors);
          colors = colors.join(",");
        } else {
          colors = null;
        }
        let spaces = await utils.get_space_at_sku(products[i].variants)
        if (spaces.length > 0) {
          spaces = [...new Set(spaces)]
          spaces = spaces.join(",");
        } else {
          spaces = null;
        }
        let auxCategories = ''
        let categories = products[i].parent == null ? products[i].name_category : `${products[i].parent} > ${products[i].name_category}`;
        console.log(products[i].parent)
        categories = utils.searchCategoriesExtra(categories, products[i].name_product)
        auxCategories = categories.split(",");
        if (auxCategories.length > 1 && auxCategories[1] == '') {
          // console.log("auxCategories",auxCategories)
          categories = auxCategories[0];
        }
        categories = utils.searchCategoriesAndAppend(categories, products[i].name_product, ['paraguas golf'], 'Paraguas e impermeables > Paraguas Golf', null)
        auxCategories = categories.split(",");
        if (auxCategories.length > 1 && auxCategories[1] == '') {
          // console.log("auxCategories",auxCategories)
          categories = auxCategories[0];
        }
        categories = utils.searchCategoriesAndAppend(categories, products[i].name_product, ['mini paraguas'], 'Paraguas e impermeables > Paraguas Mini', null)
        auxCategories = categories.split(",");
        if (auxCategories.length > 1 && auxCategories[1] == '') {
          // console.log("auxCategories",auxCategories)
          categories = auxCategories[0];
        }
        categories = utils.searchCategoriesAndAppend(categories, products[i].name_product, ['rainpro'], 'Paraguas e impermeables > Paraguas Premium', 'mini')

         auxCategories = categories.split(",");
        if (auxCategories.length > 1 && auxCategories[1] == '') {
          // console.log("auxCategories",auxCategories)
          categories = auxCategories[0];
        }
        if(oferta){
          categories+= ',Ofertas'
        }
        let sum_total_father= 0;
        let sum_franca_father = 0;
        let sum_transito_father = 0;
        let sum_local_father = 0;
        for(let c = 0; c < products[i].variants.length; c++){
          const variation = products[i].variants[c];
          let stock = {
            local: { quantity: 0 },
            zonaFranca: { quantity: 0 },
            total: { quantity: 0 },
            transito: { quantity: 0 }
          }
          if (variation.stock != undefined && variation.stock.length > 0) {
            // console.log("variation.stock", variation.stock)
            let total = variation.stock.find((stock) => {
              return stock.name == "Total"
            })
            let local = variation.stock.find((stock) => {
              return stock.name == "Local"
            })
            let zonaFranca = variation.stock.find((stock) => {
              return stock.name == "ZonaFranca"
            })
            let transito = variation.stock.find((stock) => {
              return stock.name == "Transito"
            });
            // console.log(variation.stock)
            stock.total = total || { quantity: 0 };
            stock.local = local || { quantity: 0 };
            stock.zonaFranca = zonaFranca || { quantity: 0 };
            stock.transito = transito || { quantity: 0 };
          } else {
            stock = {
              local: { quantity: 0 },
              zonaFranca: { quantity: 0 },
              total: { quantity: 0 },
              transito: { quantity: 0 }
            }
          }
          sum_franca_father += stock.zonaFranca.quantity >=0? stock.zonaFranca.quantity: 0;
          sum_transito_father += stock.transito.quantity >=0?stock.transito.quantity:0 ;
          sum_local_father += stock.local.quantity>=0?stock.local.quantity:0;
          sum_total_father += stock.total.quantity>=0?stock.total.quantity:0;
        }
        sum_total_father = sum_total_father >=0?sum_total_father:sum_franca_father+sum_local_father;
        if(sum_total_father == 0 && products[i].name_supplier == 'esferos'){
          continue;
        }
        if(products[i].collection_id == collection_ofeta){ 
          price_type = 'O'
        }else if(products[i].collection_id == collection_precio_neto){
          price_type = 'N'
        }else {
          price_type = 'S'
        }
        let father_product = `variable;${products[i].reference};${products[i].name_product};${description_product};${description_product};instock;${sum_total_father};${sum_local_father};${sum_franca_father};${sum_transito_father};${products[i].weight};${(metadata != null && metadata.medidas_largo != undefined) ? metadata.medidas_largo : ''};${(metadata != null && metadata.medidas_ancho != undefined) ? metadata.medidas_ancho : ''};${(metadata != null && metadata.medidas_alto) ? metadata.medidas_alto : ''};;;${precio_sugerido == null ? 0 : precio_sugerido};${products[i].price};${categories};${products[i].slug_category + ',' +name_product_slug};${imagenes};;0;${products[i].name_supplier};no;${price_type};${priority};`;
        if (colors != null && spaces == null) {
          // console.log("son color")
          // console.log("space", spaces)
          father_product += `;;1;1`;
        }
        if (spaces != null && colors == null) {
          // console.log("son space")
          father_product += `;;1;1`;
        }
        if (spaces != null && colors != null) {
          // console.log("colors", colors)
          // console.log("space", spaces)
          father_product += `;;1;1;`;
          father_product += `;;2;2`;
        }
        father_product += '\n'
        // console.log("precio_sugerido", precio_sugerido, JSON.parse(products[i].metadata_price),i)
        if (products[i].variants.length == 1) {

          const variation = products[i].variants[0];
          let img_variant = variation.images[0] !== undefined ? variation.images[0].urlImage : null;
          if (img_variant != null) {
            if (img_variant[0] == "[") {
              img_variant = JSON.parse(img_variant);
              img_variant = img_variant.join(",");
            } else {
              img_variant = img_variant;
            }
            if (!(img_variant.includes(imagenes))) {
              img_variant = imagenes+ ',' + img_variant;
            }
          } else {
            img_variant = imagenes;
          }
          if (img_variant.startsWith(',')) {
            img_variant = img_variant.substring(1);
          }
          let stock = {
            local: {},
            zonaFranca: {},
            total: {},
            transito: {}
          }
          if (variation.stock != undefined && variation.stock.length > 0) {
            // console.log("variation.stock", variation.stock)
            let total = variation.stock.find((stock) => {
              return stock.name == "Total"
            })
            let local = variation.stock.find((stock) => {
              return stock.name == "Local"
            })
            let zonaFranca = variation.stock.find((stock) => {
              return stock.name == "ZonaFranca"
            })
            let transito = variation.stock.find((stock) => {
              return stock.name == "Transito"
            });
            //console.log(variation.stock)
            stock.total = total || { quantity: 0 };
            stock.local = local || { quantity: 0 };
            stock.zonaFranca = zonaFranca || { quantity: 0 };
            stock.transito = transito || { quantity: 0 };
          } else {
            stock = {
              local: { quantity: 0 },
              zonaFranca: { quantity: 0 },
              total: { quantity: 0 },
              transito: { quantity: 0 }
            }
          }
          let auxCategories = ''
          let categories = products[i].parent == null ? products[i].name_category : `${products[i].parent} > ${products[i].name_category}`;
          categories = utils.searchCategoriesExtra(categories, products[i].name_product)
          
          auxCategories = categories.split(",");
          if (auxCategories.length > 1 && auxCategories[1] == '') {
            // console.log("auxCategories",auxCategories)
            categories = auxCategories[0];
          }
          categories = utils.searchCategoriesAndAppend(categories, products[i].name_product, ['paraguas golf'], 'Paraguas e impermeables > Paraguas Golf', null)
          auxCategories = categories.split(",");
          if (auxCategories.length > 1 && auxCategories[1] == '') {
            // console.log("auxCategories",auxCategories)
            categories = auxCategories[0];
          }
          categories = utils.searchCategoriesAndAppend(categories, products[i].name_product, ['mini paraguas'], 'Paraguas e impermeables > Paraguas Mini', null)
          auxCategories = categories.split(",");
          if (auxCategories.length > 1 && auxCategories[1] == '') {
            // console.log("auxCategories",auxCategories)
            categories = auxCategories[0];
          }
          categories = utils.searchCategoriesAndAppend(categories, products[i].name_product, ['rainpro'], 'Paraguas e impermeables > Paraguas Premium', 'mini')

          auxCategories = categories.split(",");
          if (auxCategories.length > 1 && auxCategories[1] == '') {
            // console.log("auxCategories",auxCategories)
            categories = auxCategories[0];
          }
          if(oferta){
            categories+= ',Ofertas'
          }
          // console.log(categories, "total categories")
          let sum = stock.total.quantity + stock.local.quantity + stock.zonaFranca.quantity;
          if (products[i].reference == "VA-128") {
            console.log("stock", stock)
          }
          father_product = `simple;${products[i].reference};${products[i].name_product};${description_product};${description_product};${stock.total.quantity == undefined || stock.total.quantity == 0 ? "outofstock" : "instock"};${stock.total.quantity == 0 ? sum : stock.total.quantity == undefined ? 0 : stock.total.quantity};${stock.local.quantity};${stock.zonaFranca.quantity};${stock.transito.quantity};${variation.weight_override > 0 ? variation.weight_override : ''};;;;;;${precio_sugerido};${products[i].price};${categories};${products[i].slug_category + ',' + name_product_slug};${img_variant};${products[i].reference};0;${products[i].name_supplier};no;${price_type};${priority};`
          if (colors != null && spaces == null) {
            // console.log("son color")
            // console.log("space", spaces)
            father_product += `Color;${colors};1;1`;
          }
          if (spaces != null && colors == null) {
            // console.log("son space")
            father_product += `Espacio;${spaces};1;1`;
          }
          if (spaces != null && colors != null) {
            // console.log("colors", colors)
            // console.log("space", spaces)
            father_product += `Color;${colors};1;1;`;
            father_product += `Espacio;${spaces};2;2`;
          }
          father_product += '\n'
          products_csv += father_product;
        } else {
          products_csv += father_product;
          for (let c = 0; c < products[i].variants.length; c++) {
            let variation = products[i].variants[c];
            if (variation.sku.startsWith("-")) {

              variation.sku = products[i].reference + variation.sku;
            }
            if (variation.sku.startsWith("#")) {
              variation.sku = variation.sku.replace("#", "");

            }
            let stock = {
              local: { quantity: 0 },
              zonaFranca: { quantity: 0 },
              total: { quantity: 0 },
              transito: { quantity: 0 }
            }
            if (variation.stock != undefined && variation.stock.length > 0) {
              // console.log("variation.stock", variation.stock)
              let total = variation.stock.find((stock) => {
                return stock.name == "Total"
              })
              let local = variation.stock.find((stock) => {
                return stock.name == "Local"
              })
              let zonaFranca = variation.stock.find((stock) => {
                return stock.name == "ZonaFranca"
              })
              let transito = variation.stock.find((stock) => {
                return stock.name == "Transito"
              });
              // console.log(variation.stock)
              stock.total = total || { quantity: 0 };
              stock.local = local || { quantity: 0 };
              stock.zonaFranca = zonaFranca || { quantity: 0 };
              stock.transito = transito || { quantity: 0 };
            } else {
              stock = {
                local: { quantity: 0 },
                zonaFranca: { quantity: 0 },
                total: { quantity: 0 },
                transito: { quantity: 0 }
              }
            }
            let color = await utils.get_color(variation.sku, products[i].name_supplier == 'PromoOpcion');
            color = await utils.homologationcolor(color);
            let space = await utils.get_space(variation.sku);
            let img_variant = variation.images
            if (img_variant == undefined) {
              img_variant = '';
            } else {
              if (img_variant.length > 0) {
                img_variant = img_variant.map(e => {
                  if (e.urlImage == 'empty' || e.urlImage == '' || e.urlImage === 'undefined') {
                    return ''
                  }
                  return JSON.parse(e.urlImage).join(",")
                })
                img_variant = img_variant.join(",");
                //quiero validar si las imagenes de las variantes son distintas que la del padre, si son iguales las dejo vacias
                if (imagenes.includes(img_variant) && imagenes == img_variant) {
                  img_variant = '';
                  // console.log("iguales")
                }
              } else {
                img_variant = '';
              }
            }

            /*
            {"material":"PU (Poliuretano).","empaque_individual":"","empaque_unds_caja":250,"empaque_und_medida":"","empaque_largo":"62.00","empaque_ancho":"31.50","empaque_alto":"29.50","empaque_peso_neto":"5.00","empaque_peso_bruto":"6.00","area_impresion":"2,8 x 2,2 cm.","medidas_largo":null,"medidas_ancho":null,"medidas_alto":null,"medidas_diametro":6.3,"medidas_peso_neto":"20.00","tecnica_marca_codigo":"5500047","tecnica_marca_tecnica":"TAMPO.  ANTIESTRES 1 TINTA","tecnica_marca_precio":null,"tecnica_marca_num_tintas":null,"tecnica_marca_descripcion":"SE SUGIERE: Tampografía para Antiestrés 1 tinta."}*/
            let longitud = ''
            let anchura = ''
            let altura = ''
            let empaque = ''
            if (products.metadata != undefined && products.metadata != null) {
              longitud = products[i].metadata.empaque_largo != undefined || products[i].metadata.empaque_largo !== null ? products[i].metadata.empaque_largo : '';
              anchura = products[i].metadata.empaque_ancho != undefined || products[i].metadata.empaque_ancho !== null ? products[i].metadata.empaque_ancho : '';
              altura = products[i].metadata.empaque_largo != undefined || products[i].metadata.empaque_largo !== null ? products[i].metadata.empaque_largo : '';
              empaque = products[i].metadata.empaque_unds_caja != undefined || products[i].metadata.empaque_unds_caja !== null ? products[i].metadata.empaque_unds_caja : '';
            }
            let sum = stock.total.quantity + stock.local.quantity + stock.zonaFranca.quantity;
            if (products[i].name_supplier == 'CDO') {

              stock.local.quantity = sum;
            }
            let variantPrice = variation.price_override > 0 ? variation.price_override : precio_sugerido;
            if (variation.price_override < precio_sugerido && products[i].name_supplier == 'CDO') {
              variantPrice = precio_sugerido;
            }
            let variant = `variable;${variation.sku};${variation.name_variant};;${description_product};${stock.total.quantity == undefined || stock.total.quantity == 0 ? "outofstock" : "instock"};${stock.total.quantity == 0 ? sum : stock.total.quantity == undefined ? 0 : stock.total.quantity};${stock.local.quantity};${stock.zonaFranca.quantity};${stock.transito.quantity};${variation.weight_override > 0 ? variation.weight_override : ''};${longitud};${anchura};${altura};${empaque};;${variantPrice};${products[i].price};;variante;${img_variant};${products[i].reference};${c + 1};;si;${price_type};${priority};`;
            if (color != null && space == null) {
              variant += `Color;${color};1;1`;
            }
            if (space != null && color == null) {
              variant += `Espacio;${space};1;1`;
            }
            if (space != null && color != null) {
              variant += `Color;${color};1;1;`;
              variant += `Espacio;${space};2;2`;
            }
            variant += `\n`;
            products_csv += variant;
          }
        }
      }
      //convertirlo en un archivo csv a los datos obtenidos y guardarlos en la carpeta temp 
      await new Promise((resolve) => setTimeout(resolve, 150));
      fs.writeFile(`temp/products_sin_promos.csv`, products_csv, 'utf8', function (err) {
        if (err) {
          console.log("An error occured while writing JSON Object to File.");

          return console.log(err);
        }
        console.log("JSON file has been saved.");
      });
      exec('sudo cp /root/code/produccion/backend/bridge_wordpress/temp/products_sin_promos.csv /var/csv/csv/', (error, stdout, stderr) => {
        if (error) {
          console.error(`Error al ejecutar el comando: ${error}`);
          return;
        }
        console.log(`Salida del comando: ${stdout}`);
        console.error(`Error del comando: ${stderr}`);
      });
      response.status(200).send({ proveedores, cantidad_de_errores: error.length, error })
    }
    );
  } catch (
  err
  ) {
    console.log(err);
    next(err.message);
  }
} )

// router.get("/homologation_varios",async (request, response, next) => {
//   fs.readFile('temp/homologacion_varios.csv', 'utf8', async function (err, data) {
//     //headers name_product,reference,category_id,channel
//     if (err) {
//       return console.log(err);
//     }
//     let homologation = data.split('\n');
//     const homologation_varios = [];
//     const error = []
//     let size = homologation.length;
//     // esta delimitado por coma, quiero actualizar la categoria de los productos que vienen en el csv
//     for (let i = 1; i < size; i++) {
//       try{
//         let product = homologation[i].split(',');
//         let reference = product[1];
//         let category_id = product[2];
//         // await new Promise(resolve => setTimeout(resolve, 100));
//         console.log("reference", reference)
//         await knex_products_db('products').where({ reference }).update({ category_id })
//         // let product_db = await knex_products_db('products').where({ reference })
//         // console.log("product_db", product_db)
//         // product_db = product_db[0];
//         // homologation_varios.push({ product_db })
//       }catch(err){
//         console.log("err", err)
//         error.push({err})
//       }
//     }

//     return response.status(200).send({ message: "ok", homologation_varios,error });
//   });
// })

export default router;