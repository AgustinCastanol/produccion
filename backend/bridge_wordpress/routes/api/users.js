import express from "express";
import Users from "../../models/usersAdmin.js";
var router = express.Router();


router.post("/register_user", async function (request, response,next) {
try{
  const email = request.body.email;
  const password = request.body.password;
  const id_wordpress = request.body.id;
  const user = request.body.user;
  let error = []
  console.log(request.body)
  if (email == null || email == "" || email == undefined) {
    response.status(400).json({ error: "Email vacio" })
  }
  if (password == null || password == "" || password == undefined) {
    response.status(400).json({ error: "Password vacio" })
  }
  if (password.length < 8) {
    response.status(400).send({ error: "Password debe tener al menos 8 caracteres" })
  }
  if (id_wordpress == null || id_wordpress == "" || id_wordpress == undefined) {
    response.status(400).send({ error: "Id vacio" })
  }
  if (user == null || user == "" || user == undefined) {
    response.status(400).send({ error: "User vacio" })
  }
  const users = new Users({ email, password, id_wordpress, user });
  const register = await users.registerUser();
  console.log(register)
  if(register == false){
    next( "Error al crear usuario")
  }
  await redis.set(`${email}`, register.token, 'EX', 86400, (err, reply) => {
    if (err) {
      error.push(err.message)
    } else {
      console.log(reply);
    }
  });
  response.status(200).send({ message: "Creado con exito",token:register.token ,error })
}catch(err){
  console.log(err);
  next(err.message);
}
})
router.post("/login_user", async function (request, response,next) {
try{
  const email = request.body.email;
  const password = request.body.password;
  const id_wordpress = request.body.id;
  const user = request.body.user;
  // console.log(request.body)
  if (email == null || email == "" || email == undefined) {
    response.status(400).json({ error: "Email vacio" })
  }
  if (password == null || password == "" || password == undefined) {
    response.status(400).json({ error: "Password vacio" })
  }
  const users = new Users({ email, password, id_wordpress: id_wordpress, user: user });
  const {token,role} = await users.login();
  if(token == false || token == null){

    response.status(401).json({error:"Unauthorized"})
  }

    const res_redis = await global.redis.get(`${email}`, (err, reply) => {
      if (err) {
        console.error(err);
      } else {
        console.log(reply,"reply");
      }
    });
   
    if(res_redis == null){
      await global.redis.set(`${email}`, token, 'EX', 86400, (err, reply) => {
        if (err) {
          console.error(err);
        } else {
          console.log(reply);
        }
      });
    }
    if(res_redis != null && res_redis != token){
      await global.redis.del(`${email}`, (err, reply) => {
        if (err) {
          console.error(err);
        } else {
          console.log(reply);
        }
      });
      await global.redis.set(`${email}`, token, 'EX', 86400, (err, reply) => {
        if (err) {
          console.error(err);
        } else {
          console.log(reply);
        }
      });
    }
  response.status(200).json({ message: "Login con exito",token, error:[] })
}catch(err){
  console.log(err,"error en login")
  next(err.message);
}
})
router.post("/verify_token", async function (request, response,next) {
  try{
    const {email} = request.body;
    const auth = request.get("authorization-token");
    let token = auth.split(" ")[1];
    if (email == null || email == "" || email == undefined) {
      response.status(400).json({ error: "Email vacio" })
    }
    if (token == null || token == "" || token == undefined) {
      response.status(400).send({ error: "Token vacio" })
    }
    const redis_res = await global.redis.get(`${email}`, (err, reply) => {
      if (err) {
        console.error(err);
      } else {
        console.log(reply);
      }
    });
    if(redis_res == null || redis_res != token){
      response.status(401).json({error:"Unauthorized"})
    }
    response.status(200).json({ message: "Token valido", error:[] })
  }catch(err){
    console.log(err);
    next(err.message);
  }
})

export default router;
