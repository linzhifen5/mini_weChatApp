//引入数据文件
var postsData = require("../../../data/posts-data.js");
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isPlayingMusic: false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var postId = options.id;
    this.data.currentPostId = postId;
    //通过id获取数据
    var postData = postsData.postList[postId];
    //赋值详情页面的数据到前台页面
    this.setData({
      postData:postData
    })
    //查看文章是否已经保存
    var postsCollected = wx.getStorageSync('posts_collected');//所有的文章数据
    //判断是否存在记录收藏的参数
    if (postsCollected){
      var postCollected = postsCollected[postId];
      this.setData({
        collected: postCollected
      })
    }
    else{
      var postsCollected = {};
      postsCollected[postId] = false;
      wx.setStorageSync('posts_collected',postsCollected);
    }
    //全局音乐播放状态
    if (app.globalData.g_isPlayingMusic && app.globalData.g_currentMusicPostId === postId){
      this.setData({
        isPlayingMusic:true
      })
    }
    this.setMusicMonitor();
  },
  setMusicMonitor:function(){
    //监听音乐开始和暂停
    var that = this;
    wx.onBackgroundAudioPlay(function () {
      that.setData({
        isPlayingMusic: true
      });
      app.globalData.g_isPlayingMusic = true;
      app.globalData.g_currentMusicPostId = that.data.currentPostId;
    });
    wx.onBackgroundAudioPause(function () {
      that.setData({
        isPlayingMusic: false
      });
      app.globalData.g_isPlayingMusic = false;
      app.globalData.g_currentMusicPostId = null;
      
    })
  },

  //点击收藏函数
  onCollectionTap:function(event){
    var postsCollected = wx.getStorageSync('posts_collected');
    var postCollected = postsCollected[this.data.currentPostId];
    postCollected = !postCollected;
    postsCollected[this.data.currentPostId] = postCollected;
    //调用函数
    // this.showModal(postsCollected, postCollected);
    this.showToast(postsCollected, postCollected);
  },

  showToast: function (postsCollected, postCollected){
    //更新文章是否收藏的缓存值
    wx.setStorageSync('posts_collected', postsCollected);
    //更新数据绑定变量，实现切换图片
    this.setData({
      collected: postCollected
    })
    //提示收藏是否成功
    wx.showToast({
      title: postCollected?"收藏成功":"取消成功",
      duration:1000,
      icon:"successs"
    })
  },

  //实现onShareTap效果
  onShareTap:function(event){
    var itemList = [
      '分享给微信好友',
      '分享到朋友圈',
      '分享给QQ好友',
      '分享到微博'
    ]
    wx.showActionSheet({
      itemList: itemList,
      //文字颜色
      success: function (res){
        wx.showModal({
          title: '用户' + itemList[res.tapIndex],
          content: 'res.cancel '+res.cancel+'现在无法实现分享功能',
        })
      }
    })
  },

  //音乐播放
  onMusicTap:function(event){ 
    var currentPostId = this.data.currentPostId;
    var postData =  postsData.postList[currentPostId];
    var isPlayingMusic = this.data.isPlayingMusic;
    if (isPlayingMusic){
      wx.pauseBackgroundAudio();
      //赋值判断音乐图片
      this.setData({
        isPlayingMusic:false
      })
    }else{
      wx.playBackgroundAudio({
        dataUrl: postData.music.url,
        title: postData.music.title,
        coverImgUrl: postData.music.coverImg
      })
      //赋值判断音乐图片
      this.setData({
        isPlayingMusic: true
      })
    }
  }
})