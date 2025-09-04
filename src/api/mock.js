import Mock from 'mockjs';
import homeApi from './mockData/home';
import userApi from './mockData/user';
Mock.mock(/home\/getTableData/, "get",homeApi.getTableData)
Mock.mock(/home\/getCountData/,"get", homeApi.getCountData)
Mock.mock(/home\/getChartData/,"get", homeApi.getChartData)
Mock.mock(/user\/getUserData/,"get", userApi.getUserList)

