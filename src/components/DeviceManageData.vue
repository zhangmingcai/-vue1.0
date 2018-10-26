<template>
  <alert-group :alert-info="propMsg"></alert-group>
  <n3-modal title="添加设备" :show.sync="modal.addModalShow" :on-confirm="addDevice" effect="fade" width="400px" >
    <div slot="body">
      <div class="input-group">
        <span>设备名称：</span>
        <input type="text" class="form-control" v-model="addData.deviceName">
      </div>
      <div class="input-group">
        <span>设备号：</span>
        <input type="text" class="form-control" v-model="addData.deviceToken">
      </div>
      <div class="input-group">
        <span>设备分组编号：</span>
        <input type="text" class="form-control" v-model="addData.deviceGroupId">
      </div>
      <div class="input-group">
        <span>海报分组编号：</span>
        <input type="text" class="form-control" v-model="addData.posterGroupId">
      </div>
    </div>
  </n3-modal>

  <n3-modal title="修改分组" :show.sync="modal.detailShow" :on-confirm="updateDevice" effect="zoom" width="400px" >
    <div slot="body">
      <div class="input-group">
        <span>设备的名称：</span>
        <input type="text" class="form-control" v-model="deviceInfoData.deviceName">
      </div>
      <div class="input-group">
        <span>物理地址名称：</span>
        <input type="text" class="form-control" v-model="deviceInfoData.deviceToken">
      </div>
      <div class="input-group">
        <span>设备分组名称：</span>
        <select class="form-control" v-model="deviceInfoData.deviceGroupId">
          <option value="-1">请选择设备分组</option>
          <option 
            v-for="deviceGroupingData in deviceGroupingDatas"
            :value="deviceGroupingData.groupId">{{deviceGroupingData.groupName}}
          </option>
        </select>
      </div>
      <div class="input-group">
        <span>海报分组名称：</span>
        <select class="form-control" v-model="deviceInfoData.posterGroupId">
          <option value="-1">请选择海报分组</option>
          <option 
            v-for="posterGroupingData in posterGroupingDatas"
            :value="posterGroupingData.groupId">{{posterGroupingData.groupName}}
          </option>
        </select>
      </div>
    </div>
  </n3-modal>

  <n3-modal title="修改物理地址" :show.sync="modal.changeTokenShow" :on-confirm="updateDeviceToken" effect="zoom" width="400px" >
    <div slot="body">
      <div class="input-group">
        <span>物理地址名称：</span>
        <input type="text" class="form-control" v-model="deviceTokenData.deviceToken">
      </div>
    </div>
  </n3-modal>

  <n3-modal title="删除分组" :show.sync="modal.deleteModalShow" :on-confirm="deleteDevice"  effect="zoom" width="400px" >
    <div slot="body">
      <p class="lead">确定删除这个设备？</p>
    </div>
  </n3-modal>


  <form class="form-inline select-search">
    <label>设备分组名称：</label>
    <select class="form-control" v-model="searchInput.selectDgId">
      <option value='0'>查询全部设备分组</option>
      <option 
        v-for="deviceGroupingData in deviceGroupingDatas"
        :value="deviceGroupingData.groupId">{{deviceGroupingData.groupName}}
      </option>
    </select>
    <label class="reset-marging">海报分组名称：</label>
    <select class="form-control" v-model="searchInput.selectPgId">
      <option value='0' >查询全部海报分组</option>
      <option 
        v-for="posterGroupingData in posterGroupingDatas"
        :value="posterGroupingData.groupId">{{posterGroupingData.groupName}}
      </option>
    </select>
    <button class="btn btn-info" type="button" @click="querySelectDeviceList">
      <n3-icon type="search"></n3-icon>
    </button>
  </form>

  <div class="panel panel-primary">
    <div class="panel-heading">设备管理</div>
    <div class="panel-body">
      <div class="search-inline">
        <input type="text" class="form-control" placeholder="输入设备名称" v-model="searchInput.inputName">
      </div>
      <div class="search-inline">
        <button class="btn btn-info" @click="searchDeviceList">
          <n3-icon type="search"></n3-icon>
        </button>
      </div>
      <table class="table table-hover table table-bordered table-condensed table-striped">
        <thead>
          <tr>
            <th>设备编号</th>
            <th>设备名称</th>  
            <th>物理地址</th> 
            <th>设备状态</th>   
            <th>设备分组名称</th>
            <th>海报分组名称</th> 
            <th>最后在线时间</th>
            <th>最后更新时间</th> 
            <th>操作</th>     
          </tr>
        </thead>
        <tbody>
          <tr v-for="deviceManageData in deviceManageDatas">
            <td>
              {{deviceManageData.deviceId}}
            </td>
            <td>
              {{deviceManageData.deviceName}}
            </td>
            <td>
              {{deviceManageData.deviceToken}}
              <button 
                type="button" 
                class="btn btn-success changeTokenBtn" 
                @click="showChangeTokenModal(deviceManageData.deviceId, deviceManageData.deviceToken)">修改
              </button>
            </td>
            <td>
              {{deviceManageData.deviceStatus == 0 ? '离线' : '在线'}}
            </td>
            <td>
              {{deviceManageData.deviceGroupName}}
            </td>
            <td>
              {{deviceManageData.posterGroupName}}
            </td>
            <td>
              <span v-text="parseInt(deviceManageData.lastOnlineTime) | date 'YYYY-MM-DD hh:mm:ss'">
              </span>
            </td>
            <td>
              <span v-text="parseInt(deviceManageData.lastUpdateTime) | date 'YYYY-MM-DD hh:mm:ss'">
              </span>
            </td>
            <td>
              <button type="button" class="btn btn-success" @click="queryDeviceInfo(deviceManageData.deviceId)">修改
              </button>
              <button type="button" class="btn btn-danger" @click="showDeleteModal($index)">删除
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="panel-footer" v-show="pagination.loadDeviceList">
      <n3-simple-pagination 
        :total="pagination.deviceNumber" 
        :current.sync="current.loadDeviceList" 
        :pagesize='15' 
        @click="queryDeviceList">
      </n3-simple-pagination>
    </div>
    <div class="panel-footer" v-show="pagination.searchDeviceList">
      <n3-simple-pagination 
        :total="pagination.searchDeviceNumber" 
        :current.sync="current.searchDeviceList" 
        :pagesize='15' 
        @click="searchDeviceList">
      </n3-simple-pagination>
    </div>
  </div>
