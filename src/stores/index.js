import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import router from '@/router'

// 导出 user store
export { useUserStore } from './user'

function initState() {
  return {
    routerList: [],
    menuList: [],
    tags: [],
    currentMenu: null,
    isCollapse: false,
    token: null // 保留原有 token 字段
  }
}

export const useAllDateStore = defineStore('allData', () => { // 注意：原代码的 (a) 是多余的，改为空括号
  // 初始化 state：优先从 localStorage 恢复，没有则用初始值
  const initData = JSON.parse(localStorage.getItem('store')) || initState();
  const state = ref(initData);

  // 监听 state 变化，同步到 localStorage（包含 token 持久化）
  watch(state, (newObj) => {
    // 原逻辑只在 token 不存在时存储，改为始终存储（保证 token 同步）
    localStorage.setItem('store', JSON.stringify(newObj));
  }, { deep: true })

  // ========== 新增：token 专属操作方法 ==========
  /**
   * 设置 token
   * @param {string} newToken - 后端返回的 token 字符串
   */
  function setToken(newToken) {
    state.value.token = newToken;
    // 主动同步到 localStorage（兜底，防止 watch 延迟）
    localStorage.setItem('store', JSON.stringify(state.value));
    console.log('token 已设置:', newToken);
  }

  /**
   * 获取当前 token
   * @returns {string|null} 当前的 token 值
   */
  function getToken() {
    return state.value.token;
  }

  /**
   * 清空 token（单独调用，比如 token 过期时）
   */
  function clearToken() {
    state.value.token = null;
    localStorage.setItem('store', JSON.stringify(state.value));
    console.log('token 已清空');
  }

  // ========== 原有方法保留（仅优化 clearn 方法联动 token） ==========
  function selectMenu(val) {
    console.log("selectMenu called with:", val);
    
    if (val.name === 'home') {
      state.value.currentMenu = null
    } else {
      state.value.currentMenu = val

      let index = state.value.tags.findIndex(item => item.name === val.name)
      if (index === -1) {
        state.value.tags.push(val)
        console.log("添加新标签:", val);
      }
    }
    
    // 设置当前菜单
    state.value.currentMenu = val;
  }

  function addMenu(router, type) {
    if (type === "refresh") {
      if (JSON.parse(localStorage.getItem('store'))) {
        state.value = JSON.parse(localStorage.getItem('store'));
        state.value.routerList = [];
      } else {
        return;
      }
    }
    const menuList = state.value.menuList;
    console.log("menuList",menuList);
    
    const module = import.meta.glob('@/views/*.vue');
    console.log("可用的模块:", Object.keys(module));
    
    const routeArr = [];
    menuList.forEach((item) => {
      if (item.children) {
        item.children.forEach((val) => {
          let url = `/src/views/${val.url}.vue`;
          console.log("尝试加载子路由组件:", url, "可用:", !!module[url]);
          if (module[url]) {
            val.component = module[url];
            routeArr.push(val);
          } else {
            console.error("组件不存在:", url);
          }
        });
      } else {
        let url = `/src/views/${item.url}.vue`;
        console.log("尝试加载路由组件:", url, "可用:", !!module[url]);
        if (module[url]) {
          item.component = module[url];
          routeArr.push(item);
        } else {
          console.error("组件不存在:", url);
        }
      }
    });
    
    console.log("准备添加的路由:", routeArr);
    // 只在刷新时清理路由，添加时不清理
    if (type === "refresh") {
      state.value.routerList = [];
      let routes = router.getRoutes();
      routes.forEach(item => {
        if (item.name == 'main' || item.name == 'login' || item.name == '404') {
        } else {
          router.removeRoute(item.name);
        }
      })
    }
    routeArr.forEach(item => {
      console.log("添加路由项:",item);
      
      if (!item.component) {
        console.error("路由项缺少组件:", item);
        return;
      }
      
      // 确保路径格式正确，子路由路径不应该以/开头
      const routeItem = { ...item };
      if (routeItem.path.startsWith('/')) {
        routeItem.path = routeItem.path.substring(1);
      }
      
      console.log("实际添加的路由:", routeItem);
      
      try {
        const removeRoute = router.addRoute('main', routeItem);
        state.value.routerList.push(removeRoute);
        console.log("路由添加成功:", routeItem.name);
      } catch (error) {
        console.error("路由添加失败:", error, routeItem);
      }
    })
    
    console.log("路由添加完成，当前路由列表:", router.getRoutes().map(r => ({ name: r.name, path: r.path })));
  }

  function clearn() {
    // 清空路由
    state.value.routerList.forEach(item => {
      if (item) item()
    })
    // 重置state的数据（包含 token 置空）
    state.value = initState()
    // 删除本地缓存
    localStorage.removeItem('store')
    console.log('退出登录，已清空所有状态和 token');
  }

  function updateTags(tag) {
    //找到要删除的tab索引，使用splice方法删除
    let index = state.value.tags.findIndex(item => item.name === tag.name)
    state.value.tags.splice(index, 1)
  }

  function updateMenuList(val) {
    state.value.menuList = val
  }

  // ========== 导出所有方法（新增 token 方法） ==========
  return {
    state,
    selectMenu,
    updateTags,
    updateMenuList,
    clearn,
    addMenu,
    setToken,    // 新增：导出设置 token 方法
    getToken,    // 新增：导出获取 token 方法
    clearToken   // 新增：导出清空 token 方法
  }
})