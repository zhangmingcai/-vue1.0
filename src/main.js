// main.js 入口文件

// 配置

// 导入Animate.css动画
import 'animate.css'
import './style/css/bootstrap.css'
import './style/poster.css'

// 导入vue核心
import Vue from 'vue'
import Filters from './filters.js'
Vue.use(Filters)

import VideoPlayer from 'vue-video-player'
Vue.use(VideoPlayer)

import VueDateFilter from 'vue-date-filter'
Vue.use(VueDateFilter)

// 导入vue-resource并配置
import VueResource from 'vue-resource'
Vue.use(VueResource)

// 导入vue-animated-list并配置
import VueAnimatedList from 'vue-animated-list'
Vue.use(VueAnimatedList)

import iView from 'iview'
import 'iview/dist/styles/iview.css'    // 使用 CSS
Vue.use(iView)

// 导入N3组件库
import N3Components from 'N3-components'
N3Components.install(Vue)

import AlertGroup from './components/AlertGroup'
Vue.component('alert-group', AlertGroup)
// 导入入口组件
import App from './App'

// 导入vue-router
import VueRouter from 'vue-router'
Vue.use(VueRouter)
var router = new VueRouter()

// 导入vue-router配置项
import routerMap from './router-map.js'
routerMap(router)
router.start(App, '#app')

// 使用router管理，不需要实例化
/* eslint-disable no-new */
// new Vue({
//   el: 'body',
//   components: { App }
// })