</template>
<script>
  import {Device, DeviceGroup, PosterGroup} from 'service/ApiService.js'
  export default {
    data: function () {
      return {
        deviceGroupingDatas: [],
        posterGroupingDatas: [],
        deviceManageDatas: [],
        deviceInfoData: {},
        deviceTokenData: {
          deviceToken: ''
        },
        addData: {},
        opreateDevice: {},
        searchInput: {
          inputName: '',
          selectPgId: 0,
          selectDgId: 0
        },
        modal: {
          detailShow: false,
          addModalShow: false,
          deleteModalShow: false,
          changeTokenShow: false
        },
        pagination: {
          deviceNumber: 0,
          loadDeviceList: true,
          searchDeviceNumber: 0,
          searchDeviceList: false
        },
        current: {
          loadDeviceList: 0,
          searchDeviceList: 0,
          searchSelectDeviceList: 0
        },
        propMsg: {
          success: {
            show: false,
            msg: ''
          },
          danger: {
            show: false,
            msg: ''
          }
        }
      }
    },
    ready: function () {
      this.queryAllGroupList()
      this.queryDeviceList()
      this.queryAllPosterGroupList()
    },
    methods: {
      showAddModal: function () {
        this.addData = {}
        this.modal.addModalShow = true
      },
      showDeleteModal: function (index) {
        this.opreateDevice = this.deviceManageDatas[index]
        this.modal.deleteModalShow = true
      },
      showChangeTokenModal: function (deviceId, deviceToken) {
        this.deviceTokenData.deviceId = deviceId
        this.deviceTokenData.deviceToken = deviceToken
        this.modal.changeTokenShow = true
      },
      queryGroupList: function () {
        DeviceGroup.queryGroupList(this.current.loadDeviceGroupList)
          .then(
            (res) => {
              switch (res.body.status) {
                case 0:
                  this.propMsg.danger.msg = res.body.msg
                  this.propMsg.danger.show = true
                  break
                case 1:
                  this.$set('deviceGroupingDatas', res.body.groupList)
              }
            },
            (response) => {
              this.returnErro('deviceGrouping失败啦')
            }
          )
      },
      queryPosterGroupList: function () {
        PosterGroup.queryPosterGroupList(this.current.loadPosterGroupList)
          .then(
            (res) => {
              switch (res.body.status) {
                case 0:
                  this.propMsg.danger.msg = res.body.msg
                  this.propMsg.danger.show = true
                  break
                case 1:
                  this.$set('posterGroupingDatas', res.body.groupList)
              }
            },
            (response) => {
              this.returnErro('queryGroupList失败啦')
            }
          )
      },
      queryAllPosterGroupList: function () {
        PosterGroup.queryAllPosterGroupList()
          .then(
            (res) => {
              switch (res.body.status) {
                case 0:
                  this.propMsg.danger.msg = res.body.msg
                  this.propMsg.danger.show = true
                  break
                case 1:
                  this.$set('posterGroupingDatas', res.body.posterGroupList)
              }
            },
            (response) => {
              this.returnErro('queryAllPosterGroupList失败啦')
            }
          )
      },
      queryAllGroupList: function () {
        DeviceGroup.queryAllGroupList()
          .then(
            (res) => {
              switch (res.body.status) {
                case 0:
                  this.propMsg.danger.msg = res.body.msg
                  this.propMsg.danger.show = true
                  break
                case 1:
                  this.$set('deviceGroupingDatas', res.body.deviceGroupList)
              }
            },
            (response) => {
              this.returnErro('queryAllDeviceGroupList失败啦')
            }
          )
      },
      queryDeviceList: function () {
        Device.queryDeviceList(this.current.loadDeviceList)
          .then(
            (res) => {
              switch (res.body.status) {
                case 0:
                  this.propMsg.danger.msg = res.body.msg
                  this.propMsg.danger.show = true
                  break
                case 1:
                  this.$set('deviceManageDatas', res.body.deviceList)
                  this.pagination.deviceNumber = res.body.deviceNumber
              }
            },
            (response) => {
              this.returnErro('queryDeviceList失败啦')
            }
          )
      },
      querySelectDeviceList: function () {
        Device.querySelectDeviceList(this.current.searchSelectDeviceList, this.searchInput.selectPgId, this.searchInput.selectDgId)
          .then(
            (res) => {
              switch (res.body.status) {
                case 0:
                  this.propMsg.danger.msg = res.body.msg
                  this.propMsg.danger.show = true
                  break
                case 1:
                  this.$set('deviceManageDatas', res.body.deviceList)
                  this.pagination.deviceNumber = res.body.deviceNumber
              }
            },
            (response) => {
              this.returnErro('querySelectDeviceList失败啦')
            }
          )
      },
      searchDeviceList: function () {
        if (this.searchInput.inputName === '') {
          this.returnErro('请输入搜索关键字！！')
          return 0
        } else {
          Device.searchDeviceList(this.searchInput.inputName, this.current.searchDeviceList)
            .then(
              (res) => {
                switch (res.body.status) {
                  case 0:
                    this.propMsg.danger.msg = res.body.msg
                    this.propMsg.danger.show = true
                    break
                  case 1:
                    this.$set('deviceManageDatas', res.body.searchDeviceList)
                    this.pagination.searchDeviceNumber = res.body.deviceNumber
                    this.pagination.searchDeviceList = true
                    this.pagination.loadDeviceList = false
                }
              },
              (response) => {
                this.returnErro('searchDeviceList失败啦')
              }
            )
        }
      },
      queryDeviceInfo: function (deviceId) {
        Device.queryDeviceInfo(deviceId)
          .then(
            (res) => {
              switch (res.body.status) {
                case 0:
                  this.propMsg.danger.msg = res.body.msg
                  this.propMsg.danger.show = true
                  break
                case 1:
                  this.$set('deviceInfoData', res.body.queryDeviceInfo)
                  this.modal.detailShow = true
              }
            },
            (response) => {
              this.returnErro('queryDeviceInfo失败啦')
            }
          )
      },
      addDevice: function () {
        Device.addDevice(this.addData)
          .then(
            (res) => {
              switch (res.body.status) {
                case 0:
                  this.propMsg.danger.msg = res.body.msg
                  this.propMsg.danger.show = true
                  break
                case 1:
                  this.propMsg.success.msg = res.body.msg
                  this.propMsg.success.show = true
                  this.queryDeviceList()
                  this.modal.addModalShow = false
              }
            },
            (response) => {
              this.returnErro('queryDeviceInfo失败啦')
            }
          )
      },
      deleteDevice: function () {
        Device.deleteDevice(this.opreateDevice.deviceId)
          .then(
            (res) => {
              switch (res.body.status) {
                case 0:
                  this.propMsg.danger.msg = res.body.msg
                  this.propMsg.danger.show = true
                  break
                case 1:
                  this.propMsg.success.msg = res.body.msg
                  this.propMsg.success.show = true
                  this.queryDeviceList()
                  this.modal.deleteModalShow = false
              }
            },
            (response) => {
              this.returnErro('deleteDevice失败啦')
            }
          )
      },
      updateDevice: function () {
        Device.updateDevice(this.deviceInfoData)
          .then(
            (res) => {
              switch (res.body.status) {
                case 0:
                  this.propMsg.danger.msg = res.body.msg
                  this.propMsg.danger.show = true
                  break
                case 1:
                  this.propMsg.success.msg = res.body.msg
                  this.propMsg.success.show = true
                  this.queryDeviceList()
                  this.modal.detailShow = false
              }
            },
            (response) => {
              this.returnErro('updateDevice失败啦')
            }
          )
      },
      updateDeviceToken: function () {
        Device.updateDeviceToken(this.deviceTokenData)
          .then(
            (res) => {
              switch (res.body.status) {
                case 0:
                  this.propMsg.danger.msg = res.body.msg
                  this.propMsg.danger.show = true
                  break
                case 1:
                  this.propMsg.success.msg = res.body.msg
                  this.propMsg.success.show = true
                  this.queryDeviceList()
                  this.modal.changeTokenShow = false
              }
            },
            (response) => {
              this.returnErro('updateDeviceToken失败啦')
            }
          )
      },
      returnErro: function (erroMessage) {
        this.n3Toast({
          text: erroMessage,
          type: 'danger',
          placement: 'top'
        })
      }
    }
  }
</script>
<style type="text/css" scoped>
  .search-inline{
    display: inline-block;
    margin-bottom:10px;
  }
  .btnForAdd{
  margin-right: 25px; 
  }
  .reset-marging{
    margin-left: 50px;
  }
  .changeTokenBtn{
    float: right;
  }
</style>