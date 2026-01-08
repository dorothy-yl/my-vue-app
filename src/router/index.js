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
                path:'dashboard',
                name:'dashboard',
                component:()=>import('@/views/Dashboard.vue')
            },
            {
                path:'course/editor',
                name:'courseEditor',
                component:()=>import('@/views/CourseEditor.vue')
            },
            {
                path:'user',
                name:'user',
                component:()=>import('@/views/User.vue')
            },
            {
                path:'user/center',
                name:'userCenter',
                component:()=>import('@/views/UserCenter.vue')
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
    {
        path: '/404',
        name: '404',
        component: () => import('@/views/404.vue')
      },
     
    ]
const router = createRouter({
    history:createWebHistory(),
    routes,
})

export default router;