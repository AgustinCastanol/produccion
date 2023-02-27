import { nextTick } from "vue"

export default function (to, from, next){
   const token = localStorage.getItem('token')
   if(!token) return next({name: 'login'})
    return next()

   
}