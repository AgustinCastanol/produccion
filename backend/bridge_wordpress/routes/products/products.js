import express from "express";
var router = express.Router();

router.get("/products", async function (request, response,next) {
try{
  const offset = request.query.offset|| 0;
  const limit = request.query.limit || 10;
  const products = await knex_products_db.raw(`SELECT * FROM "public"."products" 
  join "public"."collection" on "public"."products"."collection_id" = "public"."collection"."idCollection" 
  join "public"."supplier" on "public"."products"."supplier" = "public"."supplier"."id"
  join "public"."price" on "public"."products"."idProducts" = "public"."price"."productId"
  join "public"."categories" on "public"."products"."category_id" = "public"."categories"."id_categorias"
  join "public"."productImages" on "public"."products"."idProducts" = "public"."productImages"."productId"
  OFFSET ${offset} LIMIT ${limit}`)
  response.status(200).json({ products: products.rows, error:[] })
}catch(err){
  console.log(err)
  next(err.message);
}
})


export default router;