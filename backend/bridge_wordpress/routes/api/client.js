import express from "express";
import Users from "../../models/usersAdmin.js";
import childrenUser from "../../models/users.js"
import fs from "fs";
import utls from "../../helpers/utils.js"
import utils from "../../helpers/utils.js";
import axios from "axios";
import {DOMParser} from "@xmldom/xmldom";
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

router.post("/load_CSV", async function (request, response, next) {
  try {
    const count = await knex_products_db("products").count("idProducts as total");
    const total = count[0].total;
    const times = Math.floor(total / 1000);
    const limit = 1000;
    const offset = 1000;
    let products = [];
    for (let i = 0; i <= 0; i++) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const products_db = await knex_products_db("products").select("*")
        .join("collection", "products.collection_id", "=", "collection.idCollection")
        .join("categories", "products.category_id", "=", "categories.id_categorias")
        .join("productImages", "products.idProducts", "=", "productImages.productId")
        .join("supplier", "products.supplier", "=", "supplier.id")
        .join("price", "products.idProducts", "=", "price.productId")
        .limit(limit).offset(i * offset);
      for (let c = 0; c < products_db.length; c++) {
        if (products_db[c].parent != null) {
          await new Promise((resolve) => setTimeout(resolve, 100));
          const parent_category = await knex_products_db("categories").select("name_category").where("id_categorias", products_db[c].parent);
          products_db[c].parent = parent_category[0].name_category;

        }
        const variants = await knex_products_db("variants").select("*").where("product_id", products_db[c].idProducts)
        products_db[c].variants = variants;
        for (let v = 0; v < variants.length; v++) {
          await new Promise((resolve) => setTimeout(resolve, 100));
          const variant_images = await knex_products_db.raw(`SELECT * FROM public."productVariantImage" WHERE "variantId" = '${variants[v].id_variant}'`)
          const variant_stock = await knex_products_db("stock").select("*")
            .join("stockLocation", "stockLocation.idStockLocation", "=", "stock.locationId")
            .where("variant_id", variants[v].id_variant);
          variants[v].images = variant_images.rows;
          variants[v].stock = variant_stock;
        }

      }
      products = [...products, ...products_db];
    }
    //convertirlo en un archivo json a los datos obtenidos y guardarlos en la carpeta temp
    const json = JSON.stringify(products);
    fs.writeFile('temp/products.json', json, 'utf8', function (err) {
      if (err) {
        console.log("An error occured while writing JSON Object to File.");
        return console.log(err);
      }
      console.log("JSON file has been saved.");
    });

    response.status(200).send({ total: total, length: products.length, times: times, products })
  } catch (err) {
    console.log(err);
    next(err.message);
  }
})
router.post("/get_CSV", async function (request, response, next) {
  try {
    //leer el archivo que esta en la carpeta temp
    fs.readFile('temp/products.json', 'utf8', async function (err, data) {
      if (err) {
        console.log("An error occured while reading JSON Object from File.");
        return console.log(err);
      }
      const products = JSON.parse(data);
      let products_csv = `Tipo;SKU;Nombre;Descripción corta;Descripción;¿Existencias?;Inventario;Peso (kg);Longitud (cm);Anchura (cm);Altura (cm);Precio rebajado;Precio normal;Precio neto;Categorías;Etiquetas;Imágenes;Superior;Posición;Brands;Nombre del atributo 1;Valor(es) del atributo 1;Atributo visible 1;Atributo global 1\n`;
      for (let i = 0; i < products.length; i++) {
      let metadata = null;
      //reemplazar los . y los ; de las descripciones si lo tienen
      let description_product = products[i].description_product.replace(/;/g, " ").replace(/\./g, " ")
      //quietar los saltos de linea
      description_product = description_product.replace(/(\r\n|\n|\r)/gm, " ");
      let precio_sugerido = 0;
      if(products[i].metadata !== '[object Object]'){
        metadata = products[i].metadata!=null?JSON.parse(products[i].metadata):null;
      }
      precio_sugerido = JSON.parse(products[i].metadata_price);
      if(precio_sugerido != null && precio_sugerido.precioSugerido != undefined){
        precio_sugerido = (precio_sugerido.precioSugerido!== null && typeof precio_sugerido.precioSugerido != 'number')? precio_sugerido.precioSugerido.split("."):precio_sugerido.precioSugerido;
        precio_sugerido = precio_sugerido.length > 0? precio_sugerido[0]:precio_sugerido;
      }else{
        precio_sugerido = 0;
      }
        let name_product_slug = products[i].name_product.replace(/ /g, "-");
        let imagenes =""
        if(products[i].urlImage[0]=="["){
          imagenes = JSON.parse(products[i].urlImage);
          imagenes = imagenes.join(",");
        }else{
          imagenes = products[i].urlImage;
        }
        let colors = await utils.get_colors_at_sku(products[i].variants)
        if(colors.length > 0){
          colors = colors.join(",");
        }
        let space = await utils.get_space_at_sku(products[i].variants)
        if(space.length > 0){
          console.log("space", space)
          space = space.join(",");
        }
        let father_product = `variable;${products[i].reference};${products[i].name_product};${description_product};${description_product};1;;${products[i].weight};${(metadata != null && metadata.medidas_largo != undefined) ? metadata.medidas_largo : ''};${(metadata != null && metadata.medidas_ancho != undefined) ? metadata.medidas_ancho : ''};${(metadata != null && metadata.medidas_alto) ? metadata.medidas_alto : ''};;${precio_sugerido};${products[i].price};${products[i].parent == null ? products[i].name_category : `${products[i].parent} > ${products[i].name_category}`};${products[i].slug_category + ',' + products[i].slug_collection + ',' + products[i].reference + ',', name_product_slug};${imagenes};;0;${products[i].name_supplier};`;
        if(colors != "" && space == ""){
          father_product += `Color;${colors};1;1\n`;
        }
        if(space != "" && colors == ""){
          father_product += `Espacio;${space};1;1\n`;
        }
        if(space != "" && colors != ""){
          father_product += `Color;${colors};1;1;`;
          father_product += `Espacio;${space};2;2\n`;
        }
        products_csv += father_product;
        // console.log("precio_sugerido", precio_sugerido, JSON.parse(products[i].metadata_price),i)
        for (let c = 0; c < products[i].variants.length; c++) {
          let variation = products[i].variants[c];
          let stock = variation.stock.find((stock) => {
            return stock.name == "Total"
          })
          let color= await utils.get_color(variation.sku);
          let space=await utils.get_space(variation.sku);
          let img_variant =variation.images
          if(img_variant.length > 0){
            img_variant = img_variant.map(e=>{
              if(e.urlImage == 'empty' || e.urlImage == '' || e.urlImage === 'undefined'){
                console.log("entre")
                return ''
              }
              return JSON.parse(e.urlImage).join(",")
            })
            img_variant = img_variant.join(",");
          }else{
            img_variant = '';
          }
          let variant=`variation;${variation.sku};${variation.name_variant};;${description_product};${stock==undefined || stock.quantity == 0?0:1};${stock==undefined?0:stock.quantity};${variation.weight_override>0?variation.weight_override:''};;;;;${variation.price_override >0?variation.price_override:precio_sugerido>0?precio_sugerido:products[i].price};${products[i].price};;variante;${img_variant};${products[i].reference};${c+1};;`;
          if(color != null && space == null){
            variant += `Color;${color};1;1\n`;
          }
          if(space != null && color == null){
            variant += `Espacio;${space};1;1\n`;
          }
          if(space != null && color != null){
            variant += `Color;${color};1;1;`;
            variant += `Espacio;${space};2;2\n`;
            console.log(space,"space")
          }
          if(color == null && space == null){
            variant += `\n`;
          }
          products_csv += variant;
        }
      }
      //convertirlo en un archivo csv a los datos obtenidos y guardarlos en la carpeta temp 
      fs.writeFile('temp/products.csv', products_csv, 'utf8', function (err) {
        if (err) {
          console.log("An error occured while writing JSON Object to File.");

          return console.log(err);
        }
        console.log("JSON file has been saved.");
        response.status(200).send({ products })
      });
      
    }
    );
  } catch (
  err
  ) {
    console.log(err);
    next(err.message);
  }
})
export default router;