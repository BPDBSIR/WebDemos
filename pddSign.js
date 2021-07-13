
/* 导入其他js模块 */
const md5 = require("./md")

let params = {
  data_type: "JSON",
  client_id: "123456789",
  access_token: "4456djkf5a47",
  type: "pdd.order.number.list.get",
  timestamp: "1480411125",
}

let keys = Object.keys(params).sort();
let cacheStr = ""

keys.forEach((value, index, array) => {
  cacheStr += value + params[value]
})
let clientSecret = "testSecret"

console.log(cacheStr)
console.log(md5.hexMD5(clientSecret + cacheStr + clientSecret).toUpperCase())
