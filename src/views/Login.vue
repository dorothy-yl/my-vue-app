<script setup>
import { reactive, ref, onMounted, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router';
import { useAllDateStore } from '@/stores'
import { ElMessage } from 'element-plus'

const loginForm = reactive({
  username: '',
  password: '',
  code: '',      // 验证码
  uuid: ''       // 验证码uuid
});

const codeUrl = ref('')  // 验证码图片URL
const { proxy } = getCurrentInstance();
const router = useRouter()
const store = useAllDateStore()

// 获取验证码
const getCode = async () => {
// 示例：获取后端数据并渲染到页面
fetch('http://192.168.1.127:1001/captchaImage') // 请求地址
  .then(response => {
    // 第一步：检查请求是否成功（状态码 200-299 为成功）
    if (!response.ok) {
      throw new Error(`请求失败：${response.status}`);
    }
    // 第二步：解析返回数据（JSON 格式是最常用的）
    return response.json();
  })
  .then(data => {
    // 第三步：处理成功返回的数据（比如渲染到页面）
    console.log('GET 请求成功：', data);
     codeUrl.value = "data:image/gif;base64," + data.img;
    if (data.uuid) {
      loginForm.uuid = data.uuid;
    }  })
  .catch(error => {
    // 第四步：处理请求失败（网络错误、状态码错误等）
    console.error('GET 请求失败：', error);
    document.getElementById('test').innerText = '请求失败：' + error.message;
  });
}

// 页面加载时获取验证码
onMounted(() => {
  getCode();
})

const handleLogin = async () => {
  // 验证必填项
  if (!loginForm.username) {
    ElMessage.warning('请输入账号');
    return;
  }
  if (!loginForm.password) {
    ElMessage.warning('请输入密码');
    return;
  }
  if (!loginForm.code) {
    ElMessage.warning('请输入验证码');
    return;
  }
  if (!loginForm.uuid) {
    ElMessage.warning('验证码已失效，请刷新验证码');
    getCode();
    return;
  }
  console.log(loginForm)

// 示例：提交用户信息到后端
fetch('http://192.168.1.127:1001/login', {
  method: 'POST', // 指定请求方法（必填，默认 GET）
  headers: {
    'Content-Type': 'application/json', // 告诉后端数据格式是 JSON
    // 如需 token 认证，可加：'Authorization': 'Bearer ' + token
  },
  body: JSON.stringify(loginForm)
})
 .then(data => {
    console.log('POST 请求成功：', data);
   // 第一步：先判断响应状态是否成功（status 200 只是请求成功，不代表业务成功）
  if (!data.ok) {
    throw new Error('请求失败：' + data.status);
  }
  // 第二步：解析JSON格式的响应体（核心步骤）
  return data.json(); 
  }).then(data => {
  // 第三步：使用解析后的后端数据
  console.log('后端返回的完整数据：', data);
  // 示例：提取常用字段
  const { code, msg, token } = data;
  if (code === 200) {
    console.log('登录成功，token：', token);
          ElMessage.success('登录成功');
      
      // 1. 如果有 token，记得存入 store 或 localStorage
       store.setToken(data.token) 
      
      // 2. 执行路由跳转
      router.push('/home'); 
  } else {
    console.log('登录失败：', msg);
  }
})
}
</script>


<template>
  <div class="body-login">
    <el-form :model="loginForm" class="login-container">
      <h3>欢迎登录</h3>

      <el-form-item>
        <el-input type="input" placeholder="请输入账号" v-model="loginForm.username">
        </el-input>
      </el-form-item>

      <el-form-item>
        <el-input type="password" placeholder="请输入密码" v-model="loginForm.password">
        </el-input>
      </el-form-item>

      <el-form-item>
        <div class="login-code-wrapper">
          <el-input 
            v-model="loginForm.code" 
            placeholder="请输入验证码"
            class="login-code-input"
            maxlength="4"
          />
          <div class="login-code-img-wrapper"  title="点击刷新验证码">
            <div class="login-code-placeholder">
            <img :src="codeUrl" class="login-code-img" @click="getCode" />
            点击获取验证码</div>
          </div>
        </div>
      </el-form-item>
      
      <el-form-item>
        <el-button type="primary" @click="handleLogin" style="width: 100%;"> 登录 </el-button>
      </el-form-item>

    </el-form>
  </div>
</template>




<style lang="less" scoped>
.body-login {
  background-image: url('../assets/images/background.png');
  background-size: 100%;
  height: 100%;
  width: 100%;
  overflow: hidden;
}

.login-container {
  width: 350px;
  background-color: #fff;
  border: 1px solid #eaeaea;
  border-radius: 15px;
  padding: 35px 35px 15px 35px;
  box-shadow: 0 0 25px #cacaca;
  margin: 180px auto;

  h3 {
    text-align: center;
    margin-bottom: 20px;
    color: #505450;
  }

  :deep(.el-form-item__content) {
    justify-content: center;
  }

  .login-code-wrapper {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
  }

  .login-code-input {
    flex: 1;
  }

  .login-code-img-wrapper {
    width: 120px;
    height: 40px;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f5f7fa;
    transition: all 0.3s;

    &:hover {
      border-color: #409eff;
    }
  }

  .login-code-img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .login-code-placeholder {
    color: #909399;
    font-size: 12px;
    text-align: center;
  }
}
</style>
