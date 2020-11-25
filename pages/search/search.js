// pages/search/search.js
import {
  getDefaultSearch,
  getHotSearch,
  reqLikeSearch,
} from '../../utils/ajax';
const historyKey = 'searchHistoryKey';
let timer = false; //节流标识
const appInst = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    placeholderContent: '搜索音乐',
    hotList: [], //热搜榜数据
    searchContent: '', //搜索的内容
    searchList: [], //模糊查询搜索到的数据
    searchHistory: [], // 搜索的历史记录
  },
  //清空搜索的内容
  handleClear() {
    // console.log('clear调用');
    this.setData({
      searchContent: '',
      searchList: [],
    });
  },
  //清空历史记录
  clearHistory() {
    wx.showModal({
      title: '确认要删除吗？',
      success: result => {
        // console.log(result);
        if (result.confirm) {
          //如果用户点击了确定
          //将内存中的数据清空，本地存储的数据也清空
          this.setData({
            searchHistory: [],
          });
          //清空本地缓存
          wx.removeStorageSync(historyKey);
        }
      },
    });
  },

  //返回上一级页面(视频页)
  toPrevPage() {
    wx.navigateBack({
      delta: 1,
    });
  },

  async getSearchList(keyWords) {
    if (timer) {
      return;
    }
    timer = true;
    const result = await reqLikeSearch(keyWords);
    this.setData({
      searchList: result.result.songs,
    });
    setTimeout(() => {
      timer = false;
    }, 500);
  },

  //文本框搜索
  searchInp(event) {
    let content = event.detail.value.trim();
    if (!content) {
      this.setData({
        searchList: [],
        searchContent: content,
      });
      return;
    }
    this.setData({
      searchContent: content,
    });
    let { searchHistory, searchContent } = this.data;
    //如果返回true，则之前存在这个历史记录
    if (searchHistory.includes(searchContent)) {
      //将这个元素删除掉
      searchHistory.splice(searchHistory.indexOf(searchContent), 1);
    }
    //添加到前面
    searchHistory.unshift(searchContent);
    this.setData({
      searchHistory,
    });
    wx.setStorageSync(historyKey, searchHistory);
    this.getSearchList(searchContent);
    // console.log('执行了函数');
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取本地存储的历史记录,被更新数据
    this.setData({
      searchHistory: wx.getStorageSync(historyKey),
    });
    //默认搜索关键字
    this.getDefaultSearch();
  },
  //默认搜索关键字
  async getDefaultSearch() {
    const result = await getDefaultSearch();
    let placeholderContent = result.data.showKeyword;
    this.setData({
      placeholderContent,
    });
    //获取热搜榜数据
    this.getHotSearch();
  },
  //获取热搜榜数据
  async getHotSearch() {
    const res = await getHotSearch();
    let hotList = appInst.globalData.insertId(res.data);
    this.setData({
      hotList,
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
  onShareAppMessage: function () {},
});
