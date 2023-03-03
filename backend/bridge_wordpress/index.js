import jwt_proxy from "./middleware/authJWT.js";
import api_key_proxy from "./middleware/authKey.js";
import dotenv from "dotenv";
import express from "express";
import http from "http";
import cors from "cors";
import bodyParser from "body-parser";
import express_session from "express-session";
import users from "./routes/api/users.js";
import handlerError from "./middleware/errors.js";
import notfound from "./middleware/notfound.js";
// CONFIG DOTENV
var config = dotenv.config();
global.config = config.parsed;

console.log("----------- AVE BACKEND ---------------");
// VERIFICATION ENV
console.log("----------- CHECK ENV");
var required_env_variables = [
  "PORT",
  "environment",
  "SALT_ROUNDS",
  "SECRET"
];
var err = false;
required_env_variables.map((e) => {
  if (!process.env[e]) {
    err = true;
    console.error("ERROR: falta variable env:", e);
  }
});
if (err) {
  console.log("----------- ERROR --------------");
  process.exit(1);
}

console.log("----------- SUCCESS ENV");

// CONFIG EXPRESS
const app = express();
const server = http.Server(app);


if (process.env.environment == "development") {
  console.log("----------- DEVELOPE MODE -------------");
  var corsOptions = {
    credentials: true,
    origin: [
      "http://localhost:9528",
      "http://localhost:3000",
      "http://localhost:9529",
      "http://localhost:9530",
      "http://localhost:9531",
      "http://127.0.0.1:5500",
      "http://127.0.0.1:5501",
    ],
  };
  app.use(cors(corsOptions));
  console.log("----------- CORS ENABLED");
}else{
  console.log("----------- PRODUCTION MODE -------------");
  app.use(cors());
}
/*access controll allow origin */
app.use(bodyParser.json());
app.disable("x-powered-by");
app.use(express_session({
  secret: "session_secret",
  resave: false,
  saveUninitialized: true,
}));


// const conn_obj = {
//   host: process.env.pg_host,
//   port: process.env.pg_port,
//   user: process.env.pg_user,
//   password: process.env.pg_password,
//   database: process.env.pg_database,
//   supportBigNumbers: true,
//   bigNumberStrings: true,
// };
// var knex = require("knex")({
//   //debug: true,
//   client: "pg",
//   connection: conn_obj,
//   pool: { min: 0, max: 7 },
//   log: {
//     warn(message) {
//       console.log("KNEX WARN:", message);
//     },
//     error(message) {
//       console.log("KNEX ERROR:", message);
//     },
//     deprecate(message) {
//       console.log("KNEX DEPRECATE:", message);
//     },
//     debug(message) {
//       console.log("KNEX DEBUG:", message);
//     },
//   },
// });
// global.knex = knex;

//de aca no pasa sin tokens
app.use(api_key_proxy);
app.use(jwt_proxy);
//

app.use("/bgwp", users);

///Si llega aca hubo un error
app.use(handlerError)
app.use(notfound);
////
console.log("Servidor API escuchando en       ", process.env.PORT);
console.log("Environment mode", process.env.environment);
server.listen(process.env.PORT);
