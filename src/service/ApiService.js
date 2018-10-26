import Vue from 'vue'

// 导入vue-resource并配置
import VueResource from 'vue-resource'
Vue.use(VueResource)
// Vue.http.options.root = 'http://poster.tustcs.com/Poster/api' // 设置服务器根路径为 '/root'
Vue.http.options.root = 'http://poster.tustcs.com/api' // 设置服务器根路径为 '/root'
Vue.http.options.emulateJSON = true // 作为HTML form发送请求
// 将服务器返回数据解析为JSON格式
Vue.http.interceptors.push((request, next) => {
  next((response) => {
    if (typeof response.body === 'string') {
      response.body = JSON.parse(response.body)
    }
  })
})

let Login = (function () {
  var path = 'user/'
  var needToken = false
  return {
    doLogin: function (data) {
      return httpPromise({
        method: 'post',
        url: path + 'login',
        params: {
          userName: data.userName,
          userPwd: data.userPwd
        },
        needToken: needToken
      })
    }
  }
})()

let Device = (function () {
  var path = 'device/'
  var needToken = true
  return {
    addDevice: function (addData) {
      return httpPromise({
        method: 'post',
        url: path + 'addDevice',
        params: {
          deviceName: addData.deviceName,
          deviceToken: addData.deviceToken,
          deviceGroupId: addData.deviceGroupId,
          posterGroupId: addData.posterGroupId
        },
        needToken: needToken
      })
    },
    queryDeviceList: function (current) {
      return httpPromise({
        method: 'post',
        url: path + 'queryDeviceList',
        params: {
          pageNumber: current - 1,
          deviceGroupId: 0,
          posterGroupId: 0
        },
        needToken: needToken
      })
    },
    querySelectDeviceList: function (current, selectPgId, selectDgId) {
      return httpPromise({
        method: 'post',
        url: path + 'queryDeviceList',
        params: {
          pageNumber: current,
          deviceGroupId: selectDgId,
          posterGroupId: selectPgId
        },
        needToken: needToken
      })
    },
    searchDeviceList: function (name, current) {
      return httpPromise({
        method: 'post',
        url: path + 'searchDeviceList',
        params: {
          deviceName: name,
          pageNumber: current - 1
        },
        needToken: needToken
      })
    },
    queryDeviceInfo: function (deviceId) {
      return httpPromise({
        method: 'post',
        url: path + 'queryDeviceInfo',
        params: {
          deviceId: deviceId
        },
        needToken: needToken
      })
    },
    deleteDevice: function (deviceId) {
      return httpPromise({
        method: 'post',
        url: path + 'deleteDevice',
        params: {
          deviceId: deviceId
        },
        needToken: needToken
      })
    },
    updateDevice: function (deviceInfoData) {
      return httpPromise({
        method: 'post',
        url: path + 'updateDevice',
        params: {
          deviceId: deviceInfoData.deviceId,
          deviceToken: deviceInfoData.deviceToken,
          deviceName: deviceInfoData.deviceName,
          deviceGroupId: deviceInfoData.deviceGroupId,
          posterGroupId: deviceInfoData.posterGroupId
        },
        needToken: needToken
      })
    },
    updateDeviceToken: function (deviceTokenData) {
      return httpPromise({
        method: 'post',
        url: path + 'updateDeviceToken',
        params: {
          deviceId: deviceTokenData.deviceId,
          deviceToken: deviceTokenData.deviceToken
        },
        needToken: needToken
      })
    }
  }
})()

let File = (function () {
  var path = 'file/'
  var needToken = true
  return {
    addFile: function (upLoadFileData) {
      return httpPromise({
        method: 'post',
        url: path + 'addFile',
        params: {
          fileName: upLoadFileData.fileName,
          fileDesc: upLoadFileData.fileDesc,
          fileKey: upLoadFileData.fileKey
        },
        needToken: needToken
      })
    },
    queryFileList: function (current) {
      return httpPromise({
        method: 'post',
        url: path + 'queryFileList',
        params: {
          pageNumber: current - 1
        },
        needToken: needToken
      })
    },
    queryAllFileList: function () {
      return httpPromise({
        method: 'post',
        url: path + 'fileGroupList',
        params: {},
        needToken: needToken
      })
    },
    queryFileInfo: function (fileId) {
      return httpPromise({
        method: 'post',
        url: path + 'queryFileInfo',
        params: {
          fileId: fileId
        },
        needToken: needToken
      })
    },
    deleteFile: function (fileId) {
      return httpPromise({
        method: 'post',
        url: path + 'deleteFile',
        params: {
          fileId: fileId
        },
        needToken: needToken
      })
    },
    updateFile: function (fileInfoData) {
      return httpPromise({
        method: 'post',
        url: path + 'updateFile',
        params: {
          fileId: fileInfoData.fileId,
          fileName: fileInfoData.fileName,
          fileDesc: fileInfoData.fileDesc
        },
        needToken: needToken
      })
    }
  }
})()

