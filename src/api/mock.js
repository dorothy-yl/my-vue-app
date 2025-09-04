import Mock from 'mockjs';
import homeApi from './mockData/home';
Mock.mock(/home\/getTableData/, "get",homeApi.getTableData)
Mock.mock(/home\/getCountData/,"get", homeApi.getCountData)
Mock.mock(/home\/getChartData/,"get", homeApi.getChartData)

