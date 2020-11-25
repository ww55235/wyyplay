//app.js

//给数组中的每一个对象添加一个id的属性方法
function insertId(param) {
  //如果是一个数组
  if (Array.isArray(param)) {
    return param.map((item, index) => {
      item.id = index;
      return item;
    });
  }
}

App({
  onLaunch: function () {},
  //全局数据
  globalData: {
    userInfoKey: 'userinfo',
    insertId,
    userinfo: null,
    musicPlay: false,
    musicId: ''
  }
});
