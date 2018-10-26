import DeviceGroupingData from './components/DeviceGroupingData'
import PosterGroupingData from './components/PosterGroupingData'
import DeviceManageData from './components/DeviceManageData'
import PlayListData from './components/PlayListData'
import FileManageData from './components/FileManageData'
import Login from './components/Login'
import Manage from './components/Manage'

export default function (router) {
  router.redirect({
    '/': '/login'
  })
  router.map({
    '/login': {
      component: Login
    },
    '/manage': {
      component: Manage,
      subRoutes: {
        '/deviceGroupingData': {
          component: DeviceGroupingData
        },
        '/posterGroupingData': {
          component: PosterGroupingData
        },
        '/deviceManageData': {
          component: DeviceManageData
        },
        '/playListData': {
          component: PlayListData
        },
        '/fileManageData': {
          component: FileManageData
        }
      }
    }
  })
}
