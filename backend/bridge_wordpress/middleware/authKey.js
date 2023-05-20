import dotenv from "dotenv";
var config = dotenv.config();
global.config = config.parsed;
const API_KEY_WP = 'API-KEY' + ' ' +  process.env.API_KEY_WP;

export default function (request, response, next) {
try{
  console.log("Api _path:", API_KEY_WP);
  const auth = request.get("Authorization");
  // const authBody = request.body.headers.Authorization;
  if (auth === undefined) {
    response.status(401).json({ error: "Empty key" });
  }
  console.log("paso")
  if (auth !== API_KEY_WP ) {
    // if (authBody !== API_KEY_WP ) {
    //   console.log("no paso por ?")
      response.status(498).json({ error: "Unauthorized" });
    // }
    // console.log("te esquive")
  }
  console.log("salio")
  next();
}catch(err){
  response.status(498).json({ error: "Unauthorized" });
}
};

