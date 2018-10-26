<template>
  <n3-modal title="注销" :show.sync="logoutModalShow" :on-confirm="logout"  effect="zoom" width="400px" >
    <div slot="body">
      <p class="lead">确定注销账号？？</p>
    </div>
  </n3-modal>
  <div class="navigation  clear-padding col-md-1">
    <div class="list-group" id="list">
      <div class="list-group-item" id="blank"></div>
      <button class="list-group-item"  
        v-link="{path: '/manage/deviceManageData'}" id="dM" >设备管理</button>
      <button class="list-group-item "
        v-link="{path: '/manage/fileManageData'}" id="fM" >文件管理</button>
      <button class="list-group-item" 
        v-link="{path: '/manage/playListData'}" id="ppM" >播放管理</button>
      <button class="list-group-item" id="dG" 
        v-link="{path: '/manage/deviceGroupingData'}">设备分组</button>
      <button class="list-group-item" id="pG" 
        v-link="{path: '/manage/posterGroupingData'}">海报分组</button>
      <button class="list-group-item" id="logOut" type="button" @click='showLogoutModal'>注&nbsp&nbsp销</button>
    </div>    
  </div>
</template>
<script>
  export default {
    data: function () {
      return {
        logoutModalShow: false
      }
    },
    methods: {
      showLogoutModal: function () {
        this.logoutModalShow = true
      },
      logout: function () {
        window.localStorage.clear('userId')
        window.localStorage.clear('recId')
        window.localStorage.clear('token')
        console.log(window.localStorage.getItem('token'))
        window.location.href = ('#!/login')
      }
    }
  }
</script>
<style>
  button{
    outline: none;
    font-size: 16px;
  }
  .clear-padding{
    padding: 0px !important;
  }
  .navigation{
    position:fixed;
    top:0px;
    left:0px;
  }
  .v-link-active{
    background-color: #9F79EE !important;
    color: blue !important;
  }
  #list{ 
    text-align: center;
    height: 1500px;
    background-color: #1F2324;
  }
  #blank{
    border: none;
    width: 100%;
    height: 45px;
    background: #1F2324;
  }
  #dG{
    border: none;
    width: 100%;
    background: #1F2324;
    
    color:white; 
  }
  #dG:hover,#pG:hover,#dM:hover,#ppM:hover,#fM:hover,#logOut:hover{
    background: #212f32;
  }
  #logOut{
    border: none;
    width: 100%;
    background: #1F2324;
    
    color:white;  
  }
  #pG{
    border: none;
    width: 100%;
    background: #1F2324;
    
    color:white; 
  }
  #dM{
    border: none;
    width: 100%;
    background: #1F2324;
        
    color:white;
  }
  #ppM{
    border: none;
    width: 100%;
    background: #1F2324;
        
    color:white;
  }
  #fM{
    border: none;
    width: 100%;
    background: #1F2324;
    
    color:white;
  }
  .logout{
    margin-top: 30px;
  }
</style>