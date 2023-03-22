import express from "express";
import User from "../../models/users.js";
import AdminUser from "../../models/usersAdmin.js";
import axios from "axios"
import dotenv from "dotenv"
var router = express.Router();

// CONFIG DOTENV
var config = dotenv.config();
global.config = config.parsed;
export default router;

// router.use

router.post("/new_user", async function (req, res, next) {
  try {
    console.log("new_user", req.body)
    const { name, email, password, role, id_wordpress, id_wordpress_admin } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: "Missing fields" })
    }
    if (role == 'admin') {
      return res.status(400).json({ error: "Role not asignable" })
    }
    const user = new User({ name, email, password, role, id_wordpress });
    const userExists = await user.userExist();
    await user.setAdmin({ id_wordpress_admin })
    console.log("userExists", userExists)
    if (userExists) {
      return res.status(400).json({ error: "User already exists" })
    }
    const check_register = await user.registerUser();
    if (!check_register) {
      return res.status(400).json({ error: "Error registering user" })
    }
    res.status(200).json({ user: user, error: [] })
  } catch (err) {
    next(err.message);
  }
})
router.post("/edit_user", async function (req, res, next) {
  try {
    const { user, email, role, id_wordpress, password, id_wordpress_user } = req.body;
    if (!user || !email || !role) {
      return res.status(400).json({ error: "Missing fields" })
    }
    const admin = new AdminUser({})
    const checkAdmin = await admin.userIsAdmin({ id_wordpress: id_wordpress_user })
    const checkUserEdit = await admin.userIsAdmin({ id_wordpress: id_wordpress })
    if (role == 'admin') {
      return res.status(400).json({ error: "Role not asignable" })
    }
    if (checkAdmin == false && checkUserEdit == true) {
      return res.status(401).json({ error: "Not authorized" })
    }
    if (checkAdmin == true && checkUserEdit == true && id_wordpress_user === id_wordpress) {
      const user = new AdminUser({ email, id_wordpress, user, password });
      const check_edit = await user.editUser();
      if (check_edit.error == true) {
        return res.status(400).json({ error: ["Error edit user", check_edit.message] })
      }
    }
    if (checkAdmin == true && checkUserEdit == false) {
      const user = new User({ id_wordpress });
      const check_edit = await user.editUser({ email, user, password, role });
      if (check_edit.error == true) {
        return res.status(400).json({ error: ["Error edit user", check_edit.message] })
      }
    }

    if (checkAdmin == true && checkUserEdit == true && id_wordpress_user != id_wordpress) {
      return res.status(409).json({ error: "Conflict" })
    }
    if (checkAdmin == false) {
      //no autorizado
      res.status(401).json({ error: "Not authorized" })
    }

    res.status(200).json({ mesasge: "User edited", error: [] })
  } catch (err) {
    next(err.message);
  }
})
router.post("/delete_user", async function (req, res, next) {
  try {
    const { id_wordpress, id_wordpress_user } = req.body;
    if (!id_wordpress) {
      return res.status(400).json({ error: "Missing fields" })
    }
    const admin = new AdminUser({})
    const checkAdmin = await admin.userIsAdmin({ id_wordpress: id_wordpress_user })
    if (checkAdmin == false) {
      return res.status(401).json({ error: "Not authorized" })
    }
    const user = new AdminUser({ id_wordpress });
    const check_delete = await user.deleteUser(id_wordpress);
    if (check_delete.error == true) {
      return res.status(400).json({ error: ["Error delete user", check_delete.message] })
    }
    res.status(200).json({ mesasge: "User deleted", error: [] })

  } catch (err) {
    next(err.message);
  }
})

router.post("/set_location", async function (req, res, next) {
  try {
    const { id_wordpress, location } = req.body;
    if (!id_wordpress || !location) {
      return res.status(400).json({ error: "Missing fields" })
    }
    const admin = new AdminUser({})
    const checkAdmin = await admin.userIsAdmin({ id_wordpress })
    if (checkAdmin == false) {
      return res.status(401).json({ error: "Not authorized" })
    }
    const user = new AdminUser({ id_wordpress });
    const user_id = await user.getUserId();
    const check_set = await user.setLocations({ user_id, location });
    if (check_set.error == true) {
      return res.status(400).json({ error: ["Error set location", check_set.message] })
    }
    res.status(200).json({ mesasge: "Location set", error: [] })
  } catch (err) {
    next(err.message);
  }
})

router.post("/set_colors", async function (req, res, next) {
  try {
    const { id_wordpress, colors } = req.body;
    if (!id_wordpress || !colors) {
      return res.status(400).json({ error: "Missing fields" })
    }
    const admin = new AdminUser({})
    const checkAdmin = await admin.userIsAdmin({ id_wordpress })
    if (checkAdmin == false) {
      return res.status(401).json({ error: "Not authorized" })
    }
    const user = new AdminUser({ id_wordpress });
    const user_id = await user.getUserId();
    const check_set = await user.setColors({ user_id, colors });
    if (check_set.error == true) {
      return res.status(400).json({ error: ["Error set colors", check_set.message] })
    }
    res.status(200).json({ mesasge: "Colors set", error: [] })
  } catch (err) {
    next(err.message);
  }
})

