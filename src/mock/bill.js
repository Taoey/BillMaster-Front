import Mock from 'mockjs'
import { doCustomTimes } from '@/libs/util'
const Random = Mock.Random


// 获取账单详情
export const getBillDetail = req =>{
  req = JSON.parse(req.body)
  console.log(req)


  let result = Mock.mock({
    result:{
      "rows|0-10": [
        {
          "id|+1":0,
          "goods|+1":0,
          payNum:12,
          tags:[
            {
              name:"发票",
              color:"#255680"
            },
            {
              name:"饮食",
              color:"#c8ca8e"
            }
          ]
        }
      ]
    }
  })

  return result
}
