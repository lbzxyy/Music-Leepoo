// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数 初始化数据库
const db = cloud.database()


const rp = require('request-promise')

const URL = 'http://musicapi.xiecheng.live/personalized'

const playlistCollection = db.collection('playlist')

const Max_LIMIT = 100 // 一次最多从数据库读取的数量 （目前云函数这边是100，小程序是20）




// 云函数入口函数
exports.main = async (event, context) => {
 // 获取数据库总数对象
 const countResult = await playlistCollection.count()
 // 总数
 const total = countResult.total
 // 需要读取的次数
 const batchTimes = Math.ceil(total/Max_LIMIT)
 // 任务数组 promise
 const tasks = []
 // 遍历读取次数 放入promise任务
 for( let i = 0; i<batchTimes; i++) {
   let promise = playlistCollection.skip(i*Max_LIMIT).limit(Max_LIMIT).get()
   tasks.push(promise)
 }
 // 定义返回的数据结构
 let list = {
   data: []
 }
 if(tasks.length>0) {
   list = (await Promise.all(tasks)).reduce((acc, cur) => {
     return {
       data: acc.data.concat(cur.data)
     }
   })
 }
 const playlist = await rp(URL).then(res => {
  return JSON.parse(res).result
})

 const newData = []
 for(let i = 0, len1 = playlist.length; i<len1; i++) {
   let flag = true
   for(let j = 0, len2 = list.data.length; j<len2; j++) {
     if(playlist[i].id === list.data[j].id) {
       flag = false
       break
     }
   }
   if(flag) {
     newData.push(playlist[i])
   }
 }


 console.log(playlist,'playlist')
 for (let i = 0, len = newData.length; i < len; i++) {
  await playlistCollection.add({
    data: {
      ...newData[i],
      createTime: db.serverDate(),
    }
  }).then((res) => {
    console.log('插入成功')
  }).catch((err) => {
    console.error('插入失败')
  })
}

}