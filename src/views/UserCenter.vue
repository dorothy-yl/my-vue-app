<template>
  <div class="user-center">
    <el-row :gutter="20">
      <!-- 左侧：基础信息 -->
      <el-col :xs="24" :md="16">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>基础信息</span>
            </div>
          </template>

          <el-form
            ref="formRef"
            :model="userForm"
            :rules="formRules"
            label-width="100px"
            label-position="right"
          >
            <el-form-item label="用户名" prop="name">
              <el-input
                v-model="userForm.name"
                placeholder="请输入用户名"
                maxlength="20"
                show-word-limit
              />
            </el-form-item>

            <el-form-item label="性别" prop="gender">
              <el-radio-group v-model="userForm.gender">
                <el-radio label="male">男</el-radio>
                <el-radio label="female">女</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="年龄" prop="age">
              <el-input-number
                v-model="userForm.age"
                :min="1"
                :max="120"
                :step="1"
                placeholder="请输入年龄"
              />
              <span class="unit">岁</span>
            </el-form-item>

            <el-form-item label="身高" prop="height">
              <el-input-number
                v-model="userForm.height"
                :min="50"
                :max="250"
                :step="1"
                :precision="0"
                placeholder="请输入身高"
              />
              <span class="unit">cm</span>
            </el-form-item>

            <el-form-item label="体重" prop="weight">
              <el-input-number
                v-model="userForm.weight"
                :min="20"
                :max="200"
                :step="0.1"
                :precision="1"
                placeholder="请输入体重"
              />
              <span class="unit">kg</span>
            </el-form-item>

            <el-form-item label="头像" prop="avatar">
              <el-upload
                class="avatar-uploader"
                action="#"
                :show-file-list="false"
                :before-upload="beforeUpload"
                :http-request="handleUpload"
              >
                <img v-if="userForm.avatar" :src="userForm.avatar" class="avatar" />
                <el-icon v-else class="avatar-icon"><Plus /></el-icon>
              </el-upload>
              <div class="upload-tip">支持jpg/png格式，建议尺寸：200x200</div>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="handleSave" :loading="saving">
                保存信息
              </el-button>
              <el-button @click="handleReset">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>

      <!-- 右侧：VIP状态和其他信息 -->
      <el-col :xs="24" :md="8">
        <!-- VIP状态卡片 -->
        <el-card shadow="hover" class="vip-card">
          <template #header>
            <div class="card-header">
              <span>VIP状态</span>
            </div>
          </template>
          
          <div class="vip-content">
            <div class="vip-status">
              <el-icon :size="40" :color="isVip ? '#F56C6C' : '#909399'">
                <Trophy v-if="isVip" />
                <Lock v-else />
              </el-icon>
              <div class="vip-text">
                <div class="vip-label">当前状态</div>
                <div class="vip-value" :class="{ 'vip-active': isVip }">
                  {{ isVip ? 'VIP会员' : '普通用户' }}
                </div>
              </div>
            </div>
            
            <el-divider />
            
            <div class="vip-switch">
              <div class="switch-label">VIP会员</div>
              <el-switch
                v-model="isVip"
                active-text="开启"
                inactive-text="关闭"
                @change="handleVipChange"
              />
            </div>
            
            <div class="vip-tip" v-if="isVip">
              <el-icon><InfoFilled /></el-icon>
              <span>您已开通VIP会员，享受更多特权</span>
            </div>
            <div class="vip-tip" v-else>
              <el-icon><InfoFilled /></el-icon>
              <span>开通VIP会员，解锁更多功能</span>
            </div>
          </div>
        </el-card>

        <!-- 用户统计卡片 -->
        <el-card shadow="hover" class="stat-card" style="margin-top: 20px">
          <template #header>
            <div class="card-header">
              <span>用户统计</span>
            </div>
          </template>
          
          <div class="stat-list">
            <div class="stat-item">
              <div class="stat-label">BMI指数</div>
              <div class="stat-value">{{ calculateBMI }}</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">会员等级</div>
              <div class="stat-value">{{ isVip ? 'VIP' : '普通' }}</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">注册时间</div>
              <div class="stat-value">2026-01-01</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus, Trophy, Lock, InfoFilled } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const formRef = ref(null)
const saving = ref(false)

// 表单数据
const userForm = reactive({
  name: '',
  gender: '',
  age: 0,
  height: 0,
  weight: 0,
  avatar: ''
})

// VIP状态
const isVip = computed({
  get: () => userStore.isVip,
  set: (value) => userStore.setVip(value)
})

