import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
var config = dotenv.config();
global.config = config.parsed;
export default async function (req, res, next) {
  try{
    const token = req.token;
    console.log(req.token,"token")
    if(!token) next("No token provided or expired.");
    console.log("aca pase")
    if(res == null){
      console.log("cai aca")
      next("No token provided or expired.");
    }
    console.log("aca pase2")
    console.log(token)
    const decoded = jwt.verify(token, process.env.SECRET);
    console.log(decoded,"aca pase3")
    const res_redis = await global.redis.get(`${decoded.email}`, (err, reply) => {
      if (err) {
        console.log("que paso?")
        console.error(err);
        
      } else {
        console.log(reply);
      }
    });
    console.log(res_redis,"redis")
    if(res_redis == null || res_redis != token){
      next("No token provided or expired.");
    }
    console.log(decoded)
    next();
  }catch(err){
    console.log("err en todo el modulo")
    next(err.message);
  }
}