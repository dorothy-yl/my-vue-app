<script setup>
import { ref, getCurrentInstance, onMounted, reactive, nextTick } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
const handleClick = () => {
    console.log('click')
}

const tableData = ref([])
const { proxy } = getCurrentInstance()
// 登录方式选项列表
const loginMethodOptions = [
    { label: '国内-手机号', value: '国内-手机号' },
    { label: '国内-apple登录', value: '国内-apple登录' },
    { label: '国内-邮箱', value: '国内-邮箱' },
    { label: '国内-微信', value: '国内-微信' },
    { label: '国内-i console(扫码)', value: '国内-i console(扫码)' },
    { label: '国内-i console(iconsole账号)', value: '国内-i console(iconsole账号)' },
    { label: '国外-邮箱', value: '国外-邮箱' },
    { label: '国外-apple登录', value: '国外-apple登录' },
    { label: '国外-Google', value: '国外-Google' },
    { label: '国外-Facebook', value: '国外-Facebook' },
    { label: '国外-i console(扫码)', value: '国外-i console(扫码)' },
    { label: '国外-i console(iconsole账号)', value: '国外-i console(iconsole账号)' }
]

// 格式化登录方式显示（从"国内-手机号"格式中提取"手机号"）
const formatLoginMethod = (loginMethod) => {
    if (!loginMethod) return ''
    const parts = loginMethod.split('-')
    if (parts.length > 1) {
        return parts.slice(1).join('-')
    }
    return loginMethod
}

const getUserData = async () => {
    let data = await proxy.$api.getUserData(config)
    // console.log(data)
    tableData.value = data.list.map(item => ({
        ...item,
        sexLabel: item.sex === 1 ? '男' : '女',
        loginMethodLabel: formatLoginMethod(item.loginMethod)
    }))
    config.total = data.count
}
const tableLabel = reactive([
    {
        prop: 'name',
        label: '姓名',
        width: 70,
    },
    {
        prop: 'sexLabel',
        label: '性别',
        width: 70,

    },
    {
        prop: 'height',
        label: '身高',
        width: 80,
    },
    {
        prop: 'weight',
        label: '体重',
        width: 80,
    },
    {
        prop: 'loginMethodLabel',
        label: '登录方式',
        width: 120,
    },
    {
        prop: 'birth',
        label: '生日',
        width: 100,
    },
    {
        prop: 'addr',
        label: '地址',
        width: 300,
    },
])
const formInline = reactive({
    keyword: ''
})
const config = reactive({
    name: '',
    total: 1000,
    page: 1
})
const handleSerch = () => {
    config.name = formInline.keyword
    getUserData()
}
const changePage = (page) => {
    config.page = page
    getUserData()
}
const handleAdd = () => {
    action.value = 'add'
    dialogVisible.value = true
    // 初始化表单数据
    Object.assign(formUser, {
        name: '',
        sex: '',
        height: '',
        weight: '',
        loginMethod: '',
        birth: '',
        addr: ''
    })
}

const handleClose = () => {
    dialogVisible.value = false
    // 重置表单数据
    Object.assign(formUser, {
        name: '',
        sex: '',
        height: '',
        weight: '',
        loginMethod: '',
        birth: '',
        addr: ''
    })
    // 清除表单验证
    if (userForm.value) {
        userForm.value.clearValidate()
    }
}

const handleCancel = () => {
    handleClose()
}

const onSubmit = async () => {
    // 表单验证
    if (!userForm.value) return
    await userForm.value.validate(async (valid) => {
        if (valid) {
            try {
                if (action.value === 'add') {
                    // 新增用户
                    await proxy.$api.addUser(formUser)
                    ElMessage({
                        type: 'success',
                        message: '新增成功',
                        showClose: true,
                    })
                } else {
                    // 编辑用户
                    await proxy.$api.editUser(formUser)
                    ElMessage({
                        type: 'success',
                        message: '编辑成功',
                        showClose: true,
                    })
                }
                // 关闭对话框并刷新数据
                handleClose()
                getUserData()
            } catch (error) {
                ElMessage({
                    type: 'error',
                    message: '操作失败',
                    showClose: true,
                })
            }
        } else {
            ElMessage({
                type: 'error',
                message: '请填写完整信息',
                showClose: true,
            })
        }
    })
}

