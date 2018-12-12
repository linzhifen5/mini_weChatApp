const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime
}

//将豆瓣的星星函数转化为[1,1,1,0,0]的格式的公共函数
function convertToStarsArray(stars){
  var num = stars.toString().substring(0,1);//先转化字符串，然后选取字符的第一个数字
  var array = [];
  for(var i=1;i<=5;i++){
    if(i<=num){
      array.push(1);//假如i小于提取出的数字那么就为1
    }
    else{
      array.push(0);//反之就为0
    }
  }
  return array;
}

//调用电影数据的公共函数
function http(url,callBack) {
  wx.request({
    url: url,
    method:'GET',
    header:{
      "Content-Type":""
    },
    success:function(res){
      callBack(res.data);//如果成功就调用前面的more-movie.js的callBack()方法
    },
    fail:function(error){
      console.log("数据调取失败");
    }
  })
}

//演员名称斜杠拼接
function convertToCastString(casts){
  var castsjoin = "";
  for(var idx in casts){
    castsjoin = castsjoin + casts[idx].name + "/";
  }
  return castsjoin.substring(0,castsjoin.length-2);
}

//演员图片排列为数组
function convertToCastInfos(casts){
  var castsArray = []
  for(var idx in casts){
    var cast = {
      img: casts[idx].avatars?casts[idx].avatars.large:"",
      name: casts[idx].name
    }
    castsArray.push(cast);
  }
  return castsArray;
}

//输出值
module.exports={
  convertToStarsArray: convertToStarsArray,
  http: http,
  convertToCastString: convertToCastString,
  convertToCastInfos: convertToCastInfos
}
