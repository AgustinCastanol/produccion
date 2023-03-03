import express from "express";
import dotenv from "dotenv";
var config = dotenv.config();
global.config = config.parsed;
var router = express.Router();
const API_KEY_WP = 'API-KEY' + ' ' +  process.env.API_KEY_WP;
router.use(function (request, response, next) {
try{
  console.log("Api _path:", API_KEY_WP);
  if (request.headers.authorization === undefined) {
    response.status(401).json({ error: "Empty key" });
  }
  if (request.headers.authorization !== API_KEY_WP) {
    response.status(498).json({ error: "Unauthorized" });
  }
  next();
}catch(err){
  response.status(498).json({ error: "Unauthorized" });
}
});

export default router;