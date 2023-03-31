import axios from "axios";

const service = axios.create({
  baseURL: 'http://localhost:47300',
  withCredentials: false,
  timeout: 5000,
  headers: {
    'Authorization': 'API-KEY bgwp_marcou8XoL0b47ImGhZsSuwzHCxX0qC6jQhljhhsGYHjisq57KY2rp37miOZsCNRLt0vtsnNIqn9eZdtyr1OFQGaa2toPTpZgDRqPG9PEWV9onuoS7duFz7DSOO4AWowA4qC4stSnlRZ2BsySBaoKohGhX6MQYKq1uW5WE7VaJ0l0go1omtHVumG4ey4TuLzutcrsujwqbBgmGnMxtMk6ZSKRNT3jKrdqEdzcgHzyz8YU5bPn9KcsJ2PY99v85hP4Gp8cB0qyaYzSIGgY9E4oRgTUJwcWv1Y3GtwmMItNdWWcrU0v8tShVGLbIYGarpVtCbAAAfhSvcnnIdnStO404uBmBKeatlCb5O4l9o7awScqCuRmsHllURQrfCRCFbcuu8KS5pZbV1CtYoKHgIVFxTsKSIIIzTKYcJhceaceROOsMpIKpNQXXBNmg3ovKxaBiA0QeLa1N1plhPCSTzCQaTObrZB1UtXqglwcZ5hPb0cRHgT3yXFRmuwzyrIgUBVthWcOzVDPMflZ0OiP9kVCy4vsfs5ufJANXBmUDQGGYLtJvljImZdtZG1KBnQQd4W1k14GJ4S3bBfoUOMxWVh93hHh96OiZ512r1csceu5yV6BrS4q67NX4dzpoy00XlfTmyADxbOHRljF9ERybNIyeBJjlxO8hyd2E8KLRyVsCyqEkTdgNYbCEtZrX4qI9g7SCCjGgmdtPyDMZsGNlP271kcJzfoouH8W4vSBJ01k9WZkNedVPLAh55YbdQBFyRYaujbenuNUgqXY3lF1N5B9j1TxJ1LiYEhX3BKZxXLic8yNNSOalymqpthaGaNNimC1TorUVdmcx7T7CdxmuGdAm8o6MhabQCKGuEfI6OhS8Am8n09lWfffkvJ23KTacL2UuEhqG2aLB2q3vq9flHAJG7z4zEnZ5oGZ7VwjAUXvqQqiTi3kfNF5LmedecUDFgy21NBXxRzVfS1Lh05ajslpngHkbYS6JKvwRcR2pEfOFwUrd4sOZ58toBsZRf'
    ,'allow-origin': '*',
    'Access-Control-Allow-Origin': '*',
  } 
}
)

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
    // agregar el token al header

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