let PlayList = (function () {
  var path = 'fileGroup/'
  var needToken = true
  return {
    addFileGroup: function (addData) {
      return httpPromise({
        method: 'post',
        url: path + 'addFileGroup',
        params: {
          posterGroupId: addData.posterGroupId,
          showLevel: addData.showLevel,
          showTime: addData.showTime,
          fileId: addData.fileId
        },
        needToken: needToken
      })
    },
    selectFile: function (current, selectPosterGroupId) {
      return httpPromise({
        method: 'post',
        url: path + 'selectFile',
        params: {
          pageNumber: current - 1,
          posterGroupId: selectPosterGroupId
        },
        needToken: needToken
      })
    },
    queryFileGroup: function (current) {
      return httpPromise({
        method: 'post',
        url: path + 'queryFileGroup',
        params: {
          pageNumber: current - 1
        },
        needToken: needToken
      })
    },
    queryRecId: function (recsId) {
      return httpPromise({
        method: 'post',
        url: path + 'queryRecId',
        params: {
          recsId: recsId
        },
        needToken: needToken
      })
    },
    deleteFileGroup: function (recsId) {
      return httpPromise({
        method: 'post',
        url: path + 'deleteFileGroup',
        params: {
          recsId: recsId
        },
        needToken: needToken
      })
    },
    updateFileGroup: function (fileGroupInfoData) {
      return httpPromise({
        method: 'post',
        url: path + 'updateFileGroup',
        params: {
          recsId: fileGroupInfoData.recsId,
          fileId: fileGroupInfoData.fileId,
          showLevel: fileGroupInfoData.showLevel,
          showTime: fileGroupInfoData.showTime,
          posterGroupId: fileGroupInfoData.posterGroupId
        },
        needToken: needToken
      })
    },
    changeShowTime: function (changeTimeData) {
      return httpPromise({
        method: 'post',
        url: path + 'changeShowTime',
        params: {
          recsId: changeTimeData.recsId,
          showTime: changeTimeData.showTime
        },
        needToken: needToken
      })
    },
    changeShowLevel: function (changeShowLevelData) {
      return httpPromise({
        method: 'post',
        url: path + 'changeShowLevel',
        params: {
          recsId: changeShowLevelData.recsId,
          showLevel: changeShowLevelData.showLevel
        },
        needToken: needToken
      })
    },
    changeFile: function (changeFileData) {
      return httpPromise({
        method: 'post',
        url: path + 'changeFile',
        params: {
          recsId: changeFileData.recsId,
          fileId: changeFileData.fileId
        },
        needToken: needToken
      })
    }
  }
})()

let DeviceGroup = (function () {
  var path = 'deviceGroup/'
  var needToken = true
  return {
    addGroup: function (addData) {
      return httpPromise({
        method: 'post',
        url: path + 'addGroup',
        params: {
          groupName: addData.groupName,
          groupDesc: addData.groupDesc
        },
        needToken: needToken
      })
    },
    queryGroupList: function (current) {
      return httpPromise({
        method: 'post',
        url: path + 'queryGroupList',
        params: {
          pageNumber: current - 1
        },
        needToken: needToken
      })
    },
    queryAllGroupList: function () {
      return httpPromise({
        method: 'post',
        url: path + 'deviceGroupList',
        params: {},
        needToken: needToken
      })
    },
    queryGroupInfo: function (groupId) {
      return httpPromise({
        method: 'post',
        url: path + 'queryGroupInfo',
        params: {
          groupId: groupId
        },
        needToken: needToken
      })
    },
    deleteGroup: function (groupId) {
      return httpPromise({
        method: 'post',
        url: path + 'deleteGroup',
        params: {
          groupId: groupId
        },
        needToken: needToken
      })
    },
    updateGroup: function (groupInfoData) {
      return httpPromise({
        method: 'post',
        url: path + 'updateGroup',
        params: {
          groupId: groupInfoData.groupId,
          updateTime: groupInfoData.updateTime,
          groupDesc: groupInfoData.groupDesc,
          groupName: groupInfoData.groupName
        },
        needToken: needToken
      })
    },
    changeWhetherToUpdate: function (changeStatusData) {
      return httpPromise({
        method: 'post',
        url: path + 'changeWhetherToUpdate',
        params: {
          groupId: changeStatusData.groupId,
          statusNumber: changeStatusData.statusNumber
        },
        needToken: needToken
      })
    }
  }
})()
let PosterGroup = (function () {
  var path = 'posterGroup/'
  var needToken = true
  return {
    addPosterGroup: function (addData) {
      return httpPromise({
        method: 'post',
        url: path + 'addPosterGroup',
        params: {
          groupName: addData.groupName,
          groupDesc: addData.groupDesc
        },
        needToken: needToken
      })
    },
    queryPosterGroupList: function (current) {
      return httpPromise({
        method: 'post',
        url: path + 'queryPosterGroupList',
        params: {
          pageNumber: current - 1
        },
        needToken: needToken
      })
    },
    queryAllPosterGroupList: function () {
      return httpPromise({
        method: 'post',
        url: path + 'posterGroupList',
        params: {},
        needToken: needToken
      })
    },
    queryPosterGroup: function (groupId) {
      return httpPromise({
        method: 'post',
        url: path + 'queryPosterGroup',
        params: {
          groupId: groupId
        },
        needToken: needToken
      })
    },
    deletePosterGroup: function (groupId) {
      return httpPromise({
        method: 'post',
        url: path + 'deletePosterGroup',
        params: {
          groupId: groupId
        },
        needToken: needToken
      })
    },
    updatePosterGroup: function (posterInfoData) {
      return httpPromise({
        method: 'post',
        url: path + 'updatePosterGroup',
        params: {
          groupId: posterInfoData.groupId,
          updateTime: posterInfoData.updateTime,
          groupDesc: posterInfoData.groupDesc,
          groupName: posterInfoData.groupName
        },
        needToken: needToken
      })
    }
  }
})()
export {Login}
export {Device}
export {File}
export {PlayList}
export {DeviceGroup}
export {PosterGroup}

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
    httpObject.options = {}
    httpObject.options.params = httpObject.params
    return $http[httpObject.method](httpObject.url, httpObject.options)
  }
}

