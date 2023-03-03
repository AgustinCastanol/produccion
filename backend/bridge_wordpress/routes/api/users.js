import express from "express";
var router = express.Router();


router.post("/register_user", function (request, response) {
  if (request.body.email == "test@ave.com") {
    response.status(400).json({ error: "Email ya registrado" })
  }
  if (request.body.email == null || request.body.email == "" || request.body.email == undefined) {
    response.status(400).json({ error: "Email vacio" })
  }
  if (request.body.password == null || request.body.password == "" || request.body.password == undefined) {
    response.status(400).json({ error: "Password vacio" })
  }
  if (request.body.password.length < 8) {
    response.status(400).json({ error: "Password debe tener al menos 8 caracteres" })
  }
  if (request.body.id == null || request.body.id == "" || request.body.id == undefined) {
    response.status(400).json({ error: "Id vacio" })
  }
  response.status(200).json(
    {
      error: [],
      data: {
        user: "Usuario Registrado",
      },
      ip: request.ip
    })
})
router.post("/login_user", function (request, response) {
  response.status(200).send("ok")
})
export default router;
