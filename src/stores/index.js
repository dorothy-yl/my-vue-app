import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import router from '@/router'
function initState() {
  return {
    routerList: [],
    menuList: [],
    tags: [],
    currentMenu: null,
    isCollapse: false,
    token: null
  }
}
export const useAllDateStore = defineStore('allData', (a) => {


  const state = ref(initState());
  watch(state, (newObj) => {
    if (!newObj.token) {
      localStorage.setItem('store', JSON.stringify(newObj));
    }
  }, { deep: true }
  )

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
    state.value.routerList.forEach(item => {
      if (item) item()
    })
    //重置state的数据
    state.value = initState()
    //删除本地缓存，因为这个clearn方法是用户退出执行的
    localStorage.removeItem('store')
  }

  function updateTags(tag) {
    //找到要删除的tab索引，使用splice方法删除
    let index = state.value.tags.findIndex(item => item.name === tag.name)
    state.value.tags.splice(index, 1)
  }
  function updateMenuList(val) {
    state.value.menuList = val
  }

  return {
    state,
    selectMenu,
    updateTags,
    updateMenuList,
    clearn,
    addMenu
  }
})