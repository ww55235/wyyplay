import { getVideoNavList, getVideoList } from '../../utils/ajax';

import videoLists from '../../utils/videoList';

const { insertId } = getApp().globalData;
Page({
  data: {
    videoNavList: [], //视频导航栏数据
    navId: 0, //选中的标识
    videoList: [], //视频数据
    videoId: '',
    videoUpdateTime: [],
    isTriggered: false,
  },
  onLoad() {
    //获取视频页滚动导航条数据
    this.getVideoNavList();
  },

  refresherrefresh() {
    //刷新数据
    let navId = this.data.navId;
    this.getVideoList(navId);
  },

  hanldeToLower() {
    let { videoList } = this.data;
    videoList.push(...videoLists);
    //更新数据
    this.setData({
      videoList,
    });
  },

  updateTime(event) {
    let vid = event.currentTarget.id;
    let playTime = event.detail.currentTime;
    let videoUpdateTimeObj = {
      vid,
      playTime,
    };
    let { videoUpdateTime } = this.data;
    //判断之前数组中是否存在，表示之前是否播放过
    let item = videoUpdateTime.find(item => item.vid === vid);
    //如果存在，代表之前播放过
    if (item) {
      //更新对象
      item.playTime = event.detail.currentTime;
    } else {
      videoUpdateTime.push(videoUpdateTimeObj);
    }
    //更新数据
    this.setData({
      videoUpdateTime,
    });
  },
  videoPlay(event) {
    // console.log(event);
    let vid = event.currentTarget.id;
    //this.vid !== vid && this.videoContext && this.videoContext.stop();
    //this.vid = vid;
    this.setData({
      videoId: vid,
    });
    this.videoContext = wx.createVideoContext(vid);
    let { videoUpdateTime } = this.data;
    let item = videoUpdateTime.find(item => item.vid === vid);
    if (item) {
      this.videoContext.seek(item.playTime);
    }
    //播放视频
    this.videoContext.play();
  },
  //视频播放结束
  handleEnded(event) {
    let vid = event.currentTarget.id;
    let { videoUpdateTime } = this.data;
    //获取下标
    let index = videoUpdateTime.findIndex(item => item.vid === vid);
    //删除数组元素
    videoUpdateTime.splice(index, 1);
    // 更新数据
    this.setData({
      videoUpdateTime,
    });
  },

  //获取对应视频页的数据
  async getVideoList(id) {
    const res = await getVideoList(id);
    //隐藏提示框
    wx.hideLoading();
    this.setData({
      videoList: insertId([...res.datas]),
      isTriggered: false,
    });
  },

  async getVideoNavList() {
    const res = await getVideoNavList();
    this.setData({
      //截取20条数据
      videoNavList: res.data.slice(0, 20),
      navId: res.data[0].id,
    });
    //获取对用视频页的数据
    this.getVideoList(this.data.navId);
  },
  navHandle(event) {
    const navId = event.currentTarget.dataset.navid;
    //获取对应得数据
    this.setData({
      navId,
      videoList: [], //清空之前的数据
    });
    //显示提示框
    wx.showLoading({
      title: '加载中',
    });
    //每点击一次就发送一次请求获取对应的数据
    this.getVideoList(navId);
  },
  //监听子组件注册过来的事件
  toSearchPage() {
    //跳转至search页面
    wx.navigateTo({
      url: '/pages/search/search',
    });
  },
});
