<template>
  <div class="course-editor">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span>{{ formData.id ? '编辑课程' : '新建课程' }}</span>
        </div>
      </template>

      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="120px"
        label-position="right"
      >
        <!-- 基础信息 -->
        <el-divider content-position="left">基础信息</el-divider>
        
        <el-form-item label="课程标题" prop="title">
          <el-input
            v-model="formData.title"
            placeholder="请输入课程标题"
            maxlength="50"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="视频URL" prop="videoUrl">
          <el-input
            v-model="formData.videoUrl"
            placeholder="请输入视频URL"
            type="textarea"
            :rows="2"
          />
        </el-form-item>

        <el-form-item label="缩略图" prop="thumbnail">
          <el-upload
            class="thumbnail-uploader"
            action="#"
            :show-file-list="false"
            :before-upload="beforeUpload"
            :http-request="handleUpload"
          >
            <img v-if="formData.thumbnail" :src="formData.thumbnail" class="thumbnail" />
            <el-icon v-else class="thumbnail-icon"><Plus /></el-icon>
          </el-upload>
          <div class="upload-tip">支持jpg/png格式，建议尺寸：800x450</div>
        </el-form-item>

        <el-form-item label="总时长（秒）" prop="totalDuration">
          <el-input-number
            v-model="formData.totalDuration"
            :min="0"
            :max="36000"
            :step="1"
            placeholder="请输入总时长"
          />
          <span class="duration-tip">约 {{ formatDuration(formData.totalDuration) }}</span>
        </el-form-item>

        <!-- 课程类型 -->
        <el-divider content-position="left">课程类型</el-divider>
        
        <el-form-item label="课程类型" prop="type">
          <el-radio-group v-model="formData.type" @change="handleTypeChange">
            <el-radio label="Treadmill">跑步机</el-radio>
            <el-radio label="Cycling">脚踏车</el-radio>
            <el-radio label="Rowing">划船机</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 运动参数 -->
        <el-divider content-position="left">默认运动参数</el-divider>
        
        <el-row :gutter="20">
          <el-col :span="8" v-if="showSpeed">
            <el-form-item label="速度" prop="speed">
              <el-input-number
                v-model="formData.speed"
                :min="0"
                :max="30"
                :step="0.1"
                :precision="1"
                placeholder="速度"
              />
              <span class="unit">km/h</span>
            </el-form-item>
          </el-col>
          
          <el-col :span="8" v-if="showIncline">
            <el-form-item label="坡度" prop="incline">
              <el-input-number
                v-model="formData.incline"
                :min="0"
                :max="30"
                :step="0.5"
                :precision="1"
                placeholder="坡度"
              />
              <span class="unit">%</span>
            </el-form-item>
          </el-col>
          
          <el-col :span="8" v-if="showResistance">
            <el-form-item label="阻力" prop="resistance">
              <el-input-number
                v-model="formData.resistance"
                :min="0"
                :max="20"
                :step="1"
                placeholder="阻力"
              />
              <span class="unit">级</span>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 分段视频管理 -->
        <el-divider content-position="left">分段视频管理</el-divider>
        
        <el-form-item label="分段列表" prop="segments">
          <div class="segments-container">
            <el-table
              :data="formData.segments"
              border
              style="width: 100%"
              :max-height="400"
            >
              <el-table-column type="index" label="序号" width="60" align="center" />
              
              <el-table-column label="开始时间（秒）" width="140">
                <template #default="{ row, $index }">
                  <el-input-number
                    v-model="row.startTime"
                    :min="0"
                    :max="formData.totalDuration"
                    :step="1"
                    size="small"
                    @change="validateSegment($index)"
                  />
                </template>
              </el-table-column>
              
              <el-table-column label="结束时间（秒）" width="140">
                <template #default="{ row, $index }">
                  <el-input-number
                    v-model="row.endTime"
                    :min="0"
                    :max="formData.totalDuration"
                    :step="1"
                    size="small"
                    @change="validateSegment($index)"
                  />
                </template>
              </el-table-column>
              
              <el-table-column label="时长" width="100" align="center">
                <template #default="{ row }">
                  {{ formatDuration(row.endTime - row.startTime) }}
                </template>
              </el-table-column>
              
              <el-table-column label="速度" width="120" v-if="showSpeed">
                <template #default="{ row }">
                  <el-input-number
                    v-model="row.speed"
                    :min="0"
                    :max="30"
                    :step="0.1"
                    :precision="1"
                    size="small"
                  />
                </template>
              </el-table-column>
              
              <el-table-column label="坡度" width="120" v-if="showIncline">
                <template #default="{ row }">
                  <el-input-number
                    v-model="row.incline"
                    :min="0"
                    :max="30"
                    :step="0.5"
                    :precision="1"
                    size="small"
                  />
                </template>
              </el-table-column>
              
              <el-table-column label="阻力" width="120" v-if="showResistance">
                <template #default="{ row }">
                  <el-input-number
                    v-model="row.resistance"
                    :min="0"
                    :max="20"
                    :step="1"
                    size="small"
                  />
                </template>
              </el-table-column>
              
              <el-table-column label="操作" width="100" align="center" fixed="right">
                <template #default="{ $index }">
                  <el-button
                    type="danger"
                    size="small"
                    :icon="Delete"
                    @click="removeSegment($index)"
                    :disabled="formData.segments.length <= 1"
                  >
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            
            <div class="segment-actions">
              <el-button
                type="primary"
                :icon="Plus"
                @click="addSegment"
              >
                添加分段
              </el-button>
              <el-button
                type="info"
                :icon="Refresh"
                @click="resetSegments"
              >
                重置分段
              </el-button>
            </div>
          </div>
        </el-form-item>

        <!-- 操作按钮 -->
        <el-form-item>
          <el-button type="primary" @click="handleSubmit" :loading="submitting">
            保存
          </el-button>
          <el-button @click="handleReset">重置</el-button>
          <el-button @click="handleCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Delete, Refresh } from '@element-plus/icons-vue'
