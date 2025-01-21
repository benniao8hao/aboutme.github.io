import request from '@/utils/requester'
import {
  getToken
} from '@/utils/auth'

export function login(username, password, rememberMe, isMobile, groupId) {
  let data = {
    account: username,
    password: password,
    rememberMe: rememberMe || 0,
    isMobile: isMobile || 0,
    loginType: 2,
    groupId
  }
  return request({
    url: '/api/author/login',
    data
  })
}

export function logout(groupAsscount) {
  return request({
    url: '/api/author/logout',
    params: {
      token: getToken(groupAsscount)
    }
  });
}



export function modifyPassword(params) {
  return request({
    url: '/api/author/ModifyPassword',
    params
  });
}

export function regist(data) {
  return request({
    url: '/api/author/Regist',
    method: 'post',
    data
  })
}
