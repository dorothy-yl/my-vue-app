import { createApp } from 'vue'
import App from './App.vue'
import "./less/index.less"
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { createPinia } from 'pinia'
import './api/mock.js'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import api from './api/api'
import { useAllDateStore } from './stores'

function isRoute(to){
    return router.getRoutes().filter(item=>item.path===to.path).length>0
 }
 
 router.beforeEach((to, from) => {
      //如果要跳转的不是login,且token不存在(可以通过不存在token判断出用户未登录)
     if(to.path !== '/login'&&!store.state.token){
         //跳转到login
         return { name: 'login' }
     }
     //如果路由记录不存在
     if(!isRoute(to)){
         //跳转到404界面
         return {name: "404"}
     }
 })
 
const pinia = createPinia()
const app = createApp(App);
app.config.globalProperties.$api = api
app.use(pinia);
const store = useAllDateStore()

app.use(ElementPlus);
app.use(router).mount('#app')
store.addMenu(router, "refresh")
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
