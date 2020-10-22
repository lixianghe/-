const sha256 = require('../utils/sha256.js');
const config = require('../utils/config.js');
const option = require('../utils/httpOpt/httpOpt.js')

const getData = (key, query) => {
  return new Promise((resolve, reject) => {
    if (option.api === 0) {
      resolve(option.showData[key])
    } else if(option.api === 1) {
      wx.request({
        url: option.url[key].url,
        method: option.url[key].method,
        data: query,
        success: function(res) {
          let result = option.formation[key](res.data)
          resolve(result)
        },
        fail: function (err) {
          let res = {
            err: `数据请求失败,将为您展示静态数据`,
            data: option.showData[key]
          }
          reject(res)
        }
      })
    }
  })
}





function HTTPGET(requestHandler) {
  request('GET', requestHandler);
}

function HTTPPOST(requestHandler) {
  request('POST', requestHandler);
}

// errorCode 为1 时，当前无网络
function request(method, requestHandler) {
  if (!getApp().globalData.isNetConnected) {
    const res = {
      message: "请检查网络连接",
      retcode: 2
    };
    if (typeof requestHandler.fail === "function") {
      requestHandler.fail(res);
    }
    if (typeof requestHandler.complete === "function") {
      requestHandler.complete(2);
    }
    // wx.showToast({
    //   title: '网络异常，请稍后再试',
    // });
  } else {
    // 注意：可以对params加密等处理
    // let data = requestHandler.data;
    const url = requestHandler.url;

    const query = {
      charset: 'utf-8',
      clientInfo: 'Xiaomi',
      data: requestHandler.data ? requestHandler.data : {},
      partnerId: config.id,
      signType: 'sha256',
      timestamp: parseInt(new Date().getTime() / 1000),
      // 登陆Token
      token: '95020983a91f13b026c58475f9017f5c45611080520183ecccbaf5f8c4a7c7ea',
      // 用户ID
      userId: 10001
    };
    // 获取签名
    query.sign = getsign(query);
    if(url.indexOf("searchCategoryList")!=-1){
      getApp().log(`${JSON.stringify(query)}----请求参数，api路径----${url}` )
    }
    // getApp().log(`${JSON.stringify(query)}----请求参数，api路径----${url}` )
    console.log(JSON.stringify(query), `----请求参数，api路径----${url}`);
    let header = {
      "content-type": "application/json"
    };
    if (requestHandler.header) {
      header = requestHandler.header;
    }
    wx.request({
      url: url,
      data: query,
      header: header,
      method: method,
      success: function (res) {
        // getApp().log(`${JSON.stringify(res.data)}----返回参数----` )
        console.log(res.data, "-------返回参数------------------------");
        if (res.data["retcode"] == 0) {
          if (typeof requestHandler.success === "function") {
            requestHandler.success(res.data);
          }
          if (typeof requestHandler.complete === "function") {
            requestHandler.complete(res.data ? 0 : 1);
          }
        } else if(res.data["retcode"] >= 500){
          if (typeof requestHandler.fail === "function") {
            requestHandler.fail(res.data);
          }
          if (typeof requestHandler.complete === "function") {
            requestHandler.complete(3);
          }
        }else{
          wx.showToast({
            title: res.data.retmsg,
          })
          if (typeof requestHandler.fail === "function") {
            requestHandler.fail(res.data);
          }
          if (typeof requestHandler.complete === "function") {
            requestHandler.complete(1);
          }
        }
      },
      fail: function (res) {
        console.log(res)
        if (typeof requestHandler.fail === "function") {
          if(res.data){
            requestHandler.fail(res.data);
          }else{
            requestHandler.fail(res);
          }
        }
        if (typeof requestHandler.complete === "function") {
          requestHandler.complete(2);
        }
        if(url.indexOf("searchCategoryList")!=-1){
          getApp().log(`${JSON.stringify(res)}----请求失败----` )
        }
      },
    });
  }
}

/**
 * 签名
 */
function getsign(param, partnerData) {
  const data = {};
  for (const key in param) {
    data[key] = param[key];
  }
  // 设置排序 a-z
  function sortHandle(obj) {
    const arr = [];
    for (const key in obj) {
      arr.push(key);
    }
    arr.sort();
    const newObj = {};
    for (const index in arr) {
      newObj[arr[index]] = obj[arr[index]];
    }
    return JSON.stringify(newObj);
  }
  data.data = sortHandle(data.data);
  // 拼接字符串
  let str = '';
  str += `charset=${data.charset}`;
  str += `&clientInfo=${data.clientInfo}`;
  str += `&data=${data.data}`;
  // KEY
  str += `&key=${config.key}`;
  str += `&partnerId=${config.id}`;
  str += `&signType=${data.signType}`;
  str += `&timestamp=${data.timestamp}`;
  str += `&token=${data.token}`;
  str += `&userId=${data.userId}`;
  // console.log('sign--->', str)
  return sha256(str);
}

module.exports = {
  HTTPGET: HTTPGET,
  HTTPPOST: HTTPPOST,
  getData: getData
};