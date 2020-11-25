let startClientY; //手指最开始的Y坐标
let moveY; //移动的距离
//获取全局app的实例对象
const app = getApp();
//userinfo本地存储key值
const { insertId } = app.globalData;
import { getRecentlyPlayList } from '../../utils/ajax.js';
import { tabBarItem } from '../../utils/navItem';
import personalContentList from '../../utils/personalContentList.js';
Page({
  data: {
    moveTransform: 'translateY(0)',
    moveTransition: '',
    userinfo: {}, //本地存储的数据
    recentlyPlayList: [],
    tabBarItem: [],
    personalContentList: []
  },
  //跳转到登录页面
  toLogin() {
    // const { userinfo } = app.globalData;
    let userinfo = wx.getStorageSync('userinfo');
    //如录户有果没用登录, 就进行跳转;
    if (!userinfo) {
      wx.navigateTo({
        url: '/pages/login/login'
      });
    } else {
      wx.showToast({
        title: '请勿重新登录',
        icon: 'none'
      });
    }
  },

  onLoad() {
    //添加一个id
    const tabItem = [...tabBarItem].map((item, index) => {
      item.id = index;
      return item;
    });
    this.setData({
      tabBarItem: tabItem,
      personalContentList: insertId(personalContentList)
    });
    //获取本地存储的数据
    wx.getStorage({
      key: 'userinfo',
      success: result => {
        if (result.data) {
          let userinfo = JSON.parse(result.data);
          //更新数据
          this.setData({
            userinfo
          });
        }
        const { userinfo } = this.data;
        // 调用获取用户最近播放记录的函数
        this.getRecentlyPlayList(userinfo.userId);
      }
    });
  },
  //获取用户播放记录
  async getRecentlyPlayList(userId) {
    const res = await getRecentlyPlayList(userId);
    //截取10条数据
    const recentlyPlayList = res.allData.slice(0, 20);
    //更新数据
    this.setData({
      recentlyPlayList: insertId(recentlyPlayList)
    });
  },

  handleStart(e) {
    this.setData({
      moveTransition: ''
    });
    startClientY = e.touches[0].clientY;
  },
  handleMove(e) {
    moveY = e.touches[0].clientY - startClientY;
    if (moveY <= 0) {
      return;
    }
    if (moveY >= 80) {
      moveY = 80;
    }
    let moveTransform = `translateY(${moveY}rpx)`;
    this.setData({
      moveTransform
    });
  },
  handleEnd(e) {
    this.setData({
      moveTransform: 'translateY(0rpx)',
      moveTransition: 'all 1s'
    });
  }
});
