<template>
  <alert-group :alert-info="propMsg"></alert-group>

  <n3-modal title="添加播放列表" :show.sync="modal.addModalShow" width="400px" effect="fade">
    <div slot="header">
      <n3-step 
        :labels="['第一步 上传海报','第二步 上传详细信息']" 
        :current="selectForAdd.step" >
      </n3-step>
    </div>
    <div slot="body">
      <div v-show="selectForAdd.step == 1">
        <select 
          v-show="selectForAdd.selectFileId != 0" 
          v-model="selectForAdd.selectFileId" 
          style="width:300px">
            <option value="-1">
              上传或者选择一个文件...
            </option>
            <option 
              v-for="fileManageData in fileManageDatas"
              :value="fileManageData.fileId">{{fileManageData.fileName | base64}}
            </option>
        </select>
        <n3-uploader 
          v-show="selectForAdd.selectFileId == -1" 
          url="http://test.youyicloud.com/Poster/api/file/uploadFile" 
          type="drag" 
          :on-success="getUploadFileData" 
          :multiple="false" 
          name="file">
        </n3-uploader>
        <div v-show="selectForAdd.showAddDesc == true && selectForAdd.selectFileId < 1">
          <div class="input-group">
            <span>海报备注：</span>
            <input 
              type="text" 
              class="form-control" 
              v-model="addFileData.fileDesc">
          </div>
        </div>
        <div v-show="selectForAdd.selectFileId > 0" style="width:300px">
          <img 
            :src="previewData.addImgSrc" 
            v-show="previewData.addImgShow" 
            class="img-responsive modalImg">
          <video-player 
            v-ref:addvideo 
            v-show="previewData.addVideoShow" 
            :options="addVideoOptions">
          </video-player>
        </div>
      </div>
      <div v-show="selectForAdd.step == 2">
        <div class="input-group">
          <span>海报分组选择：</span>
          <select class="form-control" v-model="addPosterGroupId">
            <option value="-1">请选择海报分组</option>
            <option v-for="posterGroupingData in posterGroupingDatas"
              :value="posterGroupingData.groupId">{{posterGroupingData.groupName}}
            </option>
          </select>
        </div>
        <div class="input-group">
          <span>播放优先级</span>
          <input type="text" class="form-control" v-model="addFileGroupData.showLevel">
        </div>
        <div class="input-group">
          <span>播放时间：</span>
          <input type="text" class="form-control" v-model="addFileGroupData.showTime">
        </div>
      </div>
    </div>
    <div slot="footer">
      <div v-show="selectForAdd.step == 1">
        <n3-button  @click="modal.addModalShow = false">取消</n3-button>
        <n3-button 
          type="primary" 
          @click="nextToDo" 
          :disabled="selectForAdd.ifDisabled">
          下一步
        </n3-button> 
      </div>
      <div v-show="selectForAdd.step == 2">
        <n3-button  @click="selectForAdd.step = 1">上一步</n3-button>
        <n3-button type="primary" @click="addFileGroup">添加</n3-button>
      </div>
    </div>
  </n3-modal>

  <n3-modal title="更换文件" :show.sync="modal.updateFileModalShow" width="400px" effect="fade">
    <div slot="header">
      <div v-show="selectForUpdate.selectUpdateFileId < 1">
        <n3-step 
          :labels="['第一步 上传文件','第二步 上传文件备注']" 
          :current="selectForUpdate.stepForUpdateFile" >
        </n3-step>
      </div>
      <div v-show="selectForUpdate.selectUpdateFileId > 0">选择文件</div>
    </div>
    <div slot="body">
        <select v-model="selectForUpdate.selectUpdateFileId" style="width:300px">
          <option value="-1" >上传或者选择一个文件...</option>
          <option 
            v-for="fileManageData in fileManageDatas"
            :value="fileManageData.fileId">{{fileManageData.fileName | base64}}
          </option>
        </select>
        <n3-uploader 
          v-show="selectForUpdate.stepForUpdateFile == 1 && selectForUpdate.selectUpdateFileId < 1" 
          url="http://test.youyicloud.com/Poster/api/file/uploadFile" 
          type="drag" 
          :on-success="getUploadFileData" 
          :multiple="false" 
          name="file">
        </n3-uploader>
        <div v-show="selectForUpdate.selectUpdateFileId > 0" style="width:300px">
          <img 
            :src="previewData.updateImgSrc" 
            v-show="previewData.updateImgShow" 
            class="img-responsive modalImg">
          <video-player 
            v-ref:updatevideo 
            v-show="previewData.updateVideoShow" 
            :options="updateVideoOptions">
          </video-player>
        </div>
        <div v-show="selectForUpdate.stepForUpdateFile == 2 && selectForUpdate.selectUpdateFileId == 0">
          <div class="input-group">
            <span>海报备注：</span>
            <input type="text" class="form-control" v-model="addFileData.fileDesc">
          </div>
        </div>
      </div>
    </div>
    <div slot="footer">
      <div v-show="selectForUpdate.selectUpdateFileId < 1">
        <div v-show="selectForUpdate.stepForUpdateFile == 1">
          <n3-button @click="modal.updateFileModalShow = false">取消</n3-button>
          <n3-button 
            type="primary" 
            @click="nextDo" 
            :disabled="selectForUpdate.ifDisabled">
            下一步
          </n3-button>
        </div>
        <div v-show="selectForUpdate.stepForUpdateFile == 2">
          <n3-button  @click="backDo">上一步</n3-button>
          <n3-button type="primary" @click="addFileAndUpdate">更换</n3-button>
        </div>
      </div>
      <div v-show="selectForUpdate.selectUpdateFileId > 0">
        <n3-button  @click="modal.updateFileModalShow = false">取消</n3-button>
        <n3-button type="primary" @click="updateFile">更换</n3-button>
      </div>
    </div>
  </n3-modal>

  <n3-modal title="修改分组" :show.sync="modal.detailShow" :on-confirm="updateFileGroup" effect="zoom" width="400px" >
    <div slot="body">
      <div class="input-group">
        <span>海报分组名称：</span>
        <select class="form-control" v-model="fileGroupInfoData.posterGroupId">
          <option value="-1">请选择海报分组</option>
          <option 
            v-for="posterGroupingData in posterGroupingDatas"
            :value="posterGroupingData.groupId">{{posterGroupingData.groupName}}
          </option>
        </select>
      </div>
      <div class="input-group">
        <span>播放优先级</span>
        <input type="text" class="form-control" v-model="fileGroupInfoData.showLevel">
      </div>
      <div class="input-group">
        <span>播放时间：</span>
        <input type="text" class="form-control" v-model="fileGroupInfoData.showTime">
        <span>（秒）</span>
      </div>
    </div>
  </n3-modal>

  <n3-modal title="修改播放优先级" :show.sync="modal.changeShowLevelModalShow" :on-confirm="changeShowLevel" effect="zoom" width="400px" >
    <div slot="body">
      <div class="input-group">
        <span>播放优先级：</span>
        <input type="text" class="form-control" v-model="changeShowLevelData.showLevel">
      </div>
    </div>
  </n3-modal>

  <n3-modal title="修改播放时间" :show.sync="modal.changeShowTimeModalShow" :on-confirm="changeShowTime" effect="zoom" width="400px" >
    <div slot="body">
      <div class="input-group">
        <span>播放时间：</span>
        <input type="text" class="form-control" v-model="changeShowTimeData.showTime">
        <span>(秒)</span>
      </div>
    </div>
  </n3-modal>

  <n3-modal title="删除列表" :show.sync="modal.deleteModalShow" :on-confirm="deleteFileGroup"  effect="zoom" width="400px" >
    <div slot="body">
      <p class="lead">确定删除这个播放列表？</p>
    </div>
  </n3-modal>

  <n3-modal :show.sync="previewData.previewModalShow" width="350px" title="文件预览" effect="fade" :on-confirm="">
    <div slot="body">
      <img 
        :src.once="previewData.previewSrc" 
        v-show="previewData.previewImgShow" 
        class="img-responsive modalImg">
      <video-player 
        v-ref:video 
        v-show="previewData.previewVideoShow" 
        :options="videoOptions">
      </video-player>
    </div>
    <div slot="footer"></div>
  </n3-modal>


  <form class="form-inline select-search">
    <label>海报分组搜索：</label>
    <select class="form-control" v-model="selectPosterGroupId">
      <option :value="-1">全部查询</option>
      <option 
        v-for="posterGroupingData in posterGroupingDatas"
        :value="posterGroupingData.groupId">{{posterGroupingData.groupName}}
      </option>
    </select>
    <button class="btn btn-info" type="button" @click="selectFile">
      <n3-icon type="search"></n3-icon>
    </button>
  </form>

  <div class="panel panel-primary">
    <div class="panel-heading">播放管理</div>
    <div class="panel-body">
      <button type="button" class="btn btn-info btnForAdd"  @click="showAddModal">  添加列表
      </button>
      <table class="table-hover table table-bordered table-condensed table-striped">
        <thead>
          <tr>
            <th>播放编号</th>
            <th>文件名称</th>
            <th>播放时间</th> 
            <th>播放优先级</th>
            <th>文件类型</th>  
            <th>海报分组名称</th>       
            <th>海报分组编号</th> 
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="playListData in playListDatas">
            <td>
              {{playListData.recsId}}
            </td>
            <td>
              {{playListData.fileName | base64 'decode'}}
              <button type="button" class="btn btn-info previewBtn" @click="preview(playListData.fileUrl, playListData.fileType)">
                预览
              </button>
              <button type="button" class="btn btn-success changeBtn" @click="queryRecId(playListData.recsId,showUpdateFile)">
                更换
              </button>
            </td>
            <td>
              {{playListData.showTime}}
              <span>秒</span>
              <button 
                type="button" 
                class="btn btn-success changeShowTimeBtn" 
                @click="showChangeShowTime(playListData.recsId, playListData.showTime)">修改
              </button>
            </td>
            <td>
              {{playListData.showLevel}}
              <button 
                type="button" 
                class="btn btn-success changeShowLevelBtn" 
                @click="showChangeShowLevel(playListData.recsId, playListData.showLevel)">修改
              </button>
            </td>
            <td>
              {{playListData.fileType}}
            </td>
            <td>
              {{playListData.posterGroupName}}
            </td>
            <td>
              {{playListData.posterGroupId}}
            </td>
            <td>
              <button type="button" class="btn btn-success" @click="queryRecId(playListData.recsId,showDetailFileGroup)">
                修改
              </button>
              <button type="button" class="btn btn-danger" @click="showDeleteModal($index)">
                删除
              </button>
            </td>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="panel-footer" v-show="pagination.loadFileGroup">
      <n3-simple-pagination 
        :total="pagination.fileGroupNumber" 
        :current.sync="current.loadFileGroupList" 
        :pagesize='15' 
        @click="queryFileGroup">
      </n3-simple-pagination>
    </div>
    <div class="panel-footer" v-show="pagination.loadSelectFileGroup">
      <n3-simple-pagination 
        :total="pagination.fileGroupNumber" 
        :current.sync="current.loadSelectFileGroupList" 
        :pagesize='15' 
        @click="selectFile">
      </n3-simple-pagination>
    </div>
  </div>
