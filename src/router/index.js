import {createRouter,createWebHistory} from 'vue-router';
const routes = [
    {
        path:'/',
        name:'main',
        component:()=>import('@/views/Main.vue'),
        redirect:'/home',
        children:[
            {
                path:'home',
                name:'home',
                component:()=>import('@/views/Home.vue')
            },
            {
                path:'user',
                name:'user',
                component:()=>import('@/views/User.vue')
            },
            {
                path:'mall',
                name:'mall',
                component:()=>import('@/views/Mall.vue')
            },
           
        ]
    },
    {
        path:'/login',
        name:'login',
        component:()=>import('@/views/Login.vue')
    },
];
const router = createRouter({
    history:createWebHistory(),
    routes,
})

export default router;