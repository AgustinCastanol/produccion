import request from './request.js';
import request_product_image from './request_logos.js';
export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}


export function getProducts(data) {
  return request({
    url: '/get_products',
    method: 'post',
    data
  })
}
export function getProveedores (data){
  return request({
    url: '/get_proveedores',
    method: 'post',
    data
  })
}
export function getCategory (data){
  return request({
    url: '/get_category',
    method: 'post',
    data
  })
}
export function getProveedor (data){
  return request({
    url: '/get_proveedor',
    method: 'post',
    data
  })
}
export function getUsers (data){
  return request({
    url: '/get_users',
    method: 'post',
    data
  })
}
export function getCategories (data){
  return request({
    url: '/get_categories',
    method: 'post',
    data
  })
}
export function getCollections (data){
  return request({
    url: '/get_collections',
    method: 'post',
    data
  })
}

export function getVariants(data){
  return request({
    url: '/get_variants',
    method: 'post',
    data
  })
}

export function searchProduct(data){
  return request({
    url: '/get_products/search',
    method: 'post',
    data
  })
}

export function getCrons(data){
  return request({
    url: '/crons',
    method: 'post',
    data
  })
}

export function getStock(data){
  return request({
    url: '/getStocks',
    method: 'post',
    data
  })
}
export function createCategory(data){
  return request({
    url: '/set_category',
    method: 'post',
    data
  })
}
export function updateCategory(data){
  return request({
    url: '/update_category',
    method: 'post',
    data
  })
}
export function updateSupplier(data){
  return request({
    url: '/update_supplier',
    method: 'post',
    data
  })
}
export function createSupplier(data){
  return request({
    url: '/set_supplier',
    method: 'post',
    data
  })
}
export function runCrons(data){
  return request({
    url: '/run_crons',
    method: 'post',
    data
  })
}

export function getStockLocation(data){
  return request({
    url: '/get_stocks_locations',
    method: 'post',
    data
  })
}
export function setProductForm(data){
  return request({
    url: '/set_product_form',
    method: 'post',
    data
  })
}
export function setSupplier(data){
  return request({
    url: '/set_supplier',
    method: 'post',
    data
  })
}
export function setProductImage(data){
  return request({
    url: '/setProductImage',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}