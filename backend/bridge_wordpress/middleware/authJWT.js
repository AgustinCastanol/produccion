import "dotenv"
import jwt from "jsonwebtoken";
export default function auth(req, res, next) {
try{
  console.log("Token,Api _path:", process.env.SECRET);
  const auth = req.get("authorization-token");
  let token = null;
  console.log(auth)
  if (auth && auth.toLowerCase().startsWith("bearer ")) {
    // console.log("aca")
    token = auth.substring(7);
    // console.log(token,"1")
    req.token = token
    // console.log(token,"2")
  }
  if (!token) next("No token provided.");
  const decoded = jwt.verify(token, process.env.SECRET);
  req.user = decoded;
  if (!req.user) next("No user found.");
  if(!req.user.role || req.user.role.length === 0) next("No role found.");


// console.log(token)

  next();
}catch(err){
  next(err);
}

}