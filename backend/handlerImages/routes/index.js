import express from "express";
import multer from "multer";
var router = express.Router();

// Configurar multer para manejar la carga de archivos
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads'); // Ruta donde se guardará la imagen
  },
  filename: function(req, file, cb) {
    cb(null,Date.now() + '-' + file.originalname); // Nombre de archivo único
  }
});

const upload = multer({storage});
export default router;

router.post("/create_logo_user",upload.single('image'),async function (req, res,next) {
  try{
    const {logo,id,user} = req.body;
    console.log("logo",logo)
    res.status(200).json({message:"ok"})

  }catch(err){
    res.status(400).json({error:err.message})
  }
})