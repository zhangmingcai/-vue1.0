<template>
  <alert-group :alert-info="propMsg"></alert-group>

  <n3-modal title="修改文件" :show.sync="modal.detailShow" :on-confirm="updateFile" effect="zoom" width="400px" >
    <div slot="body">
      <div class="input-group">
        <span>文件名称：</span>
        <input type="text" class="form-control" v-model="fileInfoData.fileName | base64">
      </div>
      <div class="input-group">
        <span>文件备注：</span>
        <input type="text" class="form-control" v-model="fileInfoData.fileDesc">
      </div>
      <div class="input-group">
        <span>文件编号：</span>
        <input type="text" class="form-control" :value.once="fileInfoData.fileId" readonly>
      </div>
      <div class="input-group">
        <span>文件类型：</span>
        <input type="text" class="form-control" :value.once="fileInfoData.fileType" readonly>
      </div>
      <div class="input-group">
        <span>添加时间：</span>
        <input 
          type="text" 
          class="form-control" 
          :value.once="parseInt(fileInfoData.addTime) | date 'YYYY-MM-DD hh:mm:ss'" 
          readonly>
      </div>
    </div>
  </n3-modal>

  <n3-modal title="删除分组" :show.sync="modal.deleteModalShow" :on-confirm="deleteFile"  effect="zoom" width="400px" >
    <div slot="body">
      <p class="lead">确定删除这个文件？</p>
    </div>
  </n3-modal>

  <n3-modal title="添加文件" :show.sync="modal.addModalShow" width="350px" effect="fade" 
  :on-confirm="addFile">
    <div slot="header">
      <n3-step 
        :labels="['第一步 上传文件','第二步 上传备注']" 
        :current="step" >
      </n3-step>
    </div>
    <div slot="body">
      <div v-show="step==1">
        <Upload
            :multiple="false"
            type="drag"
            :max-size="51200"
            :on-success="getUploadFileData"
            action="http://poster.tustcs.com/api/file/uploadFile">
            <div style="padding: 20px 0">
                <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                <p>点击或将文件拖拽到这里上传</p>
            </div>
        </Upload>
        
      </div>
      <div v-show="step==2">
        <div class="input-group">
          <span>文件备注：</span>
          <input type="text" class="form-control" v-model="upLoadFileData.fileDesc">
        </div>
      </div>
    </div>
    <div slot="footer">
      <div v-show="step == 1">
        <n3-button  @click="modal.addModalShow = false">取消</n3-button>
        <n3-button type="primary" @click="step = 2" :disabled="ifDisabled">
          下一步
        </n3-button>
      </div>
      <div v-show="step == 2">
        <n3-button  @click="step = 1">上一步</n3-button>
        <n3-button type="primary" @click="addFile">添加</n3-button>
      </div>
    </div>
  </n3-modal>

  <n3-modal :show.sync="previewData.previewModalShow" width="350px" title="文件预览" effect="fade" :on-confirm="">
    <div slot="body">
      <img :src.once="previewData.previewSrc" v-show="previewData.previewImgShow" class="img-responsive modalImg">
      <video-player 
        v-ref:video 
        v-show="previewData.previewVideoShow" 
        :options="videoOptions">
      </video-player>
    </div>
    <div slot="footer"></div>
  </n3-modal>
  

  <div class="panel panel-primary">
    <div class="panel-heading">文件管理</div>
    <div class="panel-body">
      <button type="button" class="btn btn-info btnForAdd"  @click="showAddModal">  添加文件
      </button>
      <table class="table table-hover table table-bordered table-condensed table-striped">
        <thead>
          <tr>
            <th>文件编号</th>
            <th>文件名称</th>      
            <th>文件备注</th>
            <th>文件类型</th> 
            <th>添加时间</th>
            <th>操作</th>     
          </tr>
        </thead>
        <tbody>
          <tr v-for="fileManageData in fileManageDatas">
            <td>
              {{fileManageData.fileId}}
            </td>
            <td>
              {{fileManageData.fileName | base64}}
              <button type="button" class="btn btn-info previewBtn" @click="preview(fileManageData.url,fileManageData.fileType)">预览
              </button>
            </td>
            <td>
              {{fileManageData.fileDesc}}
            </td>
            <td>
              {{fileManageData.fileType}}
            </td>
            <td>
              <span v-text="parseInt(fileManageData.addTime) | date 'YYYY-MM-DD hh:mm:ss'">
              </span>
            </td>
            <td>
              <button type="button" class="btn btn-success" @click="queryFileInfo(fileManageData.fileId)">修改
              </button>
              <button type="button" class="btn btn-danger" @click="showDeleteModal($index)">删除
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <div class="panel-footer">
    <n3-simple-pagination 
      :total="pagination.fileNumber" 
      :current.sync="pagination.current" 
      :pagesize='15' 
      @click="queryFileList">
    </n3-simple-pagination>
  </div>