</template>
<script>
  import {encode} from '../filters.js'
  import {PlayList, PosterGroup, File} from 'service/ApiService.js'
  export default {
    data: function () {
      return {
        posterGroupingDatas: [],
        fileManageDatas: [],
        playListDatas: [],
        fileGroupInfoData: {},
        addFileData: {
          fileDesc: '',
          fileKey: '',
          fileName: ''
        },
        changeFileData: {},
        changeShowTimeData: {
          showTime: '',
          recsId: ''
        },
        changeShowLevelData: {
          showLevel: '',
          recsId: ''
        },
        addFileGroupData: {},
        opreateFileGroup: {},
        selectPosterGroupId: -1,
        addPosterGroupId: '',
        selectForAdd: {
          selectFileId: -1,
          step: 1,
          showAddDesc: false,
          ifDisabled: true
        },
        selectForUpdate: {
          selectUpdateFileId: -1,
          stepForUpdateFile: 1,
          ifDisabled: true
        },
        videoOptions: {
          source: {
            type: '',
            src: ''
          }
        },
        addVideoOptions: {
          source: {
            type: '',
            src: ''
          },
          autoplay: false
        },
        updateVideoOptions: {
          source: {
            type: '',
            src: ''
          },
          autoplay: false
        },
        previewData: {
          previewSrc: '',
          addImgSrc: '',
          updateImgSrc: '',
          previewModalShow: false,
          addImgShow: false,
          addVideoShow: false,
          updateImgShow: false,
          updateVideoShow: false,
          previewImgShow: false,
          previewVideoShow: false
        },
        modal: {
          detailShow: false,
          addModalShow: false,
          deleteModalShow: false,
          updateFileModalShow: false,
          changeShowLevelModalShow: false,
          changeShowTimeModalShow: false
        },
        pagination: {
          fileGroupNumber: 0,
          loadFileGroup: false,
          selectFileGroupNumber: 0,
          loadSelectFileGroup: true
        },
        current: {
          loadFileGroupList: 1,
          loadSelectFileGroupList: 1
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
      this.queryAllPosterGroupList()
      this.queryAllFileList()
      this.queryFileGroup()
    },
    watch: {
      'selectForAdd.selectFileId': function (val) {
        for (var i = 0; i < this.fileManageDatas.length; i++) {
          if (val === this.fileManageDatas[i].fileId) {
            if (this.fileManageDatas[i].fileType === 'mp4' || this.fileManageDatas[i].fileType === 'flv' || this.fileManageDatas[i].fileType === 'webm' || this.fileManageDatas[i].fileType === 'ogg' || this.fileManageDatas[i].fileType === 'mov' || this.fileManageDatas[i].fileType === 'm3u8' || this.fileManageDatas[i].fileType === 'm4v') {
              this.addVideoOptions.source.src = this.fileManageDatas[i].url
              this.addVideoOptions.source.type = 'video/' + this.fileManageDatas[i].fileType
              this.previewData.addVideoShow = true
              this.previewData.addImgShow = false
            } else if (this.fileManageDatas[i].fileType === 'avi') {
              this.propMsg.danger.msg = '请上传mp4,flv,m3u8,ogg,webm,mov格式的视频，其他格式的视频不能播放!'
              this.propMsg.danger.show = true
            } else {
              this.previewData.addImgSrc = this.fileManageDatas[i].url
              this.previewData.addVideoShow = false
              this.previewData.addImgShow = true
            }
          }
        }
        if (val > -1) {
          this.selectForAdd.ifDisabled = false
        }
      },
      'selectForUpdate.selectUpdateFileId': function (val) {
        for (var i = 0; i < this.fileManageDatas.length; i++) {
          if (val === this.fileManageDatas[i].fileId) {
            if (this.fileManageDatas[i].fileType === 'mp4' || this.fileManageDatas[i].fileType === 'flv' || this.fileManageDatas[i].fileType === 'webm' || this.fileManageDatas[i].fileType === 'ogg' || this.fileManageDatas[i].fileType === 'mov' || this.fileManageDatas[i].fileType === 'm3u8' || this.fileManageDatas[i].fileType === 'm4v') {
              this.updateVideoOptions.source.src = this.fileManageDatas[i].url
              this.updateVideoOptions.source.type = 'video/' + this.fileManageDatas[i].fileType
              this.previewData.updateVideoShow = true
              this.previewData.updateImgShow = false
            } else if (this.fileManageDatas[i].fileType === 'avi') {
              this.propMsg.danger.msg = '请上传mp4,flv,m3u8,ogg,webm,mov格式的视频，其他格式的视频不能播放!'
              this.propMsg.danger.show = true
            } else {
              this.previewData.updateImgSrc = this.fileManageDatas[i].url
              this.previewData.updateVideoShow = false
              this.previewData.updateImgShow = true
            }
          }
        }
      },
      'previewData.previewModalShow': function (val) {
        if (val === false) {
          if (this.$refs.video.player !== undefined) {
            this.$refs.video.player.pause()
          } else {
          }
        }
      },
      'modal.updateFileModalShow': function (val) {
        if (val === false) {
          if (this.$refs.updatevideo.player !== undefined) {
            this.$refs.updatevideo.player.pause()
          } else {
          }
        }
      },
      'modal.addModalShow': function (val) {
        if (val === false) {
          if (this.$refs.addvideo.player !== undefined) {
            this.$refs.addvideo.player.pause()
          } else {
          }
        }
      },
      'selectPosterGroupId': function (val, oldVal) {
        if (oldVal !== val) {
          this.selectFile()
        }
      }
    },
    methods: {
      showAddModal: function () {
        this.selectForAdd = {
          selectFileId: -1,
          step: 1,
          showAddDesc: false,
          ifDisabled: true
        }
        this.addFileData = {
          fileDesc: '',
          fileKey: '',
          fileName: ''
        }
        this.addFileGroupData = {}
        this.modal.addModalShow = true
      },
      showDeleteModal: function (index) {
        this.opreateFileGroup = this.playListDatas[index]
        this.modal.deleteModalShow = true
      },
      showDetailFileGroup: function (recsId) {
        this.fileGroupInfoData.recsId = recsId
        this.modal.detailShow = true
      },
      showUpdateFile: function (recsId) {
        this.changeFileData.recsId = recsId
        this.selectForUpdate = {
          selectUpdateFileId: -1,
          stepForUpdateFile: 1,
          ifDisabled: true
        }
        this.modal.updateFileModalShow = true
      },
      showChangeShowTime: function (recsId, showTime) {
        this.changeShowTimeData.showTime = showTime
        this.changeShowTimeData.recsId = recsId
        this.modal.changeShowTimeModalShow = true
      },
      showChangeShowLevel: function (recsId, showLevel) {
        this.changeShowLevelData.showLevel = showLevel
        this.changeShowLevelData.recsId = recsId
        this.modal.changeShowLevelModalShow = true
      },
      backDo: function () {
        this.selectForUpdate.stepForUpdateFile = 1
        this.selectForUpdate.selectUpdateFileId = -1
      },
      nextDo: function () {
        this.selectForUpdate.stepForUpdateFile = 2
      },
      nextToDo: function () {
        if (this.$refs.addvideo.player !== undefined) {
          this.$refs.addvideo.player.pause()
        } else {}
        if (this.selectForAdd.selectFileId === 0) {
          this.addFile()
        } else {
          this.selectForAdd.step = 2
          this.addFileGroupData.fileId = this.selectForAdd.selectFileId
        }
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
      addFile: function () {
        File.addFile(this.addFileData)
          .then(
            (res) => {
              switch (res.body.status) {
                case 0:
                  this.propMsg.danger.msg = res.body.msg
                  this.propMsg.danger.show = true
                  break
                case 1:
                  this.addFileGroupData.fileId = res.body.fileId
                  this.selectForAdd.step = 2
              }
            },
            (response) => {
              this.returnErro('addFile失败啦')
            }
          )
      },
      queryAllFileList: function () {
        File.queryAllFileList()
          .then(
            (res) => {
              switch (res.body.status) {
                case 0:
                  this.propMsg.danger.msg = res.body.msg
                  this.propMsg.danger.show = true
                  break
                case 1:
                  this.$set('fileManageDatas', res.body.fileGroupList)
              }
            },
            (response) => {
              this.returnErro('queryAllFileList失败啦')
            }
          )
      },
      addFileGroup: function () {
        this.addFileGroupData.posterGroupId = this.addPosterGroupId
        PlayList.addFileGroup(this.addFileGroupData)
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
                  this.queryFileGroup()
                  this.modal.addModalShow = false
              }
            },
            (response) => {
              this.returnErro('addFileGroup失败啦')
            }
          )
      },
      queryFileGroup: function () {
        PlayList.queryFileGroup(this.current.loadFileGroupList)
          .then(
            (res) => {
              switch (res.body.status) {
                case 0:
                  this.propMsg.danger.msg = res.body.msg
                  this.propMsg.danger.show = true
                  break
                case 1:
                  this.$set('playListDatas', res.body.fileGroupList)
                  this.pagination.fileGroupNumber = res.body.fileGroupNumber
              }
            },
            (response) => {
              this.returnErro('queryFileGroup失败啦')
            }
          )
      },
      selectFile: function () {
        if (this.selectPosterGroupId === -1) {
          this.queryFileGroup()
          return 0
        }
        PlayList.selectFile(this.current.loadSelectFileGroupList, this.selectPosterGroupId)
          .then(
            (res) => {
              switch (res.body.status) {
                case 0:
                  this.propMsg.danger.msg = res.body.msg
                  this.propMsg.danger.show = true
                  break
                case 1:
                  this.pagination.loadFileGroup = false
                  this.pagination.loadSelectFileGroup = true
                  this.$set('playListDatas', res.body.selectFileList)
                  this.pagination.selectFileGroupNumber = res.body.fileGroupNumber
              }
            },
            (response) => {
            }
          )
      },
      queryRecId: function (recsId, callBackFunction) {
        PlayList.queryRecId(recsId)
          .then(
            (res) => {
              switch (res.body.status) {
                case 0:
                  this.propMsg.danger.msg = res.body.msg
                  this.propMsg.danger.show = true
                  break
                case 1:
                  this.$set('fileGroupInfoData', res.body.fileGroupInfo)
                  callBackFunction(recsId)
              }
            },
            (response) => {
              this.returnErro('queryRecsId失败啦')
            }
          )
      },
      deleteFileGroup: function () {
        PlayList.deleteFileGroup(this.opreateFileGroup.recsId)
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
                  this.selectFile()
                  this.modal.deleteModalShow = false
              }
            },
            (response) => {
              this.returnErro('deleteFileGroup失败啦')
            }
          )
      },
      updateFileGroup: function () {
        PlayList.updateFileGroup(this.fileGroupInfoData)
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
                  this.selectFile()
                  this.modal.detailShow = false
              }
            },
            (response) => {
              this.returnErro('updateFileGroup失败啦')
            }
          )
      },
      changeShowTime: function () {
        PlayList.changeShowTime(this.changeShowTimeData)
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
                  this.selectFile()
                  this.modal.changeShowTimeModalShow = false
              }
            },
            (response) => {
              this.returnErro('changeShowTime失败啦')
            }
          )
      },
      changeShowLevel: function () {
        PlayList.changeShowLevel(this.changeShowLevelData)
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
                  this.selectFile()
                  this.modal.changeShowLevelModalShow = false
              }
            },
            (response) => {
              this.returnErro('changeShowLevel失败啦')
            }
          )
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
      getUploadFileData: function (data) {
        this.addFileData.fileName = encode(data.response.fileName)
        this.addFileData.fileKey = data.response.fileKey
        this.selectForAdd.selectFileId = 0
        this.selectForUpdate.selectUpdateFileId = 0
        this.selectForAdd.showAddDesc = true
      },
      addFileAndUpdate: function () {
        File.addFile(this.addFileData)
          .then(
            (res) => {
              switch (res.body.status) {
                case 0:
                  this.propMsg.danger.msg = res.body.msg
                  this.propMsg.danger.show = true
                  break
                case 1:
                  this.changeFileData.fileId = res.body.fileId
                  this.updateFile()
              }
            },
            (response) => {
              this.returnErro('addFile失败啦')
            }
          )
      },
      updateFile: function () {
        if (this.selectForUpdate.selectUpdateFileId > 0) {
          this.changeFileData.fileId = this.selectForUpdate.selectUpdateFileId
        }
        PlayList.changeFile(this.changeFileData)
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
                  this.selectFile()
                  this.modal.updateFileModalShow = false
              }
            },
            (response) => {
              this.returnErro('updateFile失败啦')
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
  .previewBtn,.changeBtn,.changeShowLevelBtn,.changeShowTimeBtn{
    float: right;
  }
</style>
