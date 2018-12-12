//获取本地数据库数据
var postsData = require("../../data/posts-data.js");

Page({
  // 页面的初始数据
  data: {
    /**
     * 小程序总是会读取data对象来做数据绑定
     * 但是读取data对象之前先执行onLoad事件
    */
  },
  //生命周期函数--监听页面加载
  onLoad: function () {
    //将数组对象赋值到前端
    this.setData({
      //由于posts_content是一个值，所以必须要添加一个键，故设置一个键“posts_key”
      posts_key: postsData.postList,
    });
  },
  //event是框架给于的事件对象，currentTarget表示当前鼠标点击的数据位置，dataset所有自定义数据的集合，postId就是我们自己指定的id值
  onPostTap:function(event){
    var postId = event.currentTarget.dataset.postid;
    // 实现跳转页面
    wx.navigateTo({
      url: 'post-detail/post-detail?id=' + postId,
    })
  },
  //轮播图跳转
  onSwiperTap: function (event) {
    var postId = event.target.dataset.postid;
    // 实现跳转页面
    wx.navigateTo({
      url: 'post-detail/post-detail?id=' + postId,
    })
  }
})