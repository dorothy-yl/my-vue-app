/**
 * 课程类型定义
 * 定义课程数据结构和类型常量
 */

/**
 * 课程类型枚举
 */
export const COURSE_TYPES = {
  TREADMILL: 'Treadmill',    // 跑步机
  CYCLING: 'Cycling',        // 脚踏车
  ROWING: 'Rowing'           // 划船机
}

/**
 * 课程类型标签映射
 */
export const COURSE_TYPE_LABELS = {
  [COURSE_TYPES.TREADMILL]: '跑步机',
  [COURSE_TYPES.CYCLING]: '脚踏车',
  [COURSE_TYPES.ROWING]: '划船机'
}

/**
 * 课程分段数据结构
 * @typedef {Object} CourseSegment
 * @property {number} startTime - 开始时间（秒）
 * @property {number} endTime - 结束时间（秒）
 * @property {number} speed - 速度
 * @property {number} incline - 坡度
 * @property {number} resistance - 阻力
 */

/**
 * 课程数据结构
 * @typedef {Object} Course
 * @property {string} id - 课程ID
 * @property {string} title - 课程标题
 * @property {string} videoUrl - 视频URL
 * @property {string} thumbnail - 缩略图URL
 * @property {number} totalDuration - 总时长（秒）
 * @property {string} type - 课程类型 (Treadmill | Cycling | Rowing)
 * @property {number} speed - 默认速度
 * @property {number} incline - 默认坡度
 * @property {number} resistance - 默认阻力
 * @property {CourseSegment[]} segments - 分段视频列表
 */

/**
 * 创建默认课程对象
 * @param {string} type - 课程类型
 * @returns {Course}
 */
export function createDefaultCourse(type = COURSE_TYPES.TREADMILL) {
  return {
    id: '',
    title: '',
    videoUrl: '',
    thumbnail: '',
    totalDuration: 0,
    type: type,
    speed: 0,
    incline: 0,
    resistance: 0,
    segments: [
      {
        startTime: 0,
        endTime: 60,
        speed: 0,
        incline: 0,
        resistance: 0
      }
    ]
  }
}

/**
 * 创建默认分段对象
 * @returns {CourseSegment}
 */
export function createDefaultSegment() {
  return {
    startTime: 0,
    endTime: 60,
    speed: 0,
    incline: 0,
    resistance: 0
  }
}

