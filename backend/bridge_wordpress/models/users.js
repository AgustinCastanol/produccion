import { v4 as uuid } from "uuid";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
var config = dotenv.config();
global.config = config.parsed;
export default class User {
  constructor({email, password, role, name, id_wordpress,id_user_admin}){
    this.id = uuid();
    this.email = email || null;
    this.password = password || null;
    this.role = role || "user";
    this.name = name || null;
    this.id_wordpress = id_wordpress || null;
    this.id_user_admin = id_user_admin || null;
  }
    static async hashPassword(password) {}
    static async comparePassword(password, hash) {}
    static async generateToken(user) {}
    static async verifyToken(token) {}
    async setPassword(password) {
      console.log("hola")
      const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS));
      this.password = await bcrypt.hash(password, salt);
    }
    async userExist(){
      const res =await knex_user_db.raw(`SELECT * FROM "public"."user" WHERE "email_user" = '${this.email}'`)
      return res.rows.length > 0 ? true : false;
    }
    async setAdmin({id_wordpress_admin}){
      try{
        const res = await knex_user_db.raw(`SELECT * FROM "public"."user_admin" WHERE "id_wordpress" = '${id_wordpress_admin}'`)
        if(res.rows.length > 0){
          this.id_user_admin = res.rows[0].id_wordpress;
          return;
        }
        this.id_user_admin=null
      }catch(err){
        console.log(err)
      }
    }
    async setRole(){
      const res = await knex_user_db.raw(`SELECT * FROM "public"."role" WHERE "name" = '${this.role}'`)
      if(res.rows.length > 0){
        this.role = res.rows[0].id_role;
        return;
      }
      this.role = null;
    }
    async registerUser(){
      await this.setPassword(this.password);
      const user = {
        id_user: this.id,
        email_user: this.email,
        password_user: this.password,
        role: this.role,
        name_user: this.name,
        id_wp: this.id_wordpress,
        id_user_admin: this.id_user_admin
      }
      const exist_user = await this.userExist()
      if(exist_user){
        return false;
      }
      const role = await this.setRole();
      console.log("user", user)
      await knex_user_db('user').insert(user);
      return true;
    }
    async editUser({ email, user, password, role}){
      try{
        const obj_user = {
          email_user: email,
          password_user: password,
          role: role,
          name_user: user,
          role:''
        }
        const aux_role = await this.getRole({role});
        if(aux_role.error == true){
          return aux_role;
        }
        obj_user.role = aux_role;
        await knex_user_db('user').where({id_wp: this.id_wordpress}).update(user);
        return true;
      }catch(err){
        console.log(err)
        return {error: true, message: err.message}
      }
    }
    async getRole({role}){
      try{
        const res = await knex_user_db.raw(`SELECT * FROM "public"."role" WHERE "name" = '${role}'`)
        if(res.rows.length > 0){
          return res.rows[0].id_role;
        }
        return null;
      }catch(err){
        console.log(err)
        return {error: true, message: err.message}
      }
    }
}