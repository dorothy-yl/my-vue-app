<template>
  <div class="main-layout">
    <el-container class="layout-container">
      <!-- 侧边栏 -->
      <el-aside 
        :width="asideWidth" 
        :collapse="isCollapse"
        class="layout-aside"
      >
        <CommonAside />
      </el-aside>
      
      <!-- 主内容区 -->
      <el-container class="layout-main-container">
        <!-- 头部 -->
        <el-header class="layout-header">
          <CommonHeader />
        </el-header>
        
        <!-- 标签页 -->
        <CommonTab />
        
        <!-- 内容区 -->
        <el-main class="layout-main">
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAllDateStore } from '@/stores'
import { useResponsive } from '@/utils/responsive'
import CommonAside from './CommonAside.vue'
import CommonHeader from './CommonHeader.vue'
import CommonTab from './CommonTab.vue'

const store = useAllDateStore()
const { isMobile } = useResponsive()

// 侧边栏宽度
const asideWidth = computed(() => {
  return isCollapse.value ? '64px' : '180px'
})

// 侧边栏折叠状态
const isCollapse = computed(() => {
  // 移动端自动折叠，否则使用store中的状态
  if (isMobile.value) {
    return true
  }
  return store.state.isCollapse
})

// 监听移动端变化，自动更新store状态
const updateCollapseState = () => {
  if (isMobile.value) {
    // 移动端强制折叠
    store.state.isCollapse = true
  }
}

// 监听窗口大小变化
let resizeHandler = null

onMounted(() => {
  updateCollapseState()
  
  resizeHandler = () => {
    updateCollapseState()
  }
  window.addEventListener('resize', resizeHandler)
})

onUnmounted(() => {
  if (resizeHandler) {
    window.removeEventListener('resize', resizeHandler)
  }
})
</script>

<style scoped lang="less">
.main-layout,
.layout-container {
  height: 100%;
  width: 100%;
}

.layout-aside {
  height: 100%;
  background-color: #545c64;
  transition: width 0.3s;
}

.layout-main-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.layout-header {
  background-color: #333;
  padding: 0;
  height: 60px;
  line-height: 60px;
}

.layout-main {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background-color: #f5f5f5;
}

// 响应式样式
@media (max-width: 768px) {
  .layout-aside {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 1000;
    height: 100vh;
  }
  
  .layout-main-container {
    margin-left: 64px;
  }
}
</style>

