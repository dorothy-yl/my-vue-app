import {createRouter,createWebHistory} from 'vue-router';
const routes = [
    {
        pate:'/',
        name:'main',
        component:()=>import('@/views/Main.vue'),
        redirect:'/home',
        children:[
            {
                path:'/home',
                name:'home',
                component:()=>import('@/views/Home.vue')
            }
        ]
    }
];
const router = createRouter({
    history:createWebHistory(),
    routes,
})

export default router;