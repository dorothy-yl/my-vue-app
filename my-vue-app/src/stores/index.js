import { defineStore } from 'pinia'
import { ref } from 'vue'
function initState() {}
export const useAllDateStore = defineStore('counter', () => {
    const state = ref(initState())
    return {
        state

     }
  })