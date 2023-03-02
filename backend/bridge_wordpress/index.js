var config = require("dotenv").config();
global.config = config.parsed;
console.log("Check env --------");
var required_env_variables = [
  "service_port",
  "environment",
  "pg_host",
  "pg_port",
  "pg_database",
  "pg_user",
  "pg_password",
];
var hay_error = false;
required_env_variables.map((variable) => {
  if (!process.env[variable]) {
    hay_error = true;
    console.error("ERROR: falta variable env:", variable);
  }
});
if (hay_error) {
  console.log("-------------------------");

  process.exit(1);
}

var app = require("express")();
var server = require("http").Server(app);
if (process.env.environment == "dev") {
  var cors = require("cors");
  console.log("devmode");
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
      "http://https://onlati.host:80"
    ],
  };
  app.use(cors(corsOptions));
}
var bodyParser = require("body-parser");

app.use(bodyParser.json());

var Session = require("express-session");


app.disable("x-powered-by");
app.use(
  Session({
    secret: "session_secret",
    saveUninitialized: false,
    resave: true,
  })
);

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

app.use("/bgwp", require("./api/users"));


console.log("Servidor API escuchando en       ", process.env.service_port);
console.log("Environment mode", process.env.environment);
server.listen(process.env.service_port);
