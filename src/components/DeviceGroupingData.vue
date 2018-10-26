<template>
  <alert-group :alert-info="propMsg"></alert-group>

  <n3-modal title="添加分组" :show.sync="modal.addModalShow" :on-confirm="addGroup" effect="fade" width="400px" >
    <div slot="body">
      <div class="input-group">
        <span>分组名称：</span>
        <input type="text" class="form-control" v-model="addData.groupName">
      </div>
      <div class="input-group">
        <span>分组备注：</span>
        <input type="text" class="form-control" v-model="addData.groupDesc">
      </div>
    </div>
  </n3-modal>

  <n3-modal title="修改分组" :show.sync="modal.detailShow" :on-confirm="updateGroup" effect="zoom" width="400px" >
    <div slot="body">
      <div class="input-group">
        <span>分组名称：</span>
        <input type="text" class="form-control" v-model="groupInfoData.groupName">
      </div>
      <div class="input-group">
        <span>分组备注：</span>
        <input type="text" class="form-control" v-model="groupInfoData.groupDesc">
      </div>
      <div class="input-group">
        <span>更新时间：</span>
        <div>{{timeValue.HH}}小时{{timeValue.mm}}分钟</div>
        <vue-timepicker 
          :time-value.sync="timeValue" 
          hide-clear-button>
        </vue-timepicker>
      </div>
    </div>
  </n3-modal>

  <n3-modal title="删除分组" :show.sync="modal.deleteModalShow" :on-confirm="deleteGroup"  effect="zoom" width="400px" >
    <div slot="body">
      <p class="lead">确定删除这个设备分组？</p>
    </div>
  </n3-modal>
  

  <div class="panel panel-default">
    <div class="panel-heading">设备分组管理</div>
    <div class="panel-body">
      <button type="button" class="btn btn-info btnForAdd"  @click="showAddModal">  添加分组
      </button>
      <table class="table-hover table table-bordered table-condensed table-striped">
        <thead>
          <tr>
            <th>设备组编号</th>
            <th>设备组名</th>
            <th>备注</th> 
            <th>是否自动更新</th>        
            <th>更新时间</th> 
            <th>添加时间</th>
            <th>操作</th>     
          </tr>
        </thead>
        <tbody>
          <tr v-for="deviceGroupingData in deviceGroupingDatas">
            <td>
              {{deviceGroupingData.groupId}}
            </td>
            <td>
              {{deviceGroupingData.groupName}}
            </td>
            <td>
              {{deviceGroupingData.groupDesc}}
            </td>
            <td>
              <n3-switch 
                :value="deviceGroupingData.whetherToUpdate == 0 ? false : true" ontext="是" 
                offtext="否" 
                @click="changeWhetherToUpdate(deviceGroupingData.groupId, deviceGroupingData.whetherToUpdate)">
              </n3-switch>
            </td>
            <td>
              <div>
                {{
                  parseInt(deviceGroupingData.updateTime / 60) > = 10 
                  ? parseInt(deviceGroupingData.updateTime / 60)
                  : '0' + parseInt(deviceGroupingData.updateTime / 60)
                }}
                :
                {{
                  (deviceGroupingData.updateTime % 60) > = 10 
                  ? deviceGroupingData.updateTime % 60  
                  : '0' + deviceGroupingData.updateTime % 60
                }}
              </div>
            </td>
            <td>
              <span v-text="parseInt(deviceGroupingData.addTime) | date 'YYYY-MM-DD hh:mm:ss'">
              </span>
            </td>
            <td>
              <button type="button" class="btn btn-success" @click="queryGroupInfo(deviceGroupingData.groupId)">修改
              </button>
              <button type="button" class="btn btn-danger" @click="showDeleteModal($index)">删除
              </button>
            </td> 
          </tr>
        </tbody>
      </table>
    </div>
    <div class="panel-footer">
      <n3-simple-pagination 
        :total="pagination.deviceGroupNumber" 
        :current.sync="pagination.current" 
        :pagesize='15' 
        @click="queryGroupList">
      </n3-simple-pagination>
    </div>
  </div> 
</template>
<script>
  import {DeviceGroup} from 'service/ApiService.js'
  import VueTimepicker from 'vue-time-picker'
  export default {
    data: function () {
      return {
        deviceGroupingDatas: [],
        groupInfoData: {},
        addData: {},
        opreateGroup: {},
        changeStatusData: {},
        timeValue: {
          HH: '00',
          mm: '00'
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
        },
        pagination: {
          deviceGroupNumber: 0,
          current: 0
        },
        modal: {
          detailShow: false,
          addModalShow: false,
          deleteModalShow: false
        }
      }
    },
    components: {VueTimepicker},
    ready: function () {
      this.queryGroupList()
    },
    methods: {
      showAddModal: function () {
        this.addData = {}
        this.modal.addModalShow = true
      },
      showDeleteModal: function (index) {
        this.opreateGroup = this.deviceGroupingDatas[index]
        this.modal.deleteModalShow = true
      },
      addGroup: function () {
        DeviceGroup.addGroup(this.addData)
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
                  this.queryGroupList()
                  this.modal.addModalShow = false
              }
            },
            (response) => {
              this.returnErro('addGroup失败啦')
            }
          )
      },
      queryGroupList: function () {
        DeviceGroup.queryGroupList(this.pagination.current)
          .then(
            (res) => {
              switch (res.body.status) {
                case 0:
                  this.propMsg.danger.msg = res.body.msg
                  this.propMsg.danger.show = true
                  break
                case 1:
                  this.$set('deviceGroupingDatas', res.body.groupList)
                  this.pagination.deviceGroupNumber = res.body.deviceGroupNumber
              }
            },
            (response) => {
              this.returnErro('deviceGrouping失败啦')
            }
          )
      },
      queryGroupInfo: function (groupId) {
        DeviceGroup.queryGroupInfo(groupId)
          .then(
            (res) => {
              switch (res.body.status) {
                case 0:
                  this.propMsg.danger.msg = res.body.msg
                  this.propMsg.danger.show = true
                  break
                case 1:
                  this.$set('groupInfoData', res.body.groupInfo)
                  this.modal.detailShow = true
                  this.timeValue.HH = Math.floor(this.groupInfoData.updateTime / 60)
                  this.timeValue.mm = this.groupInfoData.updateTime % 60
              }
            },
            (response) => {
              this.returnErro('queryGroupInfo失败啦')
            }
          )
      },
      deleteGroup: function () {
        DeviceGroup.deleteGroup(this.opreateGroup.groupId)
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
                  this.queryGroupList()
                  this.modal.deleteModalShow = false
              }
            },
            (response) => {
              this.returnErro('deleteGroup失败啦')
            }
          )
      },
      updateGroup: function () {
        this.groupInfoData.updateTime = parseInt(this.timeValue.HH) * 60 + parseInt(this.timeValue.mm)
        DeviceGroup.updateGroup(this.groupInfoData)
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
                  this.queryGroupList()
                  this.modal.detailShow = false
              }
            },
            (response) => {
              this.returnErro('updateGroup失败啦')
            }
          )
      },
      changeWhetherToUpdate: function (groupId, whetherToUpdate) {
        this.changeStatusData.statusNumber = whetherToUpdate === 0 ? 1 : 0
        this.changeStatusData.groupId = groupId
        DeviceGroup.changeWhetherToUpdate(this.changeStatusData)
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
                  this.queryGroupList()
              }
            },
            (response) => {
              this.returnErro('changeWhetherToUpdate失败啦')
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