router.post("/set_social", async function (req, res, next) {
  try {
    const { id_wordpress, name, is_active_network, url } = req.body;
    if (!id_wordpress || !name || is_active_network == null || !url) {
      return res.status(400).json({ error: "Missing fields" })
    }
    const admin = new AdminUser({})
    const checkAdmin = await admin.userIsAdmin({ id_wordpress })
    if (checkAdmin == false) {
      return res.status(401).json({ error: "Not authorized" })
    }
    const user = new AdminUser({ id_wordpress });
    const user_id = await user.getUserId();
    const property_id = await user.getPropertyId({user_id})
    console.log(property_id)
    const check_set = await user.setSocialNetworks({ property_id ,user_id, name, is_active_network, url });
    if (check_set.error == true) {
      return res.status(400).json({ error: ["Error set social", check_set.message] })
    }
    res.status(200).json({ mesasge: "Social set", error: [] })
  } catch (err) {
    next(err.message);
  }
})

router.post("/set_company_data", async function (req, res, next) {
  try {
    const { id_wordpress, schedules, phone, address, name, city, country } = req.body;
    if (!id_wordpress || !schedules || !phone || !address || !name || !city || !country) {
      return res.status(400).json({ error: "Missing fields" })
    }
    const admin = new AdminUser({})
    const checkAdmin = await admin.userIsAdmin({ id_wordpress })
    if (checkAdmin == false) {
      return res.status(401).json({ error: "Not authorized" })
    }
    const user = new AdminUser({ id_wordpress });
    const user_id = await user.getUserId();
    const check_set = await user.setCompanyData({ user_id, schedules, phone, address, name, city, country });
    if (check_set.error == true) {
      return res.status(400).json({ error: ["Error set company data", check_set.message] })
    }
    res.status(200).json({ mesasge: "Company data set", error: [] })
  } catch (err) {
    next(err.message);
  }
})

router.post("/set_suppliers", async function (req, res, next) {
  try {
    const { id_wordpress, suppliers } = req.body;
    if (!id_wordpress || !suppliers) {
      return res.status(400).json({ error: "Missing fields" })
    }
    const admin = new AdminUser({})
    const checkAdmin = await admin.userIsAdmin({ id_wordpress })
    if (checkAdmin == false) {
      return res.status(401).json({ error: "Not authorized" })
    }
    const user = new AdminUser({ id_wordpress });
    const user_id = await user.getUserId();
    const check_set = await user.setSuppliers({ user_id, suppliers });
    if (check_set.error == true) {
      return res.status(400).json({ error: ["Error set suppliers", check_set.message] })
    }
    res.status(200).json({ mesasge: "Suppliers set", error: [] })
  } catch (err) {
    next(err.message);
  }
})
router.post("/edit_company_data", async function (req, res, next) {
  try {
    const { id_wordpress, schedules, phone, address, name, city, country } = req.body;
    if (!id_wordpress || !schedules || !phone || !address || !name || !city || !country) {
      return res.status(400).json({ error: "Missing fields" })
    }
    const admin = new AdminUser({})
    const checkAdmin = await admin.userIsAdmin({ id_wordpress })
    if (checkAdmin == false) {
      return res.status(401).json({ error: "Not authorized" })
    }
    const user = new AdminUser({ id_wordpress });
    const user_id = await user.getUserId();
    const property_id = await user.getPropertyId({ user_id });
    const check_set = await user.editCompanyData({ id_company_data: property_id.data[0].id_company_data, schedules, phone, address, name, city, country });
    if (check_set.error == true) {
      return res.status(400).json({ error: ["Error edit company data", check_set.message] })
    }
    res.status(200).json({ mesasge: "Company data edit", error: [] })
  } catch (err) {
    next(err.message);
  }
})
router.post("/edit_social", async function (req, res, next) {
  try {
    const { id_wordpress, name, is_active_network, url } = req.body;
    console.log(req.body)
    if (!id_wordpress || !name || is_active_network == null || !url) {
      return res.status(400).json({ error: "Missing fields" })
    }
    const admin = new AdminUser({})
    const checkAdmin = await admin.userIsAdmin({ id_wordpress })
    if (checkAdmin == false) {
      return res.status(401).json({ error: "Not authorized" })
    }
    const user = new AdminUser({ id_wordpress });
    const user_id = await user.getUserId();
    const property_id = await user.getPropertyId({ user_id });
    const check_set = await user.editSocialNetworks({ property_id:property_id.data[0].property_id, name, is_active_network, url });
    if (check_set.error == true) {
      return res.status(400).json({ error: ["Error edit social", check_set.message] })
    }
    res.status(200).json({ mesasge: "Social edit", error: [] })
  } catch (err) {
    next(err.message);
  }
})