import { createDefaultCourse, createDefaultSegment, COURSE_TYPES } from '@/types/course'

// 表单引用
const formRef = ref(null)
const submitting = ref(false)

// 表单数据
const formData = reactive(createDefaultCourse())

// 根据课程类型显示对应的参数字段
const showSpeed = computed(() => {
  return formData.type === COURSE_TYPES.TREADMILL || formData.type === COURSE_TYPES.CYCLING
})

const showIncline = computed(() => {
  return formData.type === COURSE_TYPES.TREADMILL
})

const showResistance = computed(() => {
  return formData.type === COURSE_TYPES.CYCLING || formData.type === COURSE_TYPES.ROWING
})

// 表单验证规则
const formRules = {
  title: [
    { required: true, message: '请输入课程标题', trigger: 'blur' },
    { min: 2, max: 50, message: '标题长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  videoUrl: [
    { required: true, message: '请输入视频URL', trigger: 'blur' },
    { type: 'url', message: '请输入有效的URL地址', trigger: 'blur' }
  ],
  thumbnail: [
    { required: true, message: '请上传缩略图', trigger: 'change' }
  ],
  totalDuration: [
    { required: true, message: '请输入总时长', trigger: 'blur' },
    { type: 'number', min: 1, message: '总时长必须大于0', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请选择课程类型', trigger: 'change' }
  ],
  segments: [
    {
      validator: (rule, value, callback) => {
        if (!value || value.length === 0) {
          callback(new Error('至少需要一个分段'))
          return
        }
        
        // 检查时间段是否重叠
        const sorted = [...value].sort((a, b) => a.startTime - b.startTime)
        for (let i = 0; i < sorted.length - 1; i++) {
          if (sorted[i].endTime > sorted[i + 1].startTime) {
            callback(new Error('时间段不能重叠'))
            return
          }
        }
        
        // 检查总时长是否匹配
        const totalSegmentDuration = sorted.reduce((sum, seg) => {
          return sum + (seg.endTime - seg.startTime)
        }, 0)
        
        if (Math.abs(totalSegmentDuration - formData.totalDuration) > 1) {
          callback(new Error('分段总时长应与课程总时长匹配'))
          return
        }
        
        callback()
      },
      trigger: 'change'
    }
  ]
}

// 处理课程类型变化
const handleTypeChange = (type) => {
  // 重置运动参数
  formData.speed = 0
  formData.incline = 0
  formData.resistance = 0
  
  // 重置分段参数
  formData.segments.forEach(segment => {
    segment.speed = 0
    segment.incline = 0
    segment.resistance = 0
  })
}

// 添加分段
const addSegment = () => {
  const lastSegment = formData.segments[formData.segments.length - 1]
  const newSegment = createDefaultSegment()
  
  if (lastSegment) {
    newSegment.startTime = lastSegment.endTime
    newSegment.endTime = Math.min(lastSegment.endTime + 60, formData.totalDuration)
  }
  
  formData.segments.push(newSegment)
}

// 删除分段
const removeSegment = (index) => {
  if (formData.segments.length <= 1) {
    ElMessage.warning('至少需要保留一个分段')
    return
  }
  formData.segments.splice(index, 1)
}

// 重置分段
const resetSegments = () => {
  ElMessageBox.confirm('确定要重置所有分段吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    formData.segments = [createDefaultSegment()]
    formData.segments[0].endTime = formData.totalDuration
    ElMessage.success('重置成功')
  }).catch(() => {})
}

// 验证分段
const validateSegment = (index) => {
  const segment = formData.segments[index]
  if (segment.startTime >= segment.endTime) {
    ElMessage.warning('开始时间必须小于结束时间')
    segment.endTime = segment.startTime + 60
  }
  if (segment.endTime > formData.totalDuration) {
    segment.endTime = formData.totalDuration
  }
  if (segment.startTime < 0) {
    segment.startTime = 0
  }
}

// 格式化时长
const formatDuration = (seconds) => {
  if (!seconds) return '0秒'
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  
  let result = ''
  if (hours > 0) result += `${hours}小时`
  if (minutes > 0) result += `${minutes}分钟`
  if (secs > 0 || result === '') result += `${secs}秒`
  
  return result
}

// 上传前验证
const beforeUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isImage) {
    ElMessage.error('只能上传图片文件!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB!')
    return false
  }
  return true
}

