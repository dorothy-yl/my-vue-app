import Mock from 'mockjs'

// 存储验证码的内存对象，key为uuid，value为验证码
const captchaStore = {}

export default {
  // 获取验证码
  getCaptcha: config => {
    // 生成一个随机的uuid
    const uuid = Mock.Random.guid()
    // 生成一个4位随机验证码（用于测试，实际应该返回图片）
    const code = Mock.Random.string('number', 4)
    // 存储验证码到内存中，用于后续验证
    captchaStore[uuid] = code
    
    // 这里应该返回验证码图片的base64或URL，以及uuid
    // 为了简化，我们返回一个SVG格式的验证码图片（base64）
    const svg = `<svg width="120" height="40" xmlns="http://www.w3.org/2000/svg">
      <rect width="120" height="40" fill="#f0f0f0"/>
      <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" 
            font-size="20" font-weight="bold" fill="#333">${code}</text>
    </svg>`
    // 直接返回完整的 data URL，包含前缀
    const imageBase64 = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)))
    
    return {
      code: 200,
      data: {
        uuid: uuid,
        img: imageBase64,  // 返回完整的 data URL
        captchaEnabled: true  // 验证码是否启用
      }
    }
  },
  getMenu: config => {
    const { username, password, code, uuid } = JSON.parse(config.body)
    
    // 先验证验证码
    if (!code || !uuid) {
      return {
        code: 200,
        msg: '验证码不能为空'
      }
    }
    
    // 从内存中获取存储的验证码
    const storedCode = captchaStore[uuid]
    
    // 验证验证码是否存在和是否正确
    if (!storedCode) {
      return {
        code: 500,
        msg: '验证码已失效'
      }
    }
    
    if (storedCode !== code) {
      // 验证码错误，删除该验证码
      delete captchaStore[uuid]
      return {
        code: 500,
        msg: '验证码错误'
      }
    }
    
    // 验证码正确，删除已使用的验证码
    delete captchaStore[uuid]
    
    // 验证用户名和密码
    //menuList用于后面做权限分配，也就是用户可以展示的菜单
    if (username === 'admin' && password === 'admin') {
      return {
        code: 200,
        data: {
          menuList: [
            {
              path: '/home',
              name: 'home',
              label: '首页',
              icon: 'house',
              url: 'Home'
            },
            {
              path: '/dashboard',
              name: 'dashboard',
              label: '视频管理',
              icon: 'data-analysis',
              url: 'Dashboard'
            },
            {
              path: 'course',
              label: '课程管理',
              icon: 'video-play',
              children: [
                {
                  path: '/course/editor',
                  name: 'courseEditor',
                  label: '课程编辑',
                  icon: 'edit',
                  url: 'CourseEditor'
                }
              ]
            },
            {
              path: '/mall',
              name: 'mall',
              label: '商品管理',
              icon: 'shopping-cart',
              url: 'Mall'
            },
            {
              path: '/user',
              name: 'user',
              label: '用户管理',
              icon: 'user',
              url: 'User'
            },
            {
              path: '/user/center',
              name: 'userCenter',
              label: '用户中心',
              icon: 'user-filled',
              url: 'UserCenter'
            },
            {
              path: 'other',
              label: '其他',
              icon: 'location',
              children: [
                {
                  path: '/page1',
                  name: 'page1',
                  label: '页面1',
                  icon: 'setting',
                  url: 'Page1'
                },
                {
                  path: '/page2',
                  name: 'page2',
                  label: '页面2',
                  icon: 'setting',
                  url: 'Page2'
                }
              ]
            }
          ],
          token: Mock.Random.guid(),
          message: '获取成功'
        }
      }
    } else if (username === 'admin' && password === 'admin123') {
      return {
        code: 200,
        data: {
          menuList: [
            {
              path: '/home',
              name: 'home',
              label: '首页',
              icon: 'house',
              url: 'Home'
            },
            {
              path: '/dashboard',
              name: 'dashboard',
              label: '视频管理',
              icon: 'data-analysis',
              url: 'Dashboard'
            },
            {
              path: '/user',
              name: 'user',
              label: '用户管理',
              icon: 'user',
              url: 'User'
            },
            {
              path: '/user/center',
              name: 'userCenter',
              label: '个人中心',
              icon: 'user-filled',
              url: 'UserCenter'
            }
          ],
          token: Mock.Random.guid(),
          message: '获取成功'
        }
      }
    } else {
      return {
        code: 500,
        msg: '用户名或密码错误'
      }
    }

  }
}
