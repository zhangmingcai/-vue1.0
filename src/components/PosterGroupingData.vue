<template>
  <alert-group :alert-info="propMsg"></alert-group>

  <n3-modal title="添加分组" :show.sync="modal.addModalShow" :on-confirm="addPosterGroup" effect="fade" width="400px" >
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
  
  <n3-modal title="修改分组" :show.sync="modal.detailModalShow" :on-confirm="updatePosterGroup" effect="zoom" width="400px" >
    <div slot="body">
      <div class="input-group">
        <span>分组名称：</span>
        <input type="text" class="form-control" v-model="posterInfoData.groupName">
      </div>
      <div class="input-group">
        <span>分组备注：</span>
        <input type="text" class="form-control" v-model="posterInfoData.groupDesc">
      </div>
    </div>
  </n3-modal>

  <n3-modal title="删除分组" :show.sync="modal.deleteModalShow" :on-confirm="deletePosterGroup" effect="zoom" width="400px" >
    <div slot="body">
      <p class="lead">确定删除这个海报分组？</p>
    </div>
  </n3-modal>


  <div class="panel panel-default">
    <div class="panel-heading">海报分组管理</div>
    <div class="panel-body">
      <button type="button" class="btn btn-info btnForAdd"  @click="showAddModal">  添加分组
      </button>
      <table class="table-hover table table-bordered table-condensed table-striped">
        <thead>
          <tr>
            <th>海报组编号</th>
            <th>海报组名</th>
            <th>备注</th>         
            <th>添加时间</th>
            <th>版本号</th>
            <th>操作</th>   
          </tr>
        </thead>
        <tbody>
          <tr v-for="posterGroupingData in posterGroupingDatas">
            <td>
              {{posterGroupingData.groupId}}
            </td>
            <td>
              {{posterGroupingData.groupName}}
            </td>
            <td>
              {{posterGroupingData.groupDesc}}
            </td>
            <td>
              <span v-text="parseInt(posterGroupingData.addTime) | date 'YYYY-MM-DD hh:mm:ss'">
              </span>
            </td>
            <td>
              {{posterGroupingData.groupVersion}}
            </td>
            <td>
              <button type="button" class="btn btn-success" @click="queryPosterGroup(posterGroupingData.groupId)">修改
              </button>
              <button type="button" class="btn btn-danger" @click="showPosterDeleteModal($index)">删除
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="panel-footer">
      <n3-simple-pagination 
        :total="pagination.posterGroupNumber" 
        :current.sync="pagination.current" 
        :pagesize='15' 
        @click="queryPosterGroupList">
      </n3-simple-pagination>
    </div>
  </div>
</template>
<script>
  import {PosterGroup} from 'service/ApiService.js'
  export default {
    data: function () {
      return {
        posterGroupingDatas: [],
        posterInfoData: {},
        addData: {
          groupName: '',
          groupDesc: ''
        },
        opreateGroup: {},
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
        modal: {
          detailModalShow: false,
          addModalShow: false,
          deleteModalShow: false
        },
        pagination: {
          posterGroupNumber: 0,
          current: 0
        }
      }
    },
    ready: function () {
      this.queryPosterGroupList()
    },
    methods: {
      showAddModal: function () {
        this.addData.groupName = ''
        this.addData.groupDesc = ''
        this.modal.addModalShow = true
      },
      showPosterDeleteModal: function (index) {
        this.opreateGroup = this.posterGroupingDatas[index]
        this.modal.deleteModalShow = true
      },
      addPosterGroup: function () {
        PosterGroup.addPosterGroup(this.addData)
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
                  this.addData = {}
                  this.queryPosterGroupList()
                  this.modal.addModalShow = false
              }
            },
            (response) => {
              this.returnErro('addGroup失败啦')
            }
          )
      },
      queryPosterGroupList: function () {
        PosterGroup.queryPosterGroupList(this.pagination.current)
          .then(
            (res) => {
              switch (res.body.status) {
                case 0:
                  this.propMsg.danger.msg = res.body.msg
                  this.propMsg.danger.show = true
                  break
                case 1:
                  this.$set('posterGroupingDatas', res.body.groupList)
                  this.pagination.posterGroupNumber = res.body.posterGroupNumber
              }
            },
            (response) => {
              this.returnErro('queryGroupList失败啦')
            }
          )
      },
      queryPosterGroup: function (groupId) {
        PosterGroup.queryPosterGroup(groupId)
          .then(
            (res) => {
              switch (res.body.status) {
                case 0:
                  this.propMsg.danger.msg = res.body.msg
                  this.propMsg.danger.show = true
                  break
                case 1:
                  this.$set('posterInfoData', res.body.groupInfo)
                  this.modal.detailModalShow = true
              }
            },
            (response) => {
              this.returnErro('queryGroupInfo失败啦')
            }
          )
      },
      deletePosterGroup: function () {
        PosterGroup.deletePosterGroup(this.opreateGroup.groupId)
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
                  this.queryPosterGroupList()
                  this.modal.deleteModalShow = false
              }
            },
            (response) => {
              this.returnErro('deleteGroup失败啦')
            }
          )
      },
      updatePosterGroup: function () {
        PosterGroup.updatePosterGroup(this.posterInfoData)
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
                  this.queryPosterGroupList()
                  this.modal.detailModalShow = false
              }
            },
            (response) => {
              this.returnErro('updateGroup失败啦')
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