</template>
<script>
  import {encode} from '../filters.js'
  import {File} from 'service/ApiService.js'
  export default {
    data: function () {
      return {
        fileManageDatas: [],
        fileInfoData: {},
        opreateFile: {},
        upLoadFileData: {
          fileDesc: '',
          fileKey: '',
          fileName: ''
        },
        videoOptions: {
          source: {
            type: '',
            src: ''
          }
        },
        previewData: {
          previewSrc: '',
          previewModalShow: false,
          previewImgShow: false,
          previewVideoShow: false
        },
        modal: {
          detailShow: false,
          addModalShow: false,
          deleteModalShow: false
        },
        pagination: {
          fileNumber: 0,
          current: 0
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
        step: 1,
        ifDisabled: true
      }
    },
    ready: function () {
      this.queryFileList()
    },
    watch: {
      'previewData.previewModalShow': function (val) {
        if (val === false) {
          if (this.$refs.video.player !== undefined) {
            this.$refs.video.player.pause()
          } else {
          }
        }
      }
    },
    methods: {
      showAddModal: function () {
        this.step = 1
        this.modal.addModalShow = true
        this.ifDisabled = true
      },
      showDeleteModal: function (index) {
        this.opreateFile = this.fileManageDatas[index]
        this.modal.deleteModalShow = true
      },
      preview: function (url, type) {
        this.previewData.previewModalShow = true
        if (type === 'mp4' || type === 'flv' || type === 'm3u8' || type === 'mov' || type === 'webm' || type === 'mp3' || type === 'ogg' || type === 'm4v') {
          this.videoOptions.source.src = url
          this.videoOptions.source.type = 'video/' + type
          this.previewData.previewImgShow = false
          this.previewData.previewVideoShow = true
        } else {
          this.previewData.previewSrc = url
          this.previewData.previewImgShow = true
          this.previewData.previewVideoShow = false
        }
      },
      addFile: function () {
        File.addFile(this.upLoadFileData)
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
                  this.queryFileList()
                  this.modal.addModalShow = false
              }
            },
            (response) => {
              this.returnErro('addFile失败啦')
            }
          )
      },
      srarchFileList: function () {
        this.pagination.current = 1
        File.srarchFileList(this.inputName, this.pagination.current)
          .then(
            (res) => {
              switch (res.body.status) {
                case 0:
                  this.propMsg.danger.msg = res.body.msg
                  this.propMsg.danger.show = true
                  break
                case 1:
                  this.$set('fileManageDatas', res.body.srarchFileList)
                  this.pagination.fileNumber = res.body.fileNumber
              }
            },
            (response) => {
              this.returnErro('queryFileList失败啦')
            }
          )
      },
      queryFileList: function () {
        File.queryFileList(this.pagination.current)
          .then(
            (res) => {
              switch (res.body.status) {
                case 0:
                  this.propMsg.danger.msg = res.body.msg
                  this.propMsg.danger.show = true
                  break
                case 1:
                  this.$set('fileManageDatas', res.body.fileList)
                  this.pagination.fileNumber = res.body.fileNumber
              }
            },
            (response) => {
              this.returnErro('queryFileList失败啦')
            }
          )
      },
      queryFileInfo: function (fileId) {
        File.queryFileInfo(fileId)
          .then(
            (res) => {
              switch (res.body.status) {
                case 0:
                  this.propMsg.danger.msg = res.body.msg
                  this.propMsg.danger.show = true
                  break
                case 1:
                  this.$set('fileInfoData', res.body.fileInfo)
                  this.modal.detailShow = true
              }
            },
            (response) => {
              this.returnErro('queryFileInfo失败啦')
            }
          )
      },
      deleteFile: function () {
        File.deleteFile(this.opreateFile.fileId)
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
                  this.queryFileList()
                  this.modal.deleteModalShow = false
              }
            },
            (response) => {
              this.returnErro('deleteFile失败啦')
            }
          )
      },
      updateFile: function () {
        File.updateFile(this.fileInfoData)
          .then(
            (res) => {
              var status = parseInt(res.body.status)
              switch (status) {
                case 0:
                  this.propMsg.danger.msg = res.body.msg
                  this.propMsg.danger.show = true
                  break
                case 1:
                  this.propMsg.success.msg = res.body.msg
                  this.propMsg.success.show = true
                  this.queryFileList()
                  this.modal.detailShow = false
                  break
              }
            },
            (response) => {
              this.returnErro('updateFile失败啦')
            }
          )
      },
      getUploadFileData: function (data) {
        window.alert(666)
        this.upLoadFileData.fileName = encode(data.fileName)
        this.upLoadFileData.fileKey = data.fileKey
        this.ifDisabled = false
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
  .previewBtn{
    float: right;
  }
</style>
