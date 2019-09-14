import Mock from 'mockjs'
import { login, logout, getUserInfo } from './login'
import { getTableData, getDragList } from './data'

import {getBillDetail, getTags} from './bill'

import global from '@/js/global.js' //加载全局变量

const domain = global.MOCK_URL  //设置mock域名

// 登录相关和获取用户信息
Mock.mock(/\/login/, login)
Mock.mock(/\/get_info/, getUserInfo)
Mock.mock(/\/logout/, logout)
Mock.mock(/\/get_table_data/, getTableData)
Mock.mock(/\/get_drag_list/, getDragList)
Mock.mock(/\/save_error_logger/, 'success')

//账单详情信息
Mock.mock(`${domain}/alibill/list.json`,'post',getBillDetail)

Mock.mock(`${domain}/tags/list.json`,'post',getTags)





export default Mock
