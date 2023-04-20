import axios from "axios";

const service = axios.create({
  baseURL: 'https://soyave.ar/img_api',
  withCredentials: false,
  timeout: 5000,
  headers: {
    'allow-origin': '*',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',


  }
})

service.interceptors.request.use(
  (config) => {
  return config;
  },
  (error) => {
   console.log("request err", error);
    return Promise.reject(error);
  }
)

service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    //loadingInstance.close()

    const res = response.data
    //console.log("resdata", res)

    // if the custom code is not 20000, it is judged as an error.



    return res

  },
  error => {
    //loadingInstance.close()
    console.log('err', error) // for debug

    return Promise.reject(error)
  }
)

export default service