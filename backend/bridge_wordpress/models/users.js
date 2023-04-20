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
    static async generateToken(user) {
      try {
        console.log("this.generateToken")
        const res = await knex_user_db.raw(`SELECT * FROM "public"."role" WHERE "id_role" = '${user.role}'`)
        console.log(res)
        console.log(user)
        if(res.rows.length > 0){
          this.role = res.rows[0].id_role;
          console.log(res.rows[0])
        }
        
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
        console.log("id_wordpress_admin", id_wordpress_admin)
        const res = await knex_user_db.raw(`SELECT * FROM "public"."user_admin" WHERE "id_wordpress" = '${id_wordpress_admin}'`)
        if(res.rows.length > 0){
          this.id_user_admin = res.rows[0].id_admin_user;
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
    async login(){
      const user = await this.getUser();
      if(user == null){
        return {token: false, role: null}
      }
      const check_password = await bcrypt.compare(this.password, user.password_user);
      if(!check_password){
        return {token: false, role: null}
      }
      if(user.role == null){
        return {token: false, role: null}
      }
      if(user.email_user != this.email){
        return {token: false, role: null}
      }
      const token = await User.generateToken(user);
      return {token, role: user.role}
    }
    async registerUser(){
      await this.setPassword(this.password);
      await this.setRole();
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
      console.log("user", user)
      await knex_user_db('user').insert(user);
      return true;
    }
    async editUser({ email, user, password, role}){
      try{
        const user_db = await this.getUser();
        console.log("user db ", user_db)
        const obj_user = {
          email_user: email,
          password_user: password,
          role: role,
          name_user: user,
          role:'',
          id_user_admin: user_db.id_user_admin,
          id_wp: user_db.id_wp,


        }
        const aux_role = await this.getRole({role});
        if(aux_role.error == true){
          return aux_role;
        }
        const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS));
        obj_user.password_user = await bcrypt.hash(password, salt);
        obj_user.role = aux_role;
        await knex_user_db('user').where({id_wp: this.id_wordpress}).update(obj_user);
        return true;
      }catch(err){
        console.log(err)
        return {error: true, message: err.message}
      }
    }
    async getUser(){
      try{
        const res = await knex_user_db.raw(`SELECT * FROM "public"."user" WHERE "id_wp" = '${this.id_wordpress}'`)
        if(res.rows.length > 0){
          return res.rows[0];
        }
        return null;
      }catch(err){
        console.log(err)
        return {error: true, message: err.message}
      }
    }
    async getRole({role}){
      try{
        const res = await knex_user_db.raw(`SELECT * FROM "public"."role" WHERE "name" = '${role}'`)
        if(res.rows.length > 0){
          this.role = res.rows[0].id_role;
          return res.rows[0].id_role;

        }
        return null;
      }catch(err){
        console.log(err)
        return {error: true, message: err.message}
      }
    }
}