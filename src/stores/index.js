import { defineStore } from 'pinia'
import { ref } from 'vue'
function initState() {
    return {
    isCollapse:false,
    tags:[
        {
            path: '/home',
            name: 'home',
            label: '首页',
            icon: 'home'
          }
    ],
    currentMenu:null
    }
}
export const useAllDateStore = defineStore('allData', () => {
    const state = ref(initState());
function selectMenu(val){
  if(val.name === 'home'){
    state.value.currentMenu = null
  }else{
    let index = state.value.tags.findIndex(item=>item.name === val.name)
    index === -1?state.value.tags.push(val):""
  }
}
  
function updateTags(tag){
    //找到要删除的tab索引，使用splice方法删除
  let index = state.value.tags.findIndex(item => item.name === tag.name)
  state.value.tags.splice(index, 1)
}

    return {
        state,
        selectMenu,
        updateTags
     }
  })