import { v4 as uuid } from "uuid";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
var config = dotenv.config();
global.config = config.parsed;
const admin = '1cfdb754-a60a-472c-b6cc-4a5037c1633c'
export default class Users {
  constructor({ email, password, id_wordpress, user }) {
    this.email = email;
    this.password = password;
    this.id_wordpress = id_wordpress;
    this.user = user;
    this.users = [];
    this.id = '';
    this.role=[];
  }
  async registerUser(user) {

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
      await knex('user_admin').insert(user);
      return true;
    } catch (err) {
      return false;
    }
  }
  async userIsRegistered(user){
    try{
      const res = await knex_user_db('user_admin').where({email: user.email}).select('id_admin_user');
      if(res.length > 0){
        return true;
      }
      return false;
    }catch(err){
      return false;
    }
  }
  async verifyUser(user){
    try{
      const res = await global.knex_user_db('user_admin').where({email: user.email}).select('*').join('role', 'user_admin.role_admin', '=', 'role.id_role');
      console.log(res)
      if(res.length > 0){
        const match = await bcrypt.compare(user.password, res[0].password);
        if(match){
          return true;
        }
      }
      return false;
    }catch(err){
      return false;
    }
  }
  async verifyUser(){
    try{
      const res = await knex_user_db('user_admin').where({email: this.email}).select('*').join('role', 'user_admin.role_admin', '=', 'role.id_role');
      if(res.length > 0){
        const match = await bcrypt.compare(this.password, res[0].password);
        if(match){
          this.role = res[0].role_admin;
          return true;
        }
      }
        return false;
    }catch(err){
      console.log(err)
      return false;
    }
  }
  async login() {
    try{
      const user = {
        email: this.email,
        password: this.password,
      };
      const exist_user = await this.verifyUser(user);
      if(exist_user){
        const token = this.createToken();
        return {token, role: this.role};
      }
      return false;
    }catch(err){
      console.log(err)
      return false;
    }
  }
  createToken() {
    try{
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
    }catch(err){
      console.log(err)

      return null;
    }
  }
}