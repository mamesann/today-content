import { createRouter, createWebHashHistory } from 'vue-router'
import TodayContent from '../components/TodayContent.vue'
import Settings from '../views/Settings.vue'
import Wether from '../views/Wether.vue'
import Fortune from '../views/Fortune.vue'

const routes = [
  { path: '/', name: 'Home', component: TodayContent },
  { path: '/wether', name: 'Wether', component: Wether },
  { path: '/fortune', name: 'Fortune', component: Fortune },
  { path: '/settings', name: 'Settings', component: Settings },
]

const router = createRouter({
  history: createWebHashHistory(),  // GitHub Pages にデプロイする際の history オプション
  routes,
})

export default router
