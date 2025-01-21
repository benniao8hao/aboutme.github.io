import axios from 'axios'
import router from '@/router'
import store from '@/store'
import {
  AlertModule
} from 'vux'
import {
  getToken,
  removeToken
} from '@/utils/auth'

// create an axios instance
const service = axios.create({
  // baseURL: process.env.BASE_API,
  timeout: 30000, // request timeout
  callback: null
})

service.interceptors.request.use(config => {
  config.method = "POST"; //默认是POST提交，有需要可覆盖
  let storeOrg = store.getters["app/store"]
  if (storeOrg) {
    let org = storeOrg;
    let token = getToken(org.groupAccount);
    if (token) {
      config.headers['Authorization'] = token // 让每个请求携带token
    }
    let orgJson = {
      groupId: org.groupId,
      storeId: org.storeId,
      groupAccount: org.groupAccount
    };
    //console.log(orgJson);
    config.headers['Organization'] = JSON.stringify(orgJson); //让每个请求携带当前访问的店铺相关信息
  }
  return config
}, error => {
  console.log(error) // for debug
  store.dispatch('app/updateLoadingStatus', {
    isLoading: false
  })
  Promise.reject(error)
})

// respone interceptor
service.interceptors.response.use(
  response => {
    store.dispatch('app/updateLoadingStatus', {
      isLoading: false
    })
    if (typeof (response.config.callback) == 'function') //若要求返回完整的响应信息
    {
      response.config.callback(response);
    }
    const res = response.data;
    if (res.status === 1000) {
      AlertModule.show({
        title: '提示',
        content: res.message
      })
      return Promise.reject(response.data);
    } else if (res.status === 40001) {
      AlertModule.show({
        title: '提示',
        content: 'Organization参数有误'
      })
      return Promise.reject(response.data.message);
    } else if (res.status !== 200) {
      // 401、403:非法的token
      if (res.status === 401 || res.status === 403) {

        AlertModule.show({
          title: '抱歉',
          content: '您未登录或已超时，请登录',
          onHide: function () {
            let org = store.getters["app/store"]
            removeToken(org.groupAccount);
            router.replace({
              path: `/login/${org.groupAccount}/${org.groupId}`,
              query: {
                redirect: router.currentRoute.fullPath
              }
            });
          }
        });
      } else if (res.status === 404) {
        router.push({
          name: '404'
        });
      }
      return Promise.reject(response.data);
    } else {
      // console.log(response.data);
      return response.data;
    }
  },
  error => {
    if (error.response && (error.response.status == 401 || error.response.status == 403)) {
      AlertModule.show({
        title: '抱歉',
        content: '您未登录或已超时，请登录',
        onHide: function () {
          let org = store.getters["app/store"]
          removeToken(org.groupAccount);
          router.replace({
            path: `/login/${org.groupAccount}/${org.groupId}`,
            query: {
              redirect: router.currentRoute.fullPath
            }
          });
        }
      });
    } else if (error.response == undefined && error.message == "Network Error") {
      AlertModule.show({
        title: '抱歉',
        content: '网络连接失败，请检查网络',
        onHide: function () {}
      });
    }
    return Promise.reject(error)
  })

export default service