// 处理上传
const handleUpload = (options) => {
  // 这里应该调用实际的上传API
  // 目前使用本地预览
  const file = options.file
  const reader = new FileReader()
  reader.onload = (e) => {
    formData.thumbnail = e.target.result
    ElMessage.success('上传成功')
  }
  reader.readAsDataURL(file)
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    submitting.value = true
    
    // 这里应该调用实际的API保存数据
    console.log('提交数据:', formData)
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    ElMessage.success('保存成功')
    submitting.value = false
  } catch (error) {
    console.error('表单验证失败:', error)
    ElMessage.error('请检查表单填写是否正确')
    submitting.value = false
  }
}

// 重置表单
const handleReset = () => {
  ElMessageBox.confirm('确定要重置表单吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    Object.assign(formData, createDefaultCourse(formData.type))
    formRef.value?.resetFields()
    ElMessage.success('重置成功')
  }).catch(() => {})
}

// 取消
const handleCancel = () => {
  // 这里可以返回列表页或执行其他操作
  ElMessage.info('已取消')
}
</script>

<style scoped lang="less">
.course-editor {
  .card-header {
    font-size: 18px;
    font-weight: bold;
    color: #303133;
  }
  
  .thumbnail-uploader {
    :deep(.el-upload) {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: all 0.3s;
      
      &:hover {
        border-color: #409EFF;
      }
    }
    
    .thumbnail {
      width: 178px;
      height: 100px;
      display: block;
      object-fit: cover;
    }
    
    .thumbnail-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 100px;
      line-height: 100px;
      text-align: center;
    }
  }
  
  .upload-tip {
    font-size: 12px;
    color: #909399;
    margin-top: 8px;
  }
  
  .duration-tip {
    margin-left: 10px;
    color: #909399;
    font-size: 12px;
  }
  
  .unit {
    margin-left: 8px;
    color: #909399;
    font-size: 14px;
  }
  
  .segments-container {
    width: 100%;
    
    .segment-actions {
      margin-top: 15px;
      display: flex;
      gap: 10px;
    }
  }
}

:deep(.el-divider__text) {
  font-size: 16px;
  font-weight: bold;
  color: #303133;
}
</style>

