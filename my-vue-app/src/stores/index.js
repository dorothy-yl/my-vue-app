import { defineStore } from 'pinia'
import { ref } from 'vue'
function initState() {
    return {
    isCollapse:false,
    }
}
export const useAllDateStore = defineStore('counter', () => {
    const state = ref(initState())
    return {
        state

     }
  })