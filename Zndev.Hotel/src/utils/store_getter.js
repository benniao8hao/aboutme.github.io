import router from '@/router'
import store from '@/store'
import requester from '@/utils/axios.js'
import {
  AlertModule
} from 'vux'
let StoreGetter = {
  //	test:function(num){//测试Promise对象的写法
  //		return new Promise(function(resolve,reject){
  //			if(num%2==0)
  //				resolve(num)
  //			else
  //				reject('test error')
  //		})
  //	},
  /*
   * account:groupAccount
   * needRefresh:是否要重新请求获取（用于首页，重新加载所有店铺，防止有新店铺新增后不显示）
   */
  getOrg() {
    return store.getters["app/store"]
  },
  setOrg(org) {
    //console.log("setOrg", org)
    store.dispatch('app/updateCurrentStore', org)
  },
  getStores: function(account, storeId = 0, needRefresh = false) {
    if (!needRefresh) {
      let org = StoreGetter.getOrg()
      if (org && org.groupAccount == account) {
        return new Promise((resolve, reject) => {
          resolve(org)
        })
      }
    }
    let that = this

    return requester({
      url:'/Api.Web/Common/StoresByGroupaccount',
      params: {
        account
      }
    }).then(res => {
      if (res.data.groupId == 0) {
        router.push({
          name: 'error',
          params: {
            //errorMsg: '该商户不存在，请检查网址是否正确'
            errorMsg: '该商户不存在，请检查网址是否正确'
          }
        })
      } else if (res.data.stores && res.data.stores.length > 0) {
        let promise = that.validStores(res, storeId)
        return promise
      } else {
        router.push({
          name: 'error',
          params: {
            errorMsg: '该商户不存在正常状态的分店'
          }
        })
      }
    }).catch(error => {
      console.log(error);
      setTimeout(function() {
        store.dispatch('app/updateLoadingStatus', {
          isLoading: false
        })
      }, 1000 * 10)
      AlertModule.show({
        title: "提示",
        content: "获取店铺信息异常，请稍后重试"
      })
      return new Promise((resolve, reject) => {
        reject(error)
      })
    }) 
  },
  getStoreServiceInfo(storeId, sysType) {
    return requester({
      url: '/Api.Web/Common/StoreServiceInfo',
      params: {
        storeId,
        sysType
      }
    })
  },
  //验证并 保存集团、店铺信息
  validStores: function(res, storeId = 0) {
    return new Promise(function(resolve, reject) {
      let data = res.data
      if (data.groupId == 0) {
        router.push({
          name: 'error',
          params: {
            errorMsg: '该商户不存在'
          }
        })
        reject('groupId error')
      } else if (!data.stores || data.stores.length == 0) {
        router.push({
          name: 'error',
          params: {
            errorMsg: '该商户不存在正常状态的分店'
          }
        })
        store.dispatch('app/updateLoadingStatus', {
          isLoading: false
        })
        reject('data.stores.length==0')
        return
      }

      let defaultStore = null
      for (let i = 0; i < data.stores.length; i++) {
        if (data.stores[i].isDefault) {
          defaultStore = data.stores[i]
          break
        }
      }
      if (!defaultStore) {
        defaultStore = data.stores[0]
      }
      if (storeId > 0) //已经传递了店铺ID过来了
      {
        defaultStore = data.stores.find(s => s.id == storeId)
      }
      if (!defaultStore) {
        defaultStore = data.stores[0]
      }
      //console.log(defaultStore)
      let org = {
        groupId: data.groupId,
        storeId: defaultStore.id,
        groupAccount: data.groupAccount,
        storeName: defaultStore.name,
        useType: data.useType,
        isSelf: defaultStore.isSelf
      }
      StoreGetter.setOrg(org)
      //console.log(data)
      resolve(Object.assign(org, data))
    })

  }
}
export default StoreGetter
