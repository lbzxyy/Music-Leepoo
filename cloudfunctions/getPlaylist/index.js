// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const rp = require('request-promise')

const URL = 'http://musicapi.xiecheng.live/personalized'

// 云函数 初始化数据库
const db = cloud.database()



// 云函数入口函数
exports.main = async (event, context) => {
 const playlist = await rp(URL).then(res => {
   return JSON.parse(res).result
 })
 console.log(playlist,'playlist')
 for (let i = 0, len = playlist.length; i < len; i++) {
  await playlistCollection.add({
    data: {
      ...playlist[i],
      createTime: db.serverDate(),
    }
  }).then((res) => {
    console.log('插入成功')
  }).catch((err) => {
    console.error('插入失败')
  })
}

}