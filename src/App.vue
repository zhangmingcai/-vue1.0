<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  import Login from './components/Login'
  import Manage from './components/Manage'
  export default {
    components: {
      Login: Login,
      Manage: Manage
    }
  }
</script>

<style>
.n3-row:before{
  display: table;
  content: " ";
  box-sizing: border-box;
}

.n3-row:after{
  clear: both;
  display: table;
  content: " ";
  box-sizing: border-box;
}
</style>
