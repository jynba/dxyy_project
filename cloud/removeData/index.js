// 云函数入口文件
// 使用了 async await 语法
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
    try {
      return await db.collection('activity').where({
        itemRaceSystem: "个人赛"
      }).remove()
    } catch(e) {
      console.error(e)
    }
  }

