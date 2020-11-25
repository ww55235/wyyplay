// pages/recommendSong.js
import Pubsub from 'pubsub-js';
//导入请求功能函数
import { getRecommendSongList } from '../../utils/ajax.js';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    day: '',
    month: '',
    recommendList: [],
    index: 0 //歌曲下标，用于找到上一首或者下一首
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      day: new Date().getDate(),
      month: new Date().getMonth() + 1
    });
    this.getRecommendList();
    //订阅者
    Pubsub.subscribe('switchtype', (msg, type) => {
      // console.log(msg, type);
      let { recommendList, index } = this.data;
      //上一首歌曲
      if (type === 'pre') {
        if (index === 0) {
          //从后面的歌曲播放
          index = recommendList.length - 1;
        } else {
          index -= 1;
        }
      } else {
        // 下一首歌曲
        if (index < recommendList.length - 1) {
          index += 1;
        } else {
          //从前面进行播放
          index = 0;
        }
      }
      //更新index
      this.setData({
        index
      });
      // console.log(index);
      // console.log(recommendList[index]);
      //发布一个musicId事件
      Pubsub.publish('musicId', recommendList[index].id);
    });
  },

  //跳转至歌曲详情页
  toSongDetail(event) {
    // console.log(event);
    if (event.target.id === 'gengduo') {
      //点击了更多
      return;
    }
    let { song, index } = event.currentTarget.dataset;
    this.setData({
      index
    });
    //console.log(song);
    //跳转至音乐详情页面
    wx.navigateTo({
      url: '/pages/songDetail/songDetail?musicId=' + song.id
    });
  },

  //获取每日推荐数据
  async getRecommendList() {
    //获取本地存储的用户信息
    let userinfo = wx.getStorageSync('userinfo');
    // console.log(userinfo);
    if (!userinfo) {
      //如果用户没有登录
      wx.showToast({
        title: '请登录',
        icon: 'none',
        success: res => {
          //跳转至登录界面
          wx.reLaunch({
            url: '/pages/login/login'
          });
        }
      });
    }
    const data = await getRecommendSongList();
    this.setData({
      recommendList: data.recommend
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {}
});
