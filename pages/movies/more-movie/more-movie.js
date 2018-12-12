// pages/movies/more-movie/more-movie.js
//引人util文件
var app = getApp();
var util = require('../../../utils/util.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    navigateTitle:"",
    movies:{},
    requestUrl:"",
    totalCount:0,
    isEmpty:"true",
  },
  onLoad:function(options){
    var category = options.category;//获取传来的数据
    this.data.navigateTitle = category;
    var dataUrl = "";
    switch(category){ //根据获取的标题名称获取不同的url
      case "正在热映":
        var dataUrl = app.globalData.doubanBase + "/v2/movie/in_theaters";
        break;
      case "即将上映":
        var dataUrl = app.globalData.doubanBase + "/v2/movie/coming_soon";
        break;
      case "豆瓣TOP250":
        var dataUrl = app.globalData.doubanBase + "/v2/movie/in_theaters";
        break;
    }
    //赋值到data
    this.data.requestUrl=dataUrl;
    util.http(dataUrl, this.processDoubanData);
  },

  //下滑刷新
  // onScrollLower:function(event){
  //   // console.log("加载更多");
  //   var nextUrl = this.data.requestUrl+"?start="+this.data.totalCount+"&count=20";
  //   util.http(nextUrl,this.processDoubanData)
  //   //加载数据的时候添加加载效果
  //   wx.showNavigationBarLoading();//加载显示
  // },


  /**
   * 页面上拉触底事件的处理函数
   */
  //解决下拉刷新 https://zhuanlan.zhihu.com/p/24739728
  onReachBottom: function (event) {
    // console.log("加载更多");
    var nextUrl = this.data.requestUrl + "?start=" + this.data.totalCount + "&count=20";
    util.http(nextUrl, this.processDoubanData)
    //加载数据的时候添加加载效果
    wx.showNavigationBarLoading();//加载显示
  },

  //上滑重新加载
  onPullDownRefresh:function(){
    var refreshUrl = this.data.requestUrl+"?start=0"+"count=20";
    util.http(refreshUrl,this.processDoubanData);
    ws.showNavigationBarLoading();//显示加载
    //重置防止加载20条以上数据
    isEmpty = "false";
  },

  processDoubanData:function(moviesDouban){
    var movies = [];
    for(var idx in moviesDouban.subjects){
      var subject = moviesDouban.subjects[idx];
      var title = subject.title;
      if(title.length >= 6){
        title = title.substring(0,6) + "...";
      }
      var temp = {
        stars:util.convertToStarsArray(subject.rating.stars),
        title:title,
        coverageUrl:subject.images.large,
        movieId:subject.id
      }
      movies.push(temp);
    }
    var totalMovies={}//新老数据
    this.data.totalCount += 20;
    wx.hideNavigationBarLoading();//隐藏加载效果
    //改变下拉初始数据
    if(!this.data.isEmpty){
      totalMovies = this.data.movies.concat(movies);//concat合并函数，将前面的数据和加载的数据合并
    }else{
      totalMovies = movies;
      this.data.isEmpty = false;
    }
    this.setData({
      movies: totalMovies
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.setNavigationBarTitle({
      title: this.data.navigateTitle,
    })
  },

  //点击跳转详情页面
  onMovieTap: function (event) {
    var movieId = event.currentTarget.dataset.movieid;
    wx.navigateTo({
      url: '../movie-detail/movie-detail?movieId=' + movieId,
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})