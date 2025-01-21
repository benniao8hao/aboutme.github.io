//当前访问者在当前集团下的的缓存与移除缓存
let storage = window.localStorage
const tokenKeyPrefix = 'jwt_'

export function getToken(groupAsscount) {
  let tokenKey = `${tokenKeyPrefix}${groupAsscount}`
  let info = storage.getItem(tokenKey)
  if (info) {
    info = JSON.parse(info)
    return info
  }
  return null
}

export function setToken(token, groupAsscount) {
  let tokenKey = `${tokenKeyPrefix}${groupAsscount}`
  if (storage.getItem(tokenKey)) {
    storage.removeItem(tokenKey)
  }
  let js = JSON.stringify(token)
  return storage.setItem(tokenKey, js)
}

export function removeToken(groupAsscount) {
  let tokenKey = `${tokenKeyPrefix}${groupAsscount}`
  return storage.removeItem(tokenKey)
}
