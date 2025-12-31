import { ref, onMounted, onUnmounted } from 'vue'

/**
 * 响应式工具函数
 * 用于检测设备类型和窗口大小
 */

/**
 * 检测是否为移动设备
 * @returns {boolean}
 */
export function isMobileDevice() {
  return window.matchMedia('(max-width: 768px)').matches
}

/**
 * 检测是否为平板设备
 * @returns {boolean}
 */
export function isTabletDevice() {
  return window.matchMedia('(min-width: 769px) and (max-width: 1024px)').matches
}

/**
 * 检测是否为桌面设备
 * @returns {boolean}
 */
export function isDesktopDevice() {
  return window.matchMedia('(min-width: 1025px)').matches
}

/**
 * 响应式 composable
 * 返回当前设备类型和窗口大小
 * @returns {Object}
 */
export function useResponsive() {
  const isMobile = ref(isMobileDevice())
  const isTablet = ref(isTabletDevice())
  const isDesktop = ref(isDesktopDevice())
  const windowWidth = ref(window.innerWidth)
  const windowHeight = ref(window.innerHeight)

  const updateResponsive = () => {
    isMobile.value = isMobileDevice()
    isTablet.value = isTabletDevice()
    isDesktop.value = isDesktopDevice()
    windowWidth.value = window.innerWidth
    windowHeight.value = window.innerHeight
  }

  onMounted(() => {
    window.addEventListener('resize', updateResponsive)
    updateResponsive()
  })

  onUnmounted(() => {
    window.removeEventListener('resize', updateResponsive)
  })

  return {
    isMobile,
    isTablet,
    isDesktop,
    windowWidth,
    windowHeight
  }
}

