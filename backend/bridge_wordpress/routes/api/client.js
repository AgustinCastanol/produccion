import express from "express";
import Users from "../../models/usersAdmin.js";
import childrenUser from "../../models/users.js"
var router = express.Router();

router.post("/property",async function (request, response,next) {
  try{
    const {id_wordpress} = request.body;
    const users = new Users({email:null,password:null,id_wordpress:id_wordpress,user:null});
    if(!id_wordpress){
      return response.status(400).json({error: ["Error falta id_wordpress","Error al obtener id_wordpress"]})
    }
    const user_id = await users.getUserId({id_wordpress});
    if(user_id.error == true){
      return response.status(400).json({error: ["Error al obtener user_id", user_id.message]})
    }
    const check_property = await users.getFullProperties({user_id})
    if(check_property.error == true){
      return response.status(400).json({error: ["Error al obtener property", check_property.message]})
    }
    response.status(200).send({property:check_property})
  }catch(err){
    console.log(err);
    next(err.message);
  }
})
router.post("/get_users",async function (request, response,next) {
  try{
    const user = new Users({email:null,password:null,id_wordpress:null,user:null});
    const users = await user.getFullUsers();
    if(users.error == true){
      return response.status(400).json({error: ["Error al obtener users", users.message]})
    }
    response.status(200).send({users:users})
  }catch(err){
    console.log(err);
    next(err.message);
  }
})

router.post("/get_CSV",async function (request, response,next) {
  try{
    response.status(200).send({CSV:"CSV"})
  }catch(err){
    console.log(err);
    next(err.message);
  }
})
export default router;