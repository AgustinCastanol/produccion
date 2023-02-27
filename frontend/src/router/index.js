import { createRouter, createWebHashHistory } from 'vue-router'
import jwt from '../helpers/jwt.js'


const router = createRouter({
  history: createWebHashHistory(),
  hash: false,
  routes: [
    {
      path: '/',
      name: 'home',
      component: ()=> import('../views/HomeView.vue'),
      beforeEnter: jwt
    },
    {
      path: '/products',
      name: 'products',
      component: ()=> import('../views/ProductsView.vue'),
      beforeEnter: jwt
    },
    {
      path: '/supplier',
      name: 'supplier',
      component: ()=> import('../views/SupplierView.vue'),
      beforeEnter: jwt
    },
    {
      path: '/users',
      name: 'users',
      component: ()=> import('../views/UsersViews.vue'),
      beforeEnter: jwt
    },
    {
      path: '/categories',
      name: 'categories',
      component: ()=> import('../views/CategoriesView.vue'),
      beforeEnter: jwt
    },
    {
      path: '/details',
      name: 'details',
      component: ()=> import('../views/DetailsView.vue'),
      beforeEnter: jwt
    },
    {
      path: '/crons',
      name: 'crons',
      component: ()=> import('../views/CronsView.vue'),
      beforeEnter: jwt
    },
    {
      path: '/loadProducts',
      name: 'loadProducts',
      component: ()=> import('../views/FormProducts.vue'),
      beforeEnter: jwt
    },
    {
      path: '/login',
      name: 'login',
      component: ()=> import('../views/LoginView.vue'),
      beforeEnter:(to, from, next)=>{
        const token = localStorage.getItem('token')
        if(token) return next({name: 'home'})
        return next()
      }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'error404',
      component: ()=> import('../views/Error404View.vue')
    }
  ]
})

export default router
