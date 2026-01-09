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

// 先初始化 pinia 和 store
const pinia = createPinia()
const app = createApp(App);
app.config.globalProperties.$api = api
app.use(pinia);
const store = useAllDateStore()

// 在 store 初始化后注册路由守卫
router.beforeEach((to, from) => {
    console.log('路由跳转:', to.path, '当前token:', store.state.token);
    
    // 如果是登录页或404页，直接放行
    if(to.path === '/login' || to.path === '/404'){
        return true;
    }
    
    // 如果token不存在（未登录），跳转到登录页
    if(!store.state.token){
        console.log('未登录，跳转到登录页');
        return { name: 'login' }
    }
    
    // 如果路由记录不存在，跳转到404界面
    if(!isRoute(to)){
        console.log('路由不存在，跳转到404');
        return {name: "404"}
    }
})

app.use(ElementPlus);
app.use(router).mount('#app')
store.addMenu(router, "refresh")
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
