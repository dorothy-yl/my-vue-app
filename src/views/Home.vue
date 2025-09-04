<script setup>
import { ref, getCurrentInstance, onMounted } from 'vue';
const { proxy } = getCurrentInstance()


const getImageUrl = (name) => {
  return new URL(`../assets/images/${name}.png`, import.meta.url).href
}
const tableData = ref([
  {
    name: "Java",
    todayBuy: 100,
    monthBuy: 200,
    totalBuy: 300,
  },
  {
    name: "Python",
    todayBuy: 100,
    monthBuy: 200,
    totalBuy: 300,
  }
])

const tableLabel = ref({
  name: "课程",
  todayBuy: "今日购买",
  monthBuy: "本月购买",
  totalBuy: "总购买",
})
const getTableData = async () => {
  const data = await proxy.$api.getTableData()
  tableData.value = data.tableData
}
onMounted(() => {
  getTableData()
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
          <p><span>上次登录时间:</span> <span>2022-7-11</span></p>
          <p><span>上次登录的地点:</span> <span>北京</span></p>

        </div>
      </el-card>

      <el-card shadow="hover" class="user-table">

        <el-table :data="tableData">
          <el-table-column v-for="(val, key) in tableLabel" :key="key" :prop="key" :label="val">
          </el-table-column>
        </el-table>

      </el-card>

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
  margin-top: 20px;
}
</style>
