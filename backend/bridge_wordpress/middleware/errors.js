export default function (err, req, res, next) {
  console.error("error\n",err);
  res.status(500).send({error: "Something went wrong", message: err});
}