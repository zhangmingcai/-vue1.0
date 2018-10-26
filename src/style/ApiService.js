import Vue from 'vue'

// 导入vue-resource并配置
import VueResource from 'vue-resource'
Vue.use(VueResource)
Vue.http.options.root = 'http://test.youyicloud.com/Poster/api' // 设置服务器根路径为 '/root'
Vue.http.options.emulateJSON = true // 作为HTML form发送请求
// 将服务器返回数据解析为JSON格式
Vue.http.interceptors.push((request, next) => {
  next((response) => {
    if (typeof response.body === 'string') {
      response.body = JSON.parse(response.body)
    }
  })
})
let Device = (function () {
  var path = 'deviceGroup/'
  var needToken = false
  return {
    addGroup: function (groupName, updateTime, groupDesc) {
      return httpPromise({
        method: 'get',
        url: path + 'addGroup',
        params: {
          groupName: groupName,
          updateTime: updateTime,
          groupDesc: groupDesc
        },
        needToken: needToken
      })
    },
    queryGroupList: function () {
      return httpPromise({
        method: 'get',
        url: path + 'queryGroupList',
        params: {
          pageNumber: 0
        },
        needToken: needToken
      })
    },
    queryGroupInfo: function (groupId) {
      return httpPromise({
        method: 'get',
        url: path + 'queryGroupInfo',
        params: {
          groupId: groupId
        }
      })
    },
    deleteGroup: function (groupId) {
      return httpPromise({
        method: 'get',
        url: path + 'deleteGroup',
        params: {
          groupId: groupId
        },
        needToken: needToken
      })
    },
    updateGroup: function (groupId, updateTime, groupDesc, groupName) {
      return httpPromise({
        method: 'get',
        url: path + 'updateGroup',
        params: {
          groupId: groupId,
          updateTime: updateTime,
          groupDesc: groupDesc,
          groupName: groupName
        },
        needToken: needToken
      })
    },
  }
})()

export {Device}

function httpPromise (httpObject) {
  var $http = Vue.http
  if (httpObject.method !== 'post' && httpObject.method !== 'get') {
    console.error('request should be post or get!')
    return
  }
  if (httpObject.needToken) {
    httpObject.params.userId = window.localStorage.getItem('userId')
    httpObject.params.recId = window.localStorage.getItem('recId')
    httpObject.params.token = window.localStorage.getItem('token')
  }
  if (httpObject.method === 'post') {
    return $http[httpObject.method](httpObject.url, httpObject.params, httpObject.options)
  }
  if (httpObject.method === 'get') {
    return $http[httpObject.method](httpObject.url, httpObject.options)
  }
}