// 表单验证规则
const formRules = {
  name: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 20, message: '用户名长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  gender: [
    { required: true, message: '请选择性别', trigger: 'change' }
  ],
  age: [
    { required: true, message: '请输入年龄', trigger: 'blur' },
    { type: 'number', min: 1, max: 120, message: '年龄必须在 1 到 120 之间', trigger: 'blur' }
  ],
  height: [
    { required: true, message: '请输入身高', trigger: 'blur' },
    { type: 'number', min: 50, max: 250, message: '身高必须在 50 到 250 cm 之间', trigger: 'blur' }
  ],
  weight: [
    { required: true, message: '请输入体重', trigger: 'blur' },
    { type: 'number', min: 20, max: 200, message: '体重必须在 20 到 200 kg 之间', trigger: 'blur' }
  ]
}

// 计算BMI
const calculateBMI = computed(() => {
  if (userForm.height > 0 && userForm.weight > 0) {
    const heightInMeters = userForm.height / 100
    const bmi = userForm.weight / (heightInMeters * heightInMeters)
    return bmi.toFixed(1)
  }
  return '--'
})

// 初始化表单数据
const initForm = () => {
  Object.assign(userForm, {
    name: userStore.userInfo.name || '',
    gender: userStore.userInfo.gender || '',
    age: userStore.userInfo.age || 0,
    height: userStore.userInfo.height || 0,
    weight: userStore.userInfo.weight || 0,
    avatar: userStore.userInfo.avatar || ''
  })
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
  const file = options.file
  const reader = new FileReader()
  reader.onload = (e) => {
    userForm.avatar = e.target.result
    ElMessage.success('上传成功')
  }
  reader.readAsDataURL(file)
}

// 保存信息
const handleSave = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    saving.value = true
    
    // 更新store中的用户信息
    userStore.updateUserInfo(userForm)
    
    // 这里应该调用实际的API保存数据
    console.log('保存用户信息:', userForm)
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    
    ElMessage.success('保存成功')
    saving.value = false
  } catch (error) {
    console.error('表单验证失败:', error)
    ElMessage.error('请检查表单填写是否正确')
    saving.value = false
  }
}

// 重置表单
const handleReset = () => {
  initForm()
  formRef.value?.resetFields()
  ElMessage.info('已重置为当前保存的信息')
}

// VIP状态变化
const handleVipChange = (value) => {
  if (value) {
    ElMessage.success('VIP会员已开通')
  } else {
    ElMessage.info('VIP会员已关闭')
  }
}

// 组件挂载时初始化
onMounted(() => {
  initForm()
})
</script>

<style scoped lang="less">
.user-center {
  .card-header {
    font-size: 16px;
    font-weight: bold;
    color: #303133;
  }
  
  .unit {
    margin-left: 8px;
    color: #909399;
    font-size: 14px;
  }
  
  .avatar-uploader {
    :deep(.el-upload) {
      border: 1px dashed #d9d9d9;
      border-radius: 50%;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: all 0.3s;
      
      &:hover {
        border-color: #409EFF;
      }
    }
    
    .avatar {
      width: 100px;
      height: 100px;
      display: block;
      border-radius: 50%;
      object-fit: cover;
    }
    
    .avatar-icon {
      font-size: 28px;
      color: #8c939d;
      width: 100px;
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
  
  .vip-card {
    .vip-content {
      .vip-status {
        display: flex;
        align-items: center;
        gap: 15px;
        padding: 20px 0;
        
        .vip-text {
          flex: 1;
          
          .vip-label {
            font-size: 14px;
            color: #909399;
            margin-bottom: 8px;
          }
          
          .vip-value {
            font-size: 24px;
            font-weight: bold;
            color: #909399;
            
            &.vip-active {
              color: #F56C6C;
            }
          }
        }
      }
      
      .vip-switch {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 0;
        
        .switch-label {
          font-size: 14px;
          color: #303133;
          font-weight: 500;
        }
      }
      
      .vip-tip {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px;
        background-color: #f5f7fa;
        border-radius: 4px;
        font-size: 12px;
        color: #606266;
        margin-top: 15px;
        
        .el-icon {
          color: #409EFF;
        }
      }
    }
  }
  
  .stat-card {
    .stat-list {
      .stat-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px 0;
        border-bottom: 1px solid #f0f0f0;
        
        &:last-child {
          border-bottom: none;
        }
        
        .stat-label {
          font-size: 14px;
          color: #909399;
        }
        
        .stat-value {
          font-size: 16px;
          font-weight: bold;
          color: #303133;
        }
      }
    }
  }
}

// 响应式调整
@media (max-width: 768px) {
  .user-center {
    .vip-card {
      margin-top: 20px;
    }
  }
}
</style>