const handleDelete = (val) => {
    ElMessageBox.confirm('你确定删除吗？').then(async () => {
        await proxy.$api.deleteUser({ id: val.id })
        ElMessage({
            type: 'success',
            message: '删除成功',
            showClose: true,
        })
        getUserData()
    })
}
const action = ref('add')
const dialogVisible = ref(false)
const formUser = reactive({})
const userForm = ref(null)
const rules = reactive({
    //表单校验规则
    name: [{ required: true, message: "姓名是必填项", trigger: "blur" }],
    sex: [{ required: true, message: "性别是必选项", trigger: "change" }],
    height: [
        { required: true, message: "身高是必填项", trigger: "blur" },
        { type: "number", min: 50, max: 250, message: "身高必须在50-250cm之间", trigger: "blur" },
    ],
    weight: [
        { required: true, message: "体重是必填项", trigger: "blur" },
        { type: "number", min: 20, max: 200, message: "体重必须在20-200kg之间", trigger: "blur" },
    ],
    loginMethod: [{ required: true, message: "登录方式是必选项", trigger: "change" }],
    birth: [{ required: true, message: "出生日期是必选项" }],
    addr: [{ required: true, message: '地址是必填项' }]
})
const handleEdit = (val) => {
    action.value = 'edit'
    dialogVisible.value = true
    nextTick(() => {
        Object.assign(formUser, { ...val, sex: '' + val.sex })
    })
}
onMounted(() => {
    getUserData()
})
</script>

<template>
    <div class="user-header">
        <el-button type="primary" @click="handleAdd">新增</el-button>
        <el-form :inline="true" :model="formInline">
            <el-form-item label="请输入">
                <el-input v-model="formInline.keyword" placeholder="请输入用户名" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleSerch">搜索</el-button>
            </el-form-item>
        </el-form>
    </div>

    <div class="table">
        <el-table :data="tableData" style="width: 100%">
            <template v-for="item in tableLabel" :key="item.prop">
                <el-table-column v-if="item.prop === 'height'" :prop="item.prop"
                    :width="item.width ? item.width : 125" :label="item.label">
                    <template #default="scope">
                        <span>{{ scope.row.height }} cm</span>
                    </template>
                </el-table-column>
                <el-table-column v-else-if="item.prop === 'weight'" :prop="item.prop"
                    :width="item.width ? item.width : 125" :label="item.label">
                    <template #default="scope">
                        <span>{{ scope.row.weight }} kg</span>
                    </template>
                </el-table-column>
                <el-table-column v-else :prop="item.prop"
                    :width="item.width ? item.width : 125" :label="item.label" />
            </template>
            <el-table-column fixed="right" label="Operations" min-width="120">
                <template #="scope">
                    <el-button type="primary" size="small" @click="handleEdit(scope.row)">
                        编辑
                    </el-button>
                    <el-button type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination size="small" background layout="prev, pager, next" :total="config.total"
            @current-change="changePage" class="pager" />
    </div>
    <el-dialog v-model="dialogVisible" :title="action == 'add' ? '新增用户' : '编辑用户'" width="35%"
        :before-close="handleClose">
        <!--需要注意的是设置了:inline="true"，
		会对el-select的样式造成影响，我们通过给他设置一个class=select-clearn
		在css进行处理-->
        <el-form :inline="true" :model="formUser" :rules="rules" ref="userForm">
            <el-row>
                <el-col :span="12">
                    <el-form-item label="姓名" prop="name">
                        <el-input v-model="formUser.name" placeholder="请输入姓名" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item class="select-clearn" label="性别" prop="sex">
                        <el-select v-model="formUser.sex" placeholder="请选择">
                            <el-option label="男" value="1" />
                            <el-option label="女" value="0" />
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="身高" prop="height">
                        <el-input-number v-model.number="formUser.height" :min="50" :max="250" :precision="0" placeholder="请输入身高" style="width: 100%" />
                        <span style="margin-left: 8px; color: #909399;">cm</span>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="体重" prop="weight">
                        <el-input-number v-model.number="formUser.weight" :min="20" :max="200" :precision="1" placeholder="请输入体重" style="width: 100%" />
                        <span style="margin-left: 8px; color: #909399;">kg</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item class="select-clearn" label="登录方式" prop="loginMethod">
                        <el-select v-model="formUser.loginMethod" placeholder="请选择登录方式" style="width: 100%">
                            <el-option v-for="option in loginMethodOptions" :key="option.value" :label="option.label" :value="option.value" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="出生日期" prop="birth">
                        <el-date-picker v-model="formUser.birth" type="date" placeholder="请输入" style="width: 100%" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-form-item label="地址" prop="addr">
                    <el-input v-model="formUser.addr" placeholder="请输入地址" />
                </el-form-item>
            </el-row>
            <el-row style="justify-content: flex-end">
                <el-form-item>
                    <el-button type="primary" @click="handleCancel">取消</el-button>
                    <el-button type="primary" @click="onSubmit">确定</el-button>
                </el-form-item>
            </el-row>
        </el-form>
    </el-dialog>
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
