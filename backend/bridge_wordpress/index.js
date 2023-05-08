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
import products from "./routes/products/products.js";
import knex from "knex";
import verifLogin from "./middleware/verifLogin.js";
import redis from 'redis';
import adminUsers from "./routes/admin/users.js";
import client_dis from "./routes/api/client.js";
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
  "SECRET",
  "pg_products_host",
  "pg_products_port",
  "pg_products_database",
  "pg_products_user",
  "pg_products_password",
  "pg_users_host",
  "pg_users_port",
  "pg_users_database",
  "pg_users_user",
  "pg_users_password",


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
} else {
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


const conn_obj_users = {
  host: process.env.pg_users_host,
  port: process.env.pg_users_port,
  user: process.env.pg_users_user,
  password: process.env.pg_users_password,
  database: process.env.pg_users_database,
  supportBigNumbers: true,
  bigNumberStrings: true,
  // ssl: { rejectUnauthorized: false ,require:true},
};
var user_db = knex({
  //debug: true,
  client: "pg",
  connection: conn_obj_users,
  pool: { min: 0, max: 7 },
  log: {
    warn(message) {
      console.log("KNEX WARN:", message);
    },
    error(message) {
      console.log("KNEX ERROR:", message);
    },
    deprecate(message) {
      console.log("KNEX DEPRECATE:", message);
    },
    debug(message) {
      console.log("KNEX DEBUG:", message);
    },
  },
});
console.log("----------- CONECTED TO USERS DB");
global.knex_user_db = user_db;

const conn_obj_products = {
  host: process.env.pg_products_host,
  port: process.env.pg_products_port,
  user: process.env.pg_products_user,
  password: process.env.pg_products_password,
  database: process.env.pg_products_database,
  supportBigNumbers: true,
  bigNumberStrings: true,
  // ssl: { rejectUnauthorized: false ,require:true},
};

const products_db = knex({
  //debug: true,
  client: "pg",
  connection: {...conn_obj_products},
  pool: { min: 0, max: 7 },
  log: {
    warn(message) {
      console.log("KNEX WARN:", message);
    },
    error(message) {
      console.log("KNEX ERROR:", message);
    },
    deprecate(message) {
      console.log("KNEX DEPRECATE:", message);
    },
    debug(message) {
      console.log("KNEX DEBUG:", message);
    },
  },
});
console.log("----------- CONECTED TO USERS DB");

global.knex_products_db = products_db;
// Crea una instancia del cliente Redis
const client = redis.createClient({
  url: 'redis://157.230.11.89:6379',
  password:'_dir$to-easy./'
});
 client.on('connect', function() {
    console.log('Redis client connected');
});
client.on('error', function (err) {
    console.log('Something went wrong ' + err);
});
await client.connect();
global.redis = client;
  //de aca no pasa sin tokens
app.use(api_key_proxy);
//
app.use("/",client_dis)
app.use("/bgwp", users);
//de aca no pasa sin tokens

// app.use(jwt_proxy);
app.use(verifLogin);
app.use("/bgwp", products);
// manejo de roles

//
app.use("/bgwp/admin", adminUsers);

///Si llega aca hubo un error
app.use(handlerError)
app.use(notfound);
////
console.log("Servidor API escuchando en       ", process.env.PORT);
console.log("Environment mode", process.env.environment);
server.listen(process.env.PORT);

