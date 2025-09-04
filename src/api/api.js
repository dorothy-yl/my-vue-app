/**
 * 整个项目的同一管理 
*/
import request from './request';

export default {
    getTableData () {
        return request({
            url: '/api/home/getTableData',
            method: 'get'
        })
    }
}