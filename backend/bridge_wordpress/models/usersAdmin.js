import { v4 as uuid } from "uuid";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
var config = dotenv.config();
global.config = config.parsed;
const admin = '1cfdb754-a60a-472c-b6cc-4a5037c1633c'
export default class Users {
  constructor({ email, password, id_wordpress, user }) {
    this.email = email || '';
    this.password = password || '';
    this.id_wordpress = id_wordpress || '';
    this.user = user || '';
    this.users = [];
    this.id = '';
    this.role = [];
  }

  async registerUser() {
    /*INSERT INTO public.user_admin(
  id_admin_user, id_wordpress, email, password, "user", role_admin)
  VALUES (?, ?, ?, ?, ?, ?); */
    try {
      const user = {
        email: this.email,
        password: this.password,
        id_wordpress: this.id_wordpress,
        user: this.user,
        id_admin_user: uuid(),
        role_admin: admin,
      };
      const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS));
      user.password = await bcrypt.hash(this.password, salt);
      const exist_user = await this.userIsRegistered(user)
      if (exist_user) {
        return false;
      }
      await knex_user_db('user_admin').insert(user);
      const token = this.createToken();
      console.log(token)
      return { token,user };

    } catch (err) {
      console.log(err)
      return false;
    }
  }
  async userIsRegistered(user) {
    try {
      const res = await knex_user_db('user_admin').where({ email: user.email }).select('id_admin_user');
      if (res.length > 0) {
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  }
  async userIsAdmin({ id_wordpress }) {
    try {
      const res = await knex_user_db('user_admin').where({ id_wordpress: id_wordpress });
      if (res.length > 0) {
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  }
  async verifyUser(user) {
    try {
      console.log("entre a verificar")
      const res = await global.knex_user_db('user_admin').where({ email: user.email }).select('*').join('role', 'user_admin.role_admin', '=', 'role.id_role');
      console.log(res,"restpuesta")
      if (res.length > 0) {
        const match = await bcrypt.compare(user.password, res[0].password);
        if (match) {
          return true;
        }
      }
      return false;
    } catch (err) {
      console.log(err,"hubo un error")
      return false;
    }
  }
  async verifyUser() {
    try {
      console.log("entre a verificar sin data")
      const res = await knex_user_db('user_admin').where({ email: this.email }).select('*').join('role', 'user_admin.role_admin', '=', 'role.id_role');
      console.log(res,"restpuesta")
      if (res.length > 0) {
        console.log("this.password",this.password)
        console.log("res[0].password",res[0].password)
        const match = await bcrypt.compare(this.password, res[0].password);
        console.log(match,"match")
        if (match) {
          this.role = res[0].role_admin;
          return true;
        }
      }
      return false;
    } catch (err) {
      console.log(err)
      return false;
    }
  }
  async login() {
    try {
      const user = {
        email: this.email,
        password: this.password,
      };
      const exist_user = await this.verifyUser(user);
      console.log("exit_iser", exist_user)
      if (exist_user) {
        const token = this.createToken();
        return { token, role: this.role };
      }
      return false;
    } catch (err) {
      console.log(err)
      return false;
    }
  }
  createToken() {
    try {
      const token = jwt.sign(
        {
          id: this.id_wordpress,
          email: this.email,
          role: this.role,
        },
        process.env.SECRET,
        {
          expiresIn: process.env.JWT_EXPIRES_IN || "1d",
        }
      );
      return token;
    } catch (err) {
      console.log(err)

      return null;
    }
  }
  async editUser() {
    try {
      const user = {
        email: this.email,
        id_wordpress: this.id_wordpress,
        user: this.user,
        password: this.password
      };
      console.log(this.password,"soy lo que se va a hashear")
      const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS));
      user.password = await bcrypt.hash(this.password, salt);
      console.log("aca")
      console.log(user)
      await knex_user_db('user_admin').where({ id_wordpress: user.id_wordpress }).update(user);
      
      return { error: false, message: 'User updated' };
    } catch (err) {
      return { error: true, message: err.message };
    }
  }
  async crateProperty({ user_id }) {
    try {
      console.log(user_id)
      if(!user_id)return { error: true, message: 'User not found'}
      const property = {
        id_property: uuid(),
        user_id: user_id,
      };
      await knex_user_db('properties_user').insert({
        ...property,
        id_social_networks: null,
        colors_user: null,
        id_company_data: null,
        location: null,
        suppliers_select: null,
        logo_user: null,
      });
      return { error: false, message: 'Property created', property };
    } catch (err) {
      return { error: true, message: err.message };
    }
  }
  async getUserId() {
    try {
      const res = await knex_user_db('user_admin').where({ id_wordpress: this.id_wordpress }).select('id_admin_user');
      return res[0].id_admin_user;
    } catch (err) {
      return null;
    }
  }
  async createSocials({ property_id  }) {
    try{
      try {
        let names=['Facebook','Instagram','Twitter','Linkedin','YouTube'];
        for(let c = 0; c < 4; c++){
          await knex_user_db('social_networks').insert({
            id_network: uuid(),
            property_id: property_id,
            network_name: names[c],
            url: null,
            is_active_network: false,
          });
        }
        return { error: false, message: 'Social networks added' };
      } catch (err) {
        return { error: true, message: err.message };
      }

    }catch(err){
      return { error: true, message: err.message };
    }
  }
  async deleteUser() {
    try {
      const user = {
        email: this.email,
        id_wordpress: this.id_wordpress,
        user: this.user,
      };
      await knex_user_db('user').where({ id_wp: user.id_wordpress }).del();
      return { error: false, message: 'User deleted' };
    } catch (err) {
      return { error: true, message: err.message };
    }
  }
  async deleteUser(id_wp) {
    try {
      await knex_user_db('user').where({ id_wp: id_wp }).del();
      return { error: false, message: 'User deleted' };
    } catch (err) {
      return { error: true, message: err.message };
    }
  }
  async getUser() {
    try {
      const user = {
        email: this.email,
        id_wordpress: this.id_wordpress,
        user: this.user,
      };
      const res = await knex_user_db('user_admin').where({ id_wordpress: user.id_wordpress }).select('*');
      return { error: false, message: 'User deleted', data: res };
    } catch (err) {
      return { error: true, message: err.message };
    }
  }
  async setCompanyData({ user_id, schedules, phone, address, name, city,country }) {
    try {
      const data = {
        id_company_data: uuid(),
        schedules: schedules==null?null:schedules,
        phone_number: phone==null?null:phone,
        address_company: address==null?null:address,
        city: city==null?null:city,
        name_company: name==null?null:name,
        country: country==null?null:country,
      }
      console.log(data)
      await knex_user_db('company_data').insert(data);
      await knex_user_db('properties_user').where({ user_id }).update({ id_company_data: data.id_company_data });
      return { error: false, message: 'Company data added' };
    } catch (err) {
      return { error: true, message: err.message };
    }
  }
  async setSocialNetworks({ property_id,user_id, name, is_active_network, url }) {
    try {
      const data = {
        id_network: uuid(),
        network_name: name,
        is_active_network,
        url: url,
        property_id
      }
      await knex_user_db('social_networks').insert(data);
      return { error: false, message: 'Social networks added' };
    } catch (err) {
      return { error: true, message: err.message };
    }
  }
  async setColors({ user_id, colors }) {
    try {

      await knex_user_db('properties_user').where({ user_id }).update({ colors_user: JSON.stringify(colors) });
      return { error: false, message: 'Colors added' };
    } catch (err) {
      return { error: true, message: err.message };
    }
  }
  async setLocations({ user_id, location }) {
    try {
      await knex_user_db('properties_user').where({ user_id }).update({ location: JSON.stringify(location) });
      return { error: false, message: 'Locations added' };
    } catch (err) {
      return { error: true, message: err.message };
    }
  }
  async setSuppliers({ user_id, suppliers }) {
    try {
      await knex_user_db('properties_user').where({ user_id }).update({ suppliers_select: JSON.stringify(suppliers) });
      return { error: false, message: 'Suppliers added' };
    } catch (err) {
      return { error: true, message: err.message };
    }
  }
  async editLocation({ id_property, locations }) {
    try {
      await knex_user_db('properties_user').where({ id_property: id_property }).update({ location: JSON.stringify(locations) });
      return { error: false, message: 'Locations edited' };
    } catch (err) {
      return { error: true, message: err.message };
    }
  }
  async editSuppliers({ id_property, suppliers }) {
    try {
      await knex_user_db('properties_user').where({ id_property: id_property }).update({ suppliers_select: JSON.stringify(suppliers) });
      return { error: false, message: 'Suppliers edited' };
    } catch (err) {
      return { error: true, message: err.message };
    }
  }
  async editColors({ id_property, color }) {
    try {
      await knex_user_db('properties_user').where({ id_property: id_property }).update({ colors_user: JSON.stringify(color) });
      return { error: false, message: 'Colors edited' };
    } catch (err) {
      return { error: true, message: err.message };
    }
  }
  async editCompanyData({ id_company_data, schedules, phone, address, name, city,country}) {
    try {
      const data = {
        schedules,
        phone_number: phone,
        address_company: address,
        name_company: name,
        city,
        country
      }
      await knex_user_db('company_data').where({ id_company_data }).update(data);
      return { error: false, message: 'Company data edited' };
    } catch (err) {
      return { error: true, message: err.message };
    }
  }
  async editSocialNetworks({ name, is_active_network, url,property_id }) {
    try {
      const data = {
        network_name: name,
        is_active_network,
        url: url
      }
      await knex_user_db('social_networks').where({network_name: name, property_id}).update(data);
      return { error: false, message: 'Social networks edited' };
    } catch (err) {
      return { error: true, message: err.message };
    }
  }
  async getProperties({ user_id }) {
    try {
      const res = await knex_user_db('properties_user').where({ user_id }).select('*');
      return { error: false, message: 'Properties', data: res };
    } catch (err) {
      return { error: true, message: err.message };
    }
  }
  async getFullProperties({ user_id }) {
    try {
      /*seleccionar todos los datos de las subtablas con joins  */
      const res = await knex_user_db.raw(`
      SELECT  * FROM properties_user
      LEFT JOIN company_data ON properties_user.id_company_data = company_data.id_company_data
      WHERE properties_user.user_id = '${user_id}'`)
      console.log(res.rows[0].id_property)
      let social_networks = await knex_user_db.raw(`
      SELECT * FROM social_networks
      WHERE social_networks.property_id = '${res.rows[0].id_property}'`)
      social_networks = social_networks.rows
      let company = await knex_user_db.raw(`
      SELECT * FROM company_data
      WHERE company_data.id_company_data = '${res.rows[0].id_company_data}'`)
      company = company.rows[0]

      return  {
        data:
        {
          ...res.rows[0], 
          social_networks,
          company
        }
       };

    }
    catch (err) {
      return { error: true, message: err.message };
    }
  }
  async getPropertiesByUser({ id_user }) {
    try {
      const res = await knex_user_db('properties_user').where({ id_user: id_user }).select('*');
      return { error: false, message: 'Properties', data: res };
    } catch (err) {
      return { error: true, message: err.message };
    }
  }
  async getFullUsers(){
    try{
      const res = await knex_user_db.raw(`
      SELECT * FROM user_admin
      JOIN properties_user ON properties_user.user_id = user_admin.id_admin_user;`)
      const users = await knex_user_db.raw(`
      SELECT * FROM user`)
      return { error: false, message: 'Users', data: {admins:res.rows,users} };
    }catch(err){
      return { error: true, message: err.message };
    }
  }
  // async getFullUsers({id_user}){
  //   try{
  //     const res = await knex_user_db.raw(`
  //     SELECT * FROM users_admin
  //     INNER JOIN user ON users_admin.id_user = user.id_user
  //     WHERE users_admin.id_admin_user = '${id_user}'`)
  //     return { error: false, message: 'Users', data: res.rows[0] };
  //   }catch(err){
  //     return { error: true, message: err.message };
  //   }
  // }
  async getPropertyId({ user_id }) {
    try {
      const res = await knex_user_db('properties_user').where({ user_id }).select('*');
      return res[0].id_property;
    } catch (err) {
      return { error: true, message: err.message };
    }
  }
  async getCompanyId({ user_id }) {
    try {
      const res = await knex_user_db('properties_user').where({ user_id }).select('*');
      return res[0].id_company_data;
    } catch (err) {
      return { error: true, message: err.message };
    }
  }
  async setLogo({ user_id, logo }) {
    try {
      console.log(user_id, logo);
      await knex_user_db('properties_user').where({ user_id }).update({ logo_user: logo });
      return { error: false, message: 'Logo added' };
    } catch (err) {
      console.log(err);
      return { error: true, message: err.message };
    }
  }
  async setPayment({card_number,exp_month,exp_year,cvc,property_id}){
    try{
      const res = await knex_user_db('payment').where({property_id}).select('*');
      if(res.length > 0){
        await knex_user_db('payment').where({property_id}).update({card_number,exp_month,exp_year,cvc});
      }else{
        await knex_user_db('payment').insert({card_number,exp_month,exp_year,cvc,property_id});
      }
      return { error: false, message: 'Payment added' };
    }catch(err){
      console.log(err);
      return { error: true, message: err.message };
    }
  }
}