//推荐人缓存
let storage = window.sessionStorage
const key = "znreferer"

export function setReferer(uid) {
    if (storage.getItem(key)) {
        storage.removeItem(key)
    }
    return storage.setItem(key, uid)
}

export function getReferer() {
    let uid = storage.getItem(key)
    if (uid) {
        return uid
    }
    return null
}