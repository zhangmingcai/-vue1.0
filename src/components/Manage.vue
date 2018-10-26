<template>
  <div class="container-fluid">
    <div class="row">
      <navigation></navigation>
      <div class="col-md-1"></div><!-- 占位 -->
      <div class="poster col-md-11">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
  import Navigation from './Menu'
  export default {
    components: {
      Navigation: Navigation
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
.poster{
  padding: 0px;
}
</style>
