import request from './request.js';

//获取首页banner数据
export const getIndexBanner = type => request('/banner', { type });

//获取首页推荐歌曲数据
export const getRecommendList = limit => request('/personalized', { limit });

//获取音乐排行榜请求

export const getTopList = idx => request('/top/list', { idx });

//登录请求函数

/**
 * @param { phone:string,password:string}
 
 */
export const login = ({ phone, password }) =>
  request('/login/cellphone', { phone, password, isLogin: true });

//请求后做一定的处理，判断code值
export const getCodeSomeThing = data => {
  switch (data.code) {
    case 200:
      wx.showToast({
        title: '登录成功',
        icon: 'success'
      });
      break;
    case 501:
      wx.showToast({
        title: '账号不正确',
        icon: 'none'
      });
      break;
    case 502:
      wx.showToast({
        title: '密码不正确',
        icon: 'none'
      });
      break;
    default:
      wx.showToast({
        title: '登录失败，请重新登录',
        icon: 'none'
      });
      break;
  }
};

//获取用户播放记录 type=0默认获取用户所有播放记录  type=1获取用户最近一周的播放记录

export const getRecentlyPlayList = (uid, type = 0) =>
  request('/user/record', { uid, type });

//获取视频页滚动导航条数据
export const getVideoNavList = () => request('/video/group/list');

//获取对应视频页数据

export const getVideoList = id => request('/video/group', { id });

//获取每日推荐数据
export const getRecommendSongList = () => request('/recommend/songs');

//获取音乐详情

export const getMusicDetail = ids => request('/song/detail', { ids });

//获取歌曲播放地址
export const getSongUrl = id => request('/song/url', { id });

//默认搜索关键字接口
export const getDefaultSearch = () => request('/search/default');
//热搜榜接口

export const getHotSearch = () => request('/search/hot/detail');

//获取模糊搜索的数据
export const reqLikeSearch = keywords =>
  request('/search', { keywords, limit: 10 });
