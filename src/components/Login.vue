<template>
  <alert-group :alert-info="propMsg"></alert-group>

  <n3-container fluid id="body" @keyup.enter="doLogin">
    <n3-row>
      <n3-column :col="4" class="context"></n3-column>
      <n3-column :col="4" class="context">
        <table align=center>
          <tr>
            <td id="contain">
              <div class="contain">
                <div style="height:45px; font-size:22px; text-align:center; letter-spacing:10px; line-height:41px;">海报机管理系统</div>
                <div style="background-color:#D4D4D4;height:2px;width:270px;margin:0px auto;"></div>
                <form>
                  <div class="loginGroup userName">
                    <label for="username" class="nameLabel">
                      <n3-icon type="user"></n3-icon>&nbsp&nbsp
                    </label>
                    <n3-input 
                      :value.sync="loginData.userName" 
                      class="nameInput" 
                      placeholder="用户名">
                    </n3-input>
                  </div>
                  <div class="loginGroup" >
                    <label for="password" class="pwdLabel">
                      <n3-icon type="key"></n3-icon>&nbsp
                    </label>
                    <n3-input 
                      type="password" 
                      :value.sync="loginData.userPwd" 
                      class="pwdInput" 
                      placeholder="密&nbsp码">
                    </n3-input>
                    <div class="loginButton" @click="doLogin()">
                      登&nbsp&nbsp录
                    </div>
                  </div>
                </form>
              </div>
            </td>
          </tr>
        </table>
      </n3-column>
      <n3-column :col="4" class="context"></n3-column>
    </n3-row>
  </n3-container>  
</template>
<style type="text/css" scoped>
  .loginButton{
    width: 250px;
    height:40px;
    line-height: 35px;
    border-radius: 6px;
    border:solid 2px white;
    text-align: center;
    margin-left: 55px;
    margin-top: 25px;
    cursor: pointer;
    background-color: #0097ee;
    color:#fff;
  }
  .userName{
    margin-top: 50px;
  }
  .contain{
    width: 350px;
    height: 300px;
    border:solid #D1D1D1 1px;
    border-radius: 10px;
    background-color: #fff;
    box-shadow: 0 10px 15px rgba(0,0,0,.6) ;
  } 
  .loginGroup{
    text-align: center;
    margin-bottom:30px; 
  }
  #body{
    font-size: 20px;
    color:#39b2a9;
    background: url(../assets/poster.jpg);  
    background-size: 100%;
  }
</style>
<script type="text/javascript">
  import {Login} from 'service/ApiService.js'
  export default {
    data: function () {
      return {
        loginData: {
          userName: '',
          userPwd: ''
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
      this.setHeight()
    },
    methods: {
      doLogin: function () {
        Login.doLogin(this.loginData)
          .then(
            (res) => {
              switch (res.body.status) {
                case 0:
                  this.propMsg.danger.msg = res.body.msg
                  this.propMsg.danger.show = true
                  break
                case 1:
                  window.localStorage.setItem('userId', res.body.tokenMsg.userId)
                  window.localStorage.setItem('recId', res.body.tokenMsg.recId)
                  window.localStorage.setItem('token', res.body.tokenMsg.token)
                  window.location.href = ('#!/manage/deviceManageData')
              }
            },
            (response) => {
              this.returnErro('queryAllPosterGroupList失败啦')
            }
          )
      },
      setHeight: function () {
        document.getElementById('body').style.height = document.documentElement.clientHeight + 'px'
        document.getElementById('contain').style.height = 0.9 * (document.documentElement.clientHeight) + 'px'
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
