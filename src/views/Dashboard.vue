<template>
  <div class="dashboard">
    <!-- 数据卡片 -->
    <el-row :gutter="20" class="dashboard-cards">
      <el-col :xs="24" :sm="12" :md="6" v-for="card in statCards" :key="card.title">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-content">
            <div class="stat-icon" :style="{ backgroundColor: card.color }">
              <el-icon :size="30">
                <component :is="card.icon" />
              </el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ card.value }}</div>
              <div class="stat-title">{{ card.title }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="20" class="dashboard-charts">
      <el-col :xs="24" :md="24">
        <el-card class="chart-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span>课程热度统计</span>
            </div>
          </template>
          <div ref="chartContainer" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import * as echarts from 'echarts'
import { DataAnalysis, User, VideoPlay, Trophy } from '@element-plus/icons-vue'

// 图标映射
const iconMap = {
  VideoPlay,
  User,
  DataAnalysis,
  Trophy
}

// 数据卡片
const statCards = ref([
  {
    title: '总课程数',
    value: '128',
    icon: VideoPlay,
    color: '#409EFF'
  },
  {
    title: '总用户数',
    value: '2,456',
    icon: User,
    color: '#67C23A'
  },
  {
    title: '今日活跃',
    value: '856',
    icon: DataAnalysis,
    color: '#E6A23C'
  },
  {
    title: 'VIP用户',
    value: '324',
    icon: Trophy,
    color: '#F56C6C'
  }
])

// 图表容器
const chartContainer = ref(null)
let chartInstance = null

// 初始化图表
const initChart = async () => {
  await nextTick()
  if (!chartContainer.value) return

  // 初始化echarts实例
  chartInstance = echarts.init(chartContainer.value)

  // 模拟数据
  const courseTypes = ['跑步机', '脚踏车', '划船机']
  const courseData = [
    { name: '跑步机', value: 320 },
    { name: '脚踏车', value: 280 },
    { name: '划船机', value: 180 }
  ]

  // 配置选项
  const option = {
    title: {
      text: '课程类型热度分布',
      left: 'center',
      textStyle: {
        fontSize: 18,
        fontWeight: 'bold'
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      data: ['参与人数'],
      top: 40
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '80px',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: courseTypes,
      axisLabel: {
        fontSize: 12
      }
    },
    yAxis: {
      type: 'value',
      name: '参与人数',
      axisLabel: {
        fontSize: 12
      }
    },
    series: [
      {
        name: '参与人数',
        type: 'bar',
        data: courseData.map(item => item.value),
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#83bff6' },
            { offset: 0.5, color: '#188df0' },
            { offset: 1, color: '#188df0' }
          ])
        },
        emphasis: {
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#2378f7' },
              { offset: 0.7, color: '#2378f7' },
              { offset: 1, color: '#83bff6' }
            ])
          }
        },
        label: {
          show: true,
          position: 'top',
          formatter: '{c}'
        }
      }
    ]
  }

  chartInstance.setOption(option)

  // 响应式调整
  const handleResize = () => {
    if (chartInstance) {
      chartInstance.resize()
    }
  }
  window.addEventListener('resize', handleResize)

  // 清理函数
  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
    if (chartInstance) {
      chartInstance.dispose()
      chartInstance = null
    }
  })
}

onMounted(() => {
  initChart()
})
</script>

<style scoped lang="less">
.dashboard {
  padding: 0;
}

.dashboard-cards {
  margin-bottom: 20px;
}

.stat-card {
  margin-bottom: 20px;
  
  .stat-content {
    display: flex;
    align-items: center;
    
    .stat-icon {
      width: 60px;
      height: 60px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      margin-right: 15px;
    }
    
    .stat-info {
      flex: 1;
      
      .stat-value {
        font-size: 28px;
        font-weight: bold;
        color: #303133;
        line-height: 1;
        margin-bottom: 8px;
      }
      
      .stat-title {
        font-size: 14px;
        color: #909399;
      }
    }
  }
}

.dashboard-charts {
  margin-top: 20px;
}

.chart-card {
  .card-header {
    font-size: 16px;
    font-weight: bold;
    color: #303133;
  }
  
  .chart-container {
    width: 100%;
    height: 400px;
    min-height: 400px;
  }
}

// 响应式调整
@media (max-width: 768px) {
  .chart-container {
    height: 300px;
    min-height: 300px;
  }
}
</style>

