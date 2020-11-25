import { getCodeSomeThing, login } from '../../utils/ajax';
//获取全局app的实例对象
const app = getApp();
//userinfo本地存储key值
const { userInfoKey } = app.globalData;
Page({
  data: {
    phone: '',
    password: ''
  },

  onLoad(options) {
    let userinfo = JSON.parse(wx.getStorageSync('userinfo'));
    if (userinfo) {
      //如果用户已经登录，就跳转至主页
      wx.switchTab({
        url: '/pages/index/index',
        success: result => {},
        fail: () => {},
        complete: () => {}
      });
    }
  },

  handleInput(event) {
    // console.log(event);
    let { id: type } = event.target;
    let { value } = event.detail;
    this.setData({
      [type]: value
    });
  },
  async handleLogin(event) {
    let { password, phone } = this.data;
    //进行前端验证
    if (!phone) {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none'
      });
      return;
    }
    //验证手机号格式是否正确
    let phoneReg = /^1[3|4|5|7|8][0-9]{9}$/;
    if (!phoneReg.test(phone)) {
      //如果格式输入不正确
      wx.showToast({
        title: '手机号格式不正确',
        icon: 'none'
      });
      return;
    }
    //如果密码输入为空
    if (!password) {
      wx.showToast({
        title: '密码输入不能为空',
        icon: 'none'
      });
      return;
    }
    if (password.trim().length < 5) {
      wx.showToast({
        title: '密码最少为5位数',
        icon: 'none'
      });
      return;
    }
    //验证判断完成后，发送请求给后端进行验证
    const resData = await login({ phone, password });
    getCodeSomeThing(resData);
    //登录成功后跳转到personal页面
    if (resData.code === 200) {
      //跳转到个人中心页面
      wx.reLaunch({
        url: '/pages/personal/personal'
      });
      //本地存储(同步)
      wx.setStorageSync(userInfoKey, JSON.stringify(resData.profile));
      //将用户信息存储到全局app的global对象userinfo中
      app.globalData.userinfo = JSON.parse(wx.getStorageSync(userInfoKey));
    }
  }
});
