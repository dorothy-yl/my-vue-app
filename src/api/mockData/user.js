import Mock from 'mockjs'
// get请求从config.url获取参数，post从config.body中获取参数
function param2Obj(url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' +
    decodeURIComponent(search)
      .replace(/"/g, '\\"')
      .replace(/&/g, '","')
      .replace(/=/g, '":"') +
    '"}'
  )
}

let List = []
const count = 200

// 登录方式选项列表
const loginMethodList = [
  '国内-手机号',
  '国内-apple登录',
  '国内-邮箱',
  '国内-微信',
  '国内-i console(扫码)',
  '国内-i console(iconsole账号)',
  '国外-邮箱',
  '国外-apple登录',
  '国外-Google',
  '国外-Facebook',
  '国外-i console(扫码)',
  '国外-i console(iconsole账号)'
]

//模拟200条用户数据
for (let i = 0; i < count; i++) {
  const height = Mock.Random.integer(50, 250)
  const weight = (Mock.Random.float(20, 200, 1, 1)).toFixed(1) // 生成20.0-200.0的体重，保留1位小数
  List.push(
    Mock.mock({
      id: Mock.Random.guid(),
      name: Mock.Random.cname(),
      addr: Mock.mock('@county(true)'),
      height: height,
      weight: parseFloat(weight),
      birth: Mock.Random.date(),
      sex: Mock.Random.integer(0, 1),
      loginMethod: loginMethodList[Mock.Random.integer(0, loginMethodList.length - 1)]
    })
  )
}


export default {
  /**
   * 获取列表
   * 要带参数 name, page, limt; name可以不填, page,limit有默认值。
   * @param name, page, limit
   * @return {{code: number, count: number, data: *[]}}
   */
  getUserList: config => {
    //limit默认是10，因为分页器默认也是一页10个
    const { name, page = 1, limit = 10 } = param2Obj(config.url)

    const mockList = List.filter(user => {
      //如果name存在会，根据name筛选数据
      if (name && user.name.indexOf(name) === -1) return false
      return true
    })
    //分页
    const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))
    return {
      code: 200,
      data: {
        list: pageList,
        count: mockList.length, //数据总条数需要返回
      }
    }
  },

  /**
   * 删除用户
   * @param id
   * @return {*}
   */
  deleteUser: config => {
    const { id } = param2Obj(config.url)

    if (!id) {
      return {
        code: -999,
        message: '参数不正确'
      }
    } else {
      List = List.filter(u => u.id !== id)
      return {
        code: 200,
        message: '删除成功'
      }
    }
  },

  /**
   * 新增用户
   * @param name, addr, height, weight, loginMethod, birth, sex
   * @return {{code: number, data: {message: string}}}
   */
  createUser: config => {
    const { name, addr, height, weight, loginMethod, birth, sex } = JSON.parse(config.body)
    const sex_num = parseInt(sex)
    const newUser = {
      id: Mock.Random.guid(),
      name: name,
      addr: addr,
      height: height,
      weight: weight,
      loginMethod: loginMethod,
      birth: birth,
      sex: sex_num
    }
    List.unshift(newUser) // 添加到列表开头
    return {
      code: 200,
      data: {
        message: '新增成功'
      }
    }
  },

  /**
   * 修改用户
   * @param id, name, addr, height, weight, loginMethod, birth, sex
   * @return {{code: number, data: {message: string}}}
   */
  updateUser: config => {
    const { id, name, addr, height, weight, loginMethod, birth, sex } = JSON.parse(config.body)
    const sex_num = parseInt(sex)
    List.some(u => {
      if (u.id === id) {
        u.name = name
        u.addr = addr
        u.height = height
        u.weight = weight
        u.loginMethod = loginMethod
        u.birth = birth
        u.sex = sex_num
        return true
      }
    })
    return {
      code: 200,
      data: {
        message: '编辑成功'
      }
    }
  }
}
