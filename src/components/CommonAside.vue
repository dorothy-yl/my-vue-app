<template>
    <el-aside :width="width">
        <el-menu background-color="#545c64" text-color="#fff" :collapse="isCollapse" :collapse-transition="false"
            :default-active="activeMenu">
            <h3 v-show="!isCollapse">通用后台管理</h3>
            <h3 v-show="isCollapse">后台</h3>

            <el-menu-item v-for="item in noChildren" :index="item.path" :key="item.path" @click="handleMenu(item)">

                <component class="icons" :is="item.icon"></component>
                <span>{{ item.label }}</span>
            </el-menu-item>

            <el-sub-menu v-for="item in hasChildren" :index="item.path" :key="item.path">
                <template #title>
                    <component class="icons" :is="item.icon"></component>
                    <span>{{ item.label }}</span>
                </template>
                <el-menu-item-group>
                    <el-menu-item v-for="(subItem, subIndex) in item.children" :index="subItem.path" :key="subItem.path"
                        @click="handleMenu(subItem)">
                        <component class="icons" :is="subItem.icon"></component>
                        <span>{{ subItem.label }}</span>
                    </el-menu-item>
                </el-menu-item-group>
            </el-sub-menu>
        </el-menu>
    </el-aside>
</template>
<script setup>
import { ref, computed } from 'vue';
import { useAllDateStore } from '@/stores'
import { useRouter, useRoute } from 'vue-router'
// const list = ref([
//     {
//         path: '/home',
//         name: 'home',
//         label: '首页',
//         icon: 'house',
//         url: 'Home'
//     },
//     {
//         path: '/mall',
//         name: 'mall',
//         label: '商品管理',
//         icon: 'video-play',
//         url: 'Mall'
//     },
//     {
//         path: '/user',
//         name: 'user',
//         label: '用户管理',
//         icon: 'user',
//         url: 'User'
//     },
//     {
//         path: 'other',
//         label: '其他',
//         icon: 'location',
//         children: [
//             {
//                 path: '/page1',
//                 name: 'page1',
//                 label: '页面1',
//                 icon: 'setting',
//                 url: 'Page1'
//             },
//             {
//                 path: '/page2',
//                 name: 'page2',
//                 label: '页面2',
//                 icon: 'setting',
//                 url: 'Page2'
//             }
//         ]
//     }
// ])
const list = computed(() => store.state.menuList)
const noChildren = computed(() => list.value.filter(item => !item.children))
const hasChildren = computed(() => list.value.filter(item => item.children))
const store = useAllDateStore()
const isCollapse = computed(() => store.state.isCollapse)
const width = computed(() => store.state.isCollapse ? '64px' : '180px')
const router = useRouter()
const route = useRoute()
const activeMenu = computed(() => route.path)


const handleMenu = (item) => {
    console.log("点击菜单项:", item);
    console.log("当前所有路由:", router.getRoutes().map(r => ({ name: r.name, path: r.path })));
    
    // 检查路由是否存在
    const targetRoute = router.getRoutes().find(r => r.name === item.name);
    console.log("目标路由是否存在:", !!targetRoute, targetRoute);
    
    // 选择菜单
    store.selectMenu(item)
    
    // 跳转路由
    router.push(item.path).then(() => {
        console.log("路由跳转成功到:", item.path);
    }).catch(err => {
        console.error("路由跳转失败:", err);
        console.log("尝试重新添加路由并跳转");
        // 如果跳转失败，尝试重新添加路由
        store.addMenu(router, "refresh");
        setTimeout(() => {
            router.push(item.path);
        }, 100);
    })
}
</script>


<style scoped lang="less">
.icons {
    width: 18px;
    height: 18px;
    margin-right: 5px;
}

.el-menu {
    border-right: none;

    h3 {
        color: #fff;
        text-align: center;
        line-height: 48px;
        // padding: 10px 20px;
    }
}

.el-aside {
    height: 100%;
    background-color: #545c64;
}
</style>