// main.js ����ļ�

// ����

// ����Animate.css����
import 'animate.css'
import './style/css/bootstrap.css'
import './style/poster.css'

// ����vue����
import Vue from 'vue'
import Filters from './filters.js'
Vue.use(Filters)

import VideoPlayer from 'vue-video-player'
Vue.use(VideoPlayer)

import VueDateFilter from 'vue-date-filter'
Vue.use(VueDateFilter)

// ����vue-resource������
import VueResource from 'vue-resource'
Vue.use(VueResource)

// ����vue-animated-list������
import VueAnimatedList from 'vue-animated-list'
Vue.use(VueAnimatedList)

import iView from 'iview'
import 'iview/dist/styles/iview.css'    // ʹ�� CSS
Vue.use(iView)

// ����N3�����
import N3Components from 'N3-components'
N3Components.install(Vue)

import AlertGroup from './components/AlertGroup'
Vue.component('alert-group', AlertGroup)
// ����������
import App from './App'

// ����vue-router
import VueRouter from 'vue-router'
Vue.use(VueRouter)
var router = new VueRouter()

// ����vue-router������
import routerMap from './router-map.js'
routerMap(router)
router.start(App, '#app')

// ʹ��router��������Ҫʵ����
/* eslint-disable no-new */
// new Vue({
//   el: 'body',
//   components: { App }
// })
