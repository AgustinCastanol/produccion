var express = require("express");
var router = express.Router();
const API_KEY_WP = 'API-KEY' + ' ' + process.env.API_KEY_WP
router.use(function (request, response, next) {
  console.log("Api _path:", request.headers);
  if (request.headers.authorization === undefined) {
    response.status(401).json({ error: "Empty key" });
  }
  if (request.headers.authorization !== API_KEY_WP) {
    response.status(498).json({ error: "Unauthorized" });
  }
  next();
});

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
  console.log("Api _path:", request.body);
  response.json({
    error: [], data: {
      user: "Usuario Encontrado",
      token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
    }
  })
})
module.exports = router;
