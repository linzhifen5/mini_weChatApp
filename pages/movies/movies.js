//加载评星公共函数
var util = require('../../utils/util.js');
var app = getApp();
Page({
  data:{
    inTheaters:{},
    comingSoon:{},
    top250:{},
    containerShow: false,
    searchPanelShow: true,
  },
  onLoad:function(event){
    var inTheatersUrl = app.globalData.doubanBase + '/v2/movie/in_theaters' + '?start=0&count=3';//正在热映
    var comingSoonUrl = app.globalData.doubanBase + '/v2/movie/coming_soon' + '?start=0&count=3';//即将上映
    var top250Url = app.globalData.doubanBase + '/v2/movie/top250' + '?start=0&count=3';//top排行
    
    this.getMovieListData(inTheatersUrl,"inTheaters","正在热映");
    this.getMovieListData(comingSoonUrl,"comingSoon","即将上映");
    this.getMovieListData(top250Url,"top250","豆瓣TOP250");    
  },

  //调用豆瓣数据函数
  getMovieListData: function (url,settedKey,categoryTitle) {
    var that = this;
    wx.request({
      url: url,
      header: {
        "Content-Type": "json"
      },
      data: '',
      method: 'GET',
      success: function (res) {
        that.processDoubanData(res.data,settedKey,categoryTitle);
      },
      fail: function () {
        console.log("调用失败")
      }
    })
  },
  
  //整理获取到的豆瓣数据为数组数据
  processDoubanData: function (moviesDouban, settedKey, categoryTitle){
    //由于通过url获取的数据无法实现只获取前三个，所以在这里进行处理
    var moviesDouban = moviesDouban.subjects.slice(0,3);
    var movies=[];//记录数据  
    for(var idx in moviesDouban){
      var subject = moviesDouban[idx];
      var title = subject.title;
      if(title.length >= 6){
        title = title.substring(0,6) + '…';
      }
      var temp={
        stars:util.convertToStarsArray(subject.rating.stars),//里面的相当获取的星星数量
        title:title,
        average:subject.rating.average,
        coverageUrl:subject.images.large,
        movieId:subject.id
      }
      movies.push(temp);//将数据添加到 movies数组
    }
    var readyData = {};
    // console.log(categoryTitle);
    readyData[settedKey] = {
      categoryTitle:categoryTitle,//数据绑定电影的分类
      movies:movies
    };
    this.setData(readyData);
  },

  //点击进入更多
  onMoreTap:function(event){
    var category = event.currentTarget.dataset.category;
    wx.navigateTo({ 
      url: './more-movie/more-movie?category=' + category
    })
  },

  //获取焦点事件
  onBindFocus:function(event){
    //数据绑定
    this.setData({
      containerShow: true,
      searchPanelShow: false,
    })
  },

  //获取输入框中的内容
  onBindChange: function (event) {
    var text = event.detail.value;
    var searchUrl = app.globalData.doubanBase + '/v2/movie/search?q=' + text;
    this.getMovieListData(searchUrl, "searchResult", "");
  },

  //点击×图退出
  onCancelImgeTap: function(event){
    this.setData({
      containerShow: false,
      searchPanelShow: true,
      searchResult: {}  //清空绑定数据
    })
  },

  //点击跳转详情页面
  onMovieTap:function(event){
    var movieId =   event.currentTarget.dataset.movieid;
    wx.navigateTo({
      url: 'movie-detail/movie-detail?movieId=' + movieId,
    })
  }
})