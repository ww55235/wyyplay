import config from './config.js';
const COOKIESKEY = 'cookies';
export default function request(url, data = {}, methods = 'get') {
  methods = methods.toUpperCase();
  //返回一个promise
  return new Promise((resolve, reject) => {
    wx.request({
      url: config.host + url,
      // url: config.modileHost + url,
      data,
      header: {
        cookie: wx.getStorageSync(COOKIESKEY)
          ? wx
              .getStorageSync(COOKIESKEY)
              .find(item => item.startsWith('MUSIC_U'))
          : ''
      },
      success(res) {
        //如果是登录操作，就把cookies存储到本地
        if (data.isLogin) {
          // console.log(res);
          //将cookies存储到本地
          wx.setStorage({
            key: COOKIESKEY,
            data: res.cookies
          });
        }
        resolve(res.data);
      },
      methods,
      fail(err) {
        reject(err);
      }
    });
  });
}
