import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
var config = dotenv.config();
global.config = config.parsed;
export default async function (req, res, next) {
  try{
    const token = req.token;
    if(!token) next("No token provided or expired.");
    console.log("aca pase")
    if(res == null){
      next("No token provided or expired.");
    }
    const decoded = jwt.verify(token, process.env.SECRET);
    const res_redis = await global.redis.get(`${decoded.email}`, (err, reply) => {
      if (err) {
        console.error(err);
      } else {
        console.log(reply);
      }
    });
    if(res_redis == null || res_redis != token){
      next("No token provided or expired.");
    }
    console.log(decoded)
    next();
  }catch(err){
    // console.log(err)s
    next(err.message);
  }
}