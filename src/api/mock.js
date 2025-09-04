import Mock from 'mockjs';
import homeAPI from './mockData/home';
Mock.mock('/api/home/getTableData', 'get' ,homeAPI.getTableData)
    