router.post("/get_users", async function (req, res, next) {
  try {
    const { id_wordpress } = req.body
    const user = new AdminUser({ id_wordpress })
    const id_user = user.getUserId()
    const users_data = user.getFullUsers({ id_user })
    res.status(200).send({ data: users_data, err: [] })
  } catch (err) {
    next(err.message);
  }
})
router.post("/get_properties", async function (req, res, next) {
  try {
    const { id_wordpress } = req.body
    const user = new AdminUser({ id_wordpress })
    const id_user = await user.getUserId()
    console.log(id_user)
    const props = await user.getFullProperties({ user_id: id_user })
    res.status(200).send({ data: props, err: [] })
  } catch (err) {
    next(err.message);
  }
})
router.post("/set_logo", async function (req, res, next) {
  try{
    const {id_wordpress,path}=req.body
    if(!id_wordpress || !path){
      return res.status(400).send({mesagge:"Missing fields",data:[],err:["Missing fields"]})
    }
    const admin = new AdminUser({})
    const checkAdmin = await admin.userIsAdmin({ id_wordpress })
    if (checkAdmin == false) {
      return res.status(401).json({ mesagge:"Missing fields",data:[],error: ["Not authorized"] })
    }
    const user = new AdminUser({ id_wordpress });
    const user_id = await user.getUserId();
    const logo=await user.setLogo({user_id,logo:path})
    res.status(200).send({mesagge:"Image upload",data:"logo.data",err:[]})
  } catch (err) {
    console.log(err)
    next(err.message);
  }
})
/*        {
            "id_property": "c8d814e1-9290-4859-8c62-6b3e81335b4b",
            "id_social_networks": null,
            "colors_user": "\"{\\\"primario\\\":\\\"#3f51b5\\\",\\\"secundario\\\":\\\"#303f9f\\\",\\\"fondo\\\":\\\"#eaecf5\\\",\\\"enfasis\\\":\\\"#5af158\\\"}\"",
            "id_company_data": null,
            "location": null,
            "suppliers_select": null,
            "user_id": "fc3965c3-4530-49f9-94f3-4572ad7ecbdc",
            "logo_user": null,
            "schedules": null,
            "name_company": null,
            "address_company": null,
            "country": null,
            "city": null,
            "phone_number": null,
            "network_name": "Facebook",
            "url": "https://www.facebook.com/marcojhurtadob",
            "is_active_network": true,
            "id_network": "0c6a7e09-380c-4c56-a558-a456cbae307c",
            "property_id": "c8d814e1-9290-4859-8c62-6b3e81335b4b"
        },
        {
            "id_property": "c8d814e1-9290-4859-8c62-6b3e81335b4b",
            "id_social_networks": null,
            "colors_user": "\"{\\\"primario\\\":\\\"#3f51b5\\\",\\\"secundario\\\":\\\"#303f9f\\\",\\\"fondo\\\":\\\"#eaecf5\\\",\\\"enfasis\\\":\\\"#5af158\\\"}\"",
            "id_company_data": null,
            "location": null,
            "suppliers_select": null,
            "user_id": "fc3965c3-4530-49f9-94f3-4572ad7ecbdc",
            "logo_user": null,
            "schedules": null,
            "name_company": null,
            "address_company": null,
            "country": null,
            "city": null,
            "phone_number": null,
            "network_name": "Facebook",
            "url": "https://www.facebook.com/marcojhurtadob",
            "is_active_network": true,
            "id_network": "59142fea-42b9-4212-babf-48e9a4c05cf1",
            "property_id": "c8d814e1-9290-4859-8c62-6b3e81335b4b"
        },
        {
            "id_property": "c8d814e1-9290-4859-8c62-6b3e81335b4b",
            "id_social_networks": null,
            "colors_user": "\"{\\\"primario\\\":\\\"#3f51b5\\\",\\\"secundario\\\":\\\"#303f9f\\\",\\\"fondo\\\":\\\"#eaecf5\\\",\\\"enfasis\\\":\\\"#5af158\\\"}\"",
            "id_company_data": null,
            "location": null,
            "suppliers_select": null,
            "user_id": "fc3965c3-4530-49f9-94f3-4572ad7ecbdc",
            "logo_user": null,
            "schedules": null,
            "name_company": null,
            "address_company": null,
            "country": null,
            "city": null,
            "phone_number": null,
            "network_name": "Facebook",
            "url": "https://www.facebook.com/marcojhurtadob3",
            "is_active_network": true,
            "id_network": "8dd78693-8425-4083-b2ae-d97de8afcc9e",
            "property_id": "c8d814e1-9290-4859-8c62-6b3e81335b4b"
        } */