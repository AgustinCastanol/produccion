export default function notfound(req, res, next) {
  res.status(404).send({error: "Not found"});
}