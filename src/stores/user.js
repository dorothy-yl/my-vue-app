import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

/**
 * 用户状态管理 Store
 * 管理用户基础信息和VIP状态
 */
export const useUserStore = defineStore('user', () => {
  // 用户基础信息
  const userInfo = ref({
    id: '',
    name: '',
    height: 0,      // 身高（cm）
    weight: 0,      // 体重（kg）
    age: 0,         // 年龄
    gender: '',     // 性别
    avatar: ''      // 头像
  })

  // VIP状态
  const isVip = ref(false)

  // 从localStorage加载数据
  const loadFromStorage = () => {
    try {
      const stored = localStorage.getItem('userStore')
      if (stored) {
        const data = JSON.parse(stored)
        userInfo.value = { ...userInfo.value, ...data.userInfo }
        isVip.value = data.isVip ?? false
      }
    } catch (error) {
      console.error('加载用户数据失败:', error)
    }
  }

  // 保存到localStorage
  const saveToStorage = () => {
    try {
      localStorage.setItem('userStore', JSON.stringify({
        userInfo: userInfo.value,
        isVip: isVip.value
      }))
    } catch (error) {
      console.error('保存用户数据失败:', error)
    }
  }

  // 监听状态变化，自动保存
  watch([userInfo, isVip], () => {
    saveToStorage()
  }, { deep: true })

  // 初始化时加载数据
  loadFromStorage()

  /**
   * 更新用户信息
   * @param {Object} info - 用户信息对象
   */
  const updateUserInfo = (info) => {
    userInfo.value = { ...userInfo.value, ...info }
  }

  /**
   * 切换VIP状态
   */
  const toggleVip = () => {
    isVip.value = !isVip.value
  }

  /**
   * 设置VIP状态
   * @param {boolean} status - VIP状态
   */
  const setVip = (status) => {
    isVip.value = status
  }

  /**
   * 清除用户数据（退出登录时使用）
   */
  const clearUserData = () => {
    userInfo.value = {
      id: '',
      name: '',
      height: 0,
      weight: 0,
      age: 0,
      gender: '',
      avatar: ''
    }
    isVip.value = false
    localStorage.removeItem('userStore')
  }

  return {
    userInfo,
    isVip,
    updateUserInfo,
    toggleVip,
    setVip,
    clearUserData,
    loadFromStorage
  }
})

