<template>
    <div class="header">
        <div class="header-left">
            <div class="l-content"> </div>
            <el-button size="small" @click="handleCollapse">
                <el-icon>
                    <Menu />
                </el-icon>
            </el-button>
            <el-breadcrumb separator="/" class="bread">
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item v-if="currentMenu" :to="currentMenu.path">{{ currentMenu.label }}</el-breadcrumb-item>

            </el-breadcrumb>
        </div>
        <div class="r-content">
            <el-dropdown>
                <span class="el-dropdown-link">
                    <img :src="userImg" class="user">
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item>个人中心</el-dropdown-item>
                        <el-dropdown-item @click="handleLoginOut">退出</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>
</template>
<script setup>
import { ref, computed } from 'vue';
import { useAllDateStore } from '@/stores';
import { useRouter } from 'vue-router';
import userImg from '@/assets/images/user.png';
const getImageUrl = (user) => {
    return new URL('../assets/images/user.png', import.meta.url).href
}
const store = useAllDateStore()
const handleCollapse = () => {
    store.state.isCollapse = !store.state.isCollapse
}
const router = useRouter()
const handleLoginOut = () => {
    store.clearn()
    router.push('/login')
}
const currentMenu = computed(() => store.state.currentMenu)
</script>
<style scoped lang="less">
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 100%;
    background-color: #333;
}

.header-left {
    display: flex;
    align-items: center;
}

.icon {
    width: 20px;
    height: 20px;
}

.l-content {
    display: flex;
    align-items: center;

    .el-button {
        margin-right: 10px;
    }

}

.r-content {

    .user {
        width: 40px;
        height: 40px;
        border-radius: 50%;
    }
}

:deep(.bread span) {
    color: #fff !important;
    cursor: pointer !important;
    margin-left: 10px !important;
}
</style>