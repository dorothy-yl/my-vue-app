<script setup>
import { ref, getCurrentInstance, reactive } from 'vue';
import * as echarts from "echarts";
import { onMounted } from 'vue'

const { proxy } = getCurrentInstance()


const getImageUrl = (name) => {
  return new URL(`../assets/images/${name}.png`, import.meta.url).href
}
const tableData = ref([])
const countData = ref([])
const chartData = ref([])
const observer = ref(null)
const tableLabel = ref({
  name: "课程",
  todayBuy: "今日购买",
  monthBuy: "本月购买",
  totalBuy: "总购买",
})
const xOptions = reactive({
  // 图例文字颜色
  textStyle: {
    color: "#333",
  },
  legend: {
    top: "5%",
    left: "center",
    orient: "horizontal"
  },
  grid: {
    left: "5%",
    right: "5%",
    top: "20%",
    bottom: "10%",
    containLabel: true
  },
  // 提示框
  tooltip: {
    trigger: "axis",
  },
  xAxis: {
    type: "category", // 类目轴
    data: [],
    axisLine: {
      lineStyle: {
        color: "#17b3a3",
      },
    },
    axisLabel: {
      interval: 0,
      color: "#333",
    },
  },
  yAxis: [
    {
      type: "value",
      axisLine: {
        lineStyle: {
          color: "#17b3a3",
        },
      },
    },
  ],
  color: ["#2ec7c9", "#b6a2de", "#5ab1ef", "#ffb980", "#d87a80", "#8d98b3"],
  series: [],
})
const pieOptions = reactive({
  tooltip: {
    trigger: "item",
  },
  legend: {
    top: "2%",
    left: "center",
    orient: "horizontal",
    itemWidth: 6,
    itemHeight: 6,
    itemGap: 15,
    textStyle: {
      fontSize: 9,
      color: "#333"
    }
  },
  color: [
    "#0f78f4",
    "#dd536b",
    "#9462e5",
    "#a6a6a6",
    "#e1bb22",
    "#39c362",
    "#3ed1cf",
  ],
  series: []
})

const getTableData = async () => {
  const data = await proxy.$api.getTableData()
  tableData.value = data.tableData
}
const getCountData = async () => {
  const data = await proxy.$api.getCountData()
  countData.value = data
}
const getChartData = async () => {
  const { orderData, userData, videoData } = await proxy.$api.getChartData()
  xOptions.xAxis.data = orderData.date
  xOptions.series = Object.keys(orderData.data[0]).map(val => ({
    name: val,
    data: orderData.data.map(item => item[val]),
    type: "line"
  })
  )
  const OneEcharts = echarts.init(proxy.$refs["echart"])
  OneEcharts.setOption(xOptions)

  // 对第二个图表进行渲染
  xOptions.xAxis.data = userData.map((item) => item.date)
    xOptions.series = [
        {
          name: "新增用户",
          data: userData.map((item) => item.new),
          type: "bar",
        },
        {
          name: "活跃用户",
          data: userData.map((item) => item.active),
          type: "bar",
        }
      ]
    const TwoEcharts = echarts.init(proxy.$refs["userEchart"])
    TwoEcharts.setOption(xOptions)

    pieOptions.series = [
        {
          data: videoData,
          type: "pie",
          center: ["50%", "60%"],
          radius: ["30%", "60%"]
        },
      ]
    //three
    const ThreeEcharts = echarts.init(proxy.$refs["videoEchart"])
    ThreeEcharts.setOption(pieOptions);

    observer.value = new ResizeObserver((en) => {
        OneEcharts.resize()
        TwoEcharts.resize()
        ThreeEcharts.resize()
    })

    if (proxy.$refs["echart"]) {
      observer.value.observe(proxy.$refs["echart"]);
    }
}

onMounted(() => {
  getTableData()
  getCountData()
  getChartData()
})


</script>

<template>

  <el-row class="home" :gutter="20">
    <el-col :span="8" style="margin-top: 20px">

      <el-card shadow="hover">
        <div class="user">
          <img :src="getImageUrl('user')" class="user" />
          <div class="user-info">
            <p class="user-info-admin">Admin</p>
            <p class="user-info-p">超级管理员</p>
          </div>
        </div>
        <div class="login-info">
          <p><span>上次登录时间:</span> <span>2025-9-4</span></p>
          <p><span>上次登录的地点:</span> <span>广东</span></p>

        </div>
      </el-card>

      <el-card shadow="hover" class="user-table">

        <el-table :data="tableData">
          <el-table-column v-for="(val, key) in tableLabel" :key="key" :prop="key" :label="val">
          </el-table-column>
        </el-table>

      </el-card>

    </el-col>
    <el-col :span="16" style="margin-top: 20px">
      <div class="num">
        <el-card :body-style="{ display: 'flex', padding: 0 }" v-for="item in countData" :key="item.name">
          <component :is="item.icon" class="icon" :style="{ background: item.color }"></component>
          <div class="detail">
            <p class="num">{{ item.value }}</p>
            <p class="txt">{{ item.name }}</p>
          </div>
        </el-card>
      </div>
        <el-card class="top-echart">
          <div ref="echart" style="height: 150px;"></div>
        </el-card>
      
        <div class=" graph">
          <el-card>
            <div ref="userEchart" style="height: 190px;"></div>
            </el-card>

            <el-card>
              <div ref="videoEchart" style="height: 180px;"></div>
          </el-card>  

     
      </div>
    </el-col>
  </el-row>
</template>


<style scoped lang="less">
.home {
  height: 100%;
  overflow: hidden;

  .user {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #ccc;
    margin-bottom: 20px;

    img {
      width: 75px;
      height: 75px;
      border-radius: 50%;
      margin-right: 50px;
    }

    .user-info {
      p {
        line-height: 40px;
      }

      .user-info-p {
        font-size: 16px;
        color: #999;
      }

      .user-info-admin {
        font-size: 30px;
      }
    }
  }
}

.login-info {
  p {
    line-height: 30px;
    font-size: 13px;
    color: #999;

    span:first-child {
      display: inline-block;
      width: 120px;
    }

    span:last-child {
      color: #666;
    }
  }
}

.user-table {
  margin-top: 10px;
}

.num {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  .el-card {
    width: 30%;
    margin-bottom: 5px;
  }

  .icon {
    width: 50px;
    height: 50px;
    font-size: 10px;
    text-align: center;
    line-height: 80px;
    color: white;
  }

  .detail {
    margin-left: 15px;
    display: flex;
    flex-direction: column;
    justify-content: center;

    .num {
      font-size: 20px;
      margin-bottom: 5px;
    }

    .txt {
      font-size: 14px;
      text-align: center;
      color: #999;
    }
  }

  .top-echart {
    width: 200px;
    height: 100px;
  }
}

.graph{
  display: flex;
  margin-top: 10px;
  justify-content: space-between;
  .el-card{
    width: 45%;
  }
}
</style>
