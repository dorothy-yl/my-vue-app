import { createApp } from 'vue'
import App from './App.vue'
import "./less/index.less"
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { createPinia } from 'pinia'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
const pinia = createPinia()
const app = createApp(App);
app.use(pinia);
app.use(ElementPlus);
app.use(router).mount('#app')

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
