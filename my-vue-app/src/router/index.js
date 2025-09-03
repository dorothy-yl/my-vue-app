import {createRouter,createWebHistory} from 'vue-router';
const routes = [
    {
        pate:'/',
        name:'main',
        component:()=>import('@/views/Main.vue')
    }
];
const router = createRouter({
    history:createWebHistory(),
    routes,
})

export default router;