<script setup>
import { ref, getCurrentInstance, onMounted, reactive } from 'vue';
const handleClick = () => {
    console.log('click')
}

const tableData = ref([])
const { proxy } = getCurrentInstance()
const getUserData = async () => {
    let data = await proxy.$api.getUserData()
    // console.log(data)
    tableData.value = data.list.map(item => {
        item.sexLabel = item.sex == 1 ? '男' : '女'
        return item
    })
}
const tableLabel = reactive([
    {
        prop: 'name',
        label: '姓名',
        width: 70,
    },
    {
        prop: 'age',
        label: '年龄',
        width: 70,

    },
    {
        prop: 'sexLabel',
        label: '性别',
        width: 70,

    },
    {
        prop: 'birth',
        label: '生日',
        width: 100,
    },
    {
        prop: 'addr',
        label: '地址',
        width: 200,
    },
])
onMounted(() => {
   getUserData()
})
</script>

<template>
    <div class="user-header">
        <el-button type="primary">+新增</el-button>
        <el-form :inline="true">
            <el-form-item label="请输入">
                <el-input placeholder="请输入用户名" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleSerch">搜索</el-button>
            </el-form-item>
        </el-form>
    </div>
    <div class="table">
        <el-table :data="tableData" style="width: 100%">
            <el-table-column v-for="item in tableLabel" :key="item.prop" :prop="item.prop"
                :width="item.width ? item.width : 125" :label="item.label" />
            <el-table-column fixed="right" label="Operations" min-width="120">
                <template #default>
                    <el-button type="primary" size="small" @click="handleClick">
                        编辑
                    </el-button>
                    <el-button type="danger" size="small">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>


<style lang="less" scoped>
.user-header {
    display: flex;
    justify-content: space-between;
}

.table {
    position: relative;
    height: 520px;

    .pager {
        position: absolute;
        right: 10px;
        bottom: 30px;
    }

    .el-table {
        width: 100%;
        height: 500px;
    }
}

.select-clearn {
    display: flex;
}
</style>
