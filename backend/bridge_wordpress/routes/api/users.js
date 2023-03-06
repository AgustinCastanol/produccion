import express from "express";
import Users from "../../models/users.js";
var router = express.Router();


router.post("/register_user", async function (request, response,next) {
try{
  const email = request.body.email;
  const password = request.body.password;
  const id_wordpress = request.body.id;
  const user = request.body.user;
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
  response.status(200).send({ message: "Creado con exito",token:register.token ,error:[] })
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
  console.log(request.body)
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
  response.status(200).json({ message: "Login con exito",token, error:[] })
}catch(err){
  console.log(err,"error en login")
  next(err.message);
}
})
export default router;
