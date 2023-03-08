import express from "express";
import User from "../../models/users.js";
import AdminUser from "../../models/usersAdmin.js";
var router = express.Router();

export default router;

// router.use

router.post("/new_user", async function (req, res, next) {
  try {
    console.log("new_user", req.body)
    const { name, email, password, role, id_wordpress, id_wordpress_admin } = req.body;
    if(!name || !email || !password || !role){
      return res.status(400).json({error: "Missing fields"})
    }
    if(role == 'admin'){
      return res.status(400).json({error: "Role not asignable"})
    }
    const user = new User({name, email, password, role, id_wordpress});
    const userExists = await user.userExist();
    await user.setAdmin({id_wordpress_admin})
    console.log("userExists", userExists)
    if(userExists){
      return res.status(400).json({error: "User already exists"})
    }
    const check_register = await user.registerUser();
    if(!check_register){
      return res.status(400).json({error: "Error registering user"})
    }
    res.status(200).json({user: user, error:[]})
  } catch (err) {
    next(err.message);
  }
})
router.post("/edit_user", async function (req, res, next) {
  try {
    const { user, email, role, id_wordpress, password ,id_wordpress_user } = req.body;
    if(!user || !email || !role){
      return res.status(400).json({error: "Missing fields"})
    }
    const admin = new AdminUser({})
    const checkAdmin = await admin.userIsAdmin({id_wordpress:id_wordpress_user})
    const checkUserEdit = await admin.userIsAdmin({id_wordpress:id_wordpress})
    if(role == 'admin'){
      return res.status(400).json({error: "Role not asignable"})
    }
    if(checkAdmin == false && checkUserEdit == true){
      return res.status(401).json({error: "Not authorized"})
    }
    if(checkAdmin == true && checkUserEdit == true && id_wordpress_user === id_wordpress){
      const user = new AdminUser({ email, id_wordpress, user, password });
      const check_edit = await user.editUser();
      if(check_edit.error == true){
        return res.status(400).json({error: ["Error edit user", check_edit.message]})
      }
    }
    if(checkAdmin == true && checkUserEdit == false){
      const user = new User({ id_wordpress});
      const check_edit = await user.editUser({ email, user, password, role});
      if(check_edit.error == true){
        return res.status(400).json({error: ["Error edit user", check_edit.message]})
      }
    }

    if(checkAdmin == true && checkUserEdit == true && id_wordpress_user != id_wordpress){
      return res.status(409).json({error: "Conflict"})
    }
    if(checkAdmin == false){
      //no autorizado
      res.status(401).json({error: "Not authorized"})
    }

    res.status(200).json({mesasge:"User edited" , error:[]})
  } catch (err) {
    next(err.message);
  }
})
router.post("/delete_user", async function (res, req, next) {
  try {

  } catch (err) {
    next(err.message);
  }
})
router.post("/get_user", async function (res, req, next) {
  try {

  } catch (err) {
    next(err.message);
  }
})
router.post("/get_users", async function (res, req, next) {
  try {

  } catch (err) {
    next(err.message);
  }
})

router.post("/set_logo", async function (res, req, next) {
  try {

  } catch (err) {
    next(err.message);
  }
})