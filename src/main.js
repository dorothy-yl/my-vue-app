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
