(function (doc, win) {
  var docEl = doc.documentElement, 
  recalc = function () {
          var clientWidth = win.screen.width > 414 ? 414 : docEl.clientWidth;
          if (!clientWidth) return;
          docEl.style.fontSize = 100 * (clientWidth / 750) + 'px';
  };
  if (!doc.addEventListener) return;
  win.addEventListener('resize', recalc, false);
  doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);

document.onreadystatechange = function () {
    if (document.readyState === "complete") { 
      $(".loading").fadeOut();
    }
}
function game() {
  this.start = true;
  this.score = 0; 
  this.timeId2 = null;
  this.interId = null;
  this.timeSpeed = 6000;
  this.times = 100; // 差值倍速
  this.toolBrush = '' // 牙刷颜色
  this.initTimes = 0 // 初始倍速
  this.othersEvent()
  this.getAuthorize()
}
game.prototype = {
  constructor: game,
  showMouse: function () {
    var _this = this; 
    if (_this.start) {     
      // clearTimeout(_this.timeId2)
      var badNum = _this.getRandom(0, 7);
 
      for (var i = 0; i < badNum; i++) {
         
        (function($, _this){
          var randomCellBad = _this.getRandom(0, 8)
          var randomMonster = _this.getRandom(1, 3); 
          if($('.cell' + randomCellBad ).html() === '') {
            $('.cell' + randomCellBad ).append('<img src="img/monster' + randomMonster + '.gif"  class="img monster j-bad monster'+ randomMonster +'">')
            $(".monster" + randomMonster).animate({"margin-top":"0rem"})
            _this.notEnoughtTime()
          } else {
            $('.cell' + randomCellBad ).find(".monster").animate({"margin-top": "2rem"},function(){
              $('.cell' + randomCellBad ).html('')
              $('.cell' + randomCellBad ).append('<img src="img/monster' + randomMonster + '.gif"  class="img monster j-bad monster'+ randomMonster +'">')
              $(".monster" + randomMonster).animate({"margin-top":"0rem"})
              _this.clickEvent()
              _this.notEnoughtTime()
            }); 
          }

        })($, _this)

      }
      var goodNum = _this.getRandom(0, 4);
      for (var i = 0; i < goodNum; i++) {
        var randomCellGood = _this.getRandom(0, 8)
        if($('.cell' + randomCellGood ).html() === '') {
          $('.cell' + randomCellGood ).append('<img src="img/monster0.png"  class="img monster j-good monster0">')
          $(".monster0").animate({"margin-top":"0rem"})
          _this.notEnoughtTime()
        } else {
          $('.cell' + randomCellGood ).find(".monster").animate({"margin-top": "2rem"},function(){
            $('.cell' + randomCellGood ).html('')
            $('.cell' + randomCellGood ).append('<img src="img/monster0.png"  class="img monster j-good monster0">')
            $(".monster0").animate({"margin-top":"0rem"})
            _this.clickEvent()
            _this.notEnoughtTime()
          }); 
        }
      }
      _this.clickEvent()
    }
   
  },
  notEnoughtTime() {
    var badLength = $('.j-bad').length
    if (badLength >=5 && badLength <=7) {
      $('.j-good').attr('src', 'img/goodLeve2.png')
    } else if (badLength > 7) {
      $('.j-good').attr('src', 'img/goodLeve3.png')
    } else if (badLength < 5) {
      $('.j-good').attr('src', 'img/monster0.png')
    } 
  },
  clickEvent: function () {
    var _this = this    
    $('.monster').off('click').on('click', function(e){
      var toolBox = $('.j-toolBox')
      var x = e.clientX
      var y = e.clientY
      var curBong = $('.bong');
      var that = $(this)
      curBong.removeClass('bong')
      toolBox.animate({'left': x + 'px', 'top': y + 'px'}, 50, function() {
        toolBox.find('.img').addClass('bong')
        that.animate({"margin-top":"2rem"},function () {
          that.remove() 
          _this.notEnoughtTime()
          var badLength = $('.j-bad').length
          if (badLength === 0) {
            _this.showMouse()
          }
        })
      })      
      _this.scoreCount(that)      
    })
    
  },
  /**
   * 计算分数
   * @param {string} item // 当前dom
   */
  scoreCount: function (_html) {
    var _this = this
    if (_html.hasClass('monster0')) {
      $('#audioFalse')[0].currentTime = 0
      $('#audioFalse')[0].play()
      if ($('.j-toothItem').children().length === 0) {
        _this.endGame()
      } else {
        $('.j-toothItem').children().first().remove();       
      } 
    } else {
      $('#audioTrue')[0].currentTime = 0.1
      $('#audioTrue')[0].play()
      var scoreData = {
        monster1: 10,
        monster2: 15,
        monster3: 20
      }
      var score = 10
      if (_html.hasClass('monster1')) {
        score = scoreData.monster1
      } else if (_html.hasClass('monster2')) {
        score = scoreData.monster2
      } else {
        score = scoreData.monster3
      }
      _html.closest('.hole').after('<span class="score">' + score + '</span>')      
      var string = _html.closest('.hole').prop("className") 
      var curHole = string.replace(/[^\d]/g,"")
      var _score = $('.score')
      _score.addClass('hole' + curHole)
      _score.animate({'left': '1rem', 'top': '-4.5rem', 'opacity': '0'}, 800, function() {
        _this.score += score
        $('.j-numTotal').text(_this.score)
      })
      _this.changeSpeed(_this.score)
      setTimeout(function (){
        _score.remove()
      }, 600)
    }
  },
  /**
   * 以100为基础 增加速度
   * @param {Number} score 
   */
  changeSpeed: function (score) {
    var _this = this
    var curTimes = parseInt(score / _this.times);    
    if (curTimes > _this.initTimes) {
      _this.showMouse()
      clearInterval(_this.interId)      
      _this.initTimes = curTimes
      var timeSpeed = _this.timeSpeed - _this.initTimes * _this.times
      _this.interId = setInterval(function() {_this.showMouse()}, timeSpeed) 
    }
    
  },
  getRandom: function (from, to) {
    return Math.floor(Math.random() * (to - from + 1)) + from
  },
  startGame: function () {
    var _this = this;   
    _this.start = true;
    _this.audioEvent()
    _this.showMouse()    
    var mouthWrap = document.getElementById("j-mouthWrap");
    // 动画结束时事件
    mouthWrap.addEventListener("webkitAnimationEnd", function() {
      $('#j-mouthWrap div').show()
    })
    _this.interId = setInterval(function() {_this.showMouse()}, _this.timeSpeed)
    $('.j-numTotal').text(_this.score)
  },
  // 结束游戏
  endGame: function () {
    var _this = this
    $('.cell').html('')
    clearInterval(_this.interId)    
    $('.j-endGame').show()  
    _this.start = false
    _this.saveScore()
    _this.replayGame()

  },
  replayGame: function () {
    var _this = this
    $('.j-replayBtn').click(function () {
      var mouthWrap = $('#j-mouthWrap')
      $('.j-endGame').hide()
      $('.j-numTotal').text('0')
      mouthWrap.removeClass('mouthWrap')
      mouthWrap.find('div').hide()
      _this.start = false
      _this.score = 0
      $('.j-toothItem').html('<div class="teeth"></div><div class="teeth"></div><div class="teeth"></div>')
      _this.startGame()
      $(".j-toolBox").removeAttr("style");
      mouthWrap.addClass('mouthWrap')      
    })
  },
  audioEvent: function () {
    var _this = this
    var audio = document.getElementById('audio');
    var audioBtn =  $('.j-audioBtn');
    audioBtn.css('opacity', '1')
    audio.volume = 0.5
    audio.play()
    audioBtn.addClass('rotate')
    audioBtn.off('click').on('click', function () {
      var that = $(this)
      if (that.hasClass('rotate')) {
        that.removeClass('rotate')
        audio.pause(); 
      } else {
        that.addClass('rotate')
        audio.play();
      }
    })
    audio.volume = 0.3;
  },
  /**
   * 集中jq显示隐藏页面
   */
  othersEvent: function () {
    var _this = this
    $('.j-beginBtn').click(function () {
      $('.j-tool').show()
    })
    $('.j-ruleBtn').click(function () {
      $('.j-rule').show()
    })
    $('.j-rankBtn').click(function () {
      $('.rank').show()
      _this.getToplist()
    })
    $('.j-toolBrush').click(function() {
      $('.j-selectedTool').remove()
      var selectedHtml = '<img src="img/selected.png"  class="img selectedTool j-selectedTool">'
      $(this).append(selectedHtml) 
    })
    $('.j-closeRule').click(function () {
      $('.j-rule, .rank').hide()
    })
    $('.j-sureBtn').click(function () {
      var curTool = $('.j-selectedTool').siblings('.curTool')
      $('.j-pg2').show()
      $('.j-pg1').hide()
      _this.toolBrush = curTool.length === 0 ? '<img src="img/blueTool.png" class="img curTool">' : curTool
      $('.j-toolBox').html(_this.toolBrush)
      _this.startGame()
    }) 
  },
  getAuthorize: function () {
    if (document.cookie.length <=0) return false
    $.ajax({
      url: '/wechat/authorize',
      type: "get",
      success: function(res) {

      },
      error: function(res) {
        console.log(res)
      }
    });
  },
  // 获取排名列表
  getToplist: function () {
    $.ajax({
      url: '/api/result/toplist',
      type: "post",
      success: function(res) {
        if (res.code === 0) {
          if (res.data.length > 0) {
            var _html = '' 
            res.data.filter((item,index) => {
              var userMsg = parseInt(item.value)
              _html += '<div class="rankListItem">'+
                          '<div class="userMsg">'+
                            '<img src="' + userMsg.headimgurl +'">'+
                            '<span class="userName">'+ userMsg.nickname +'</span>'+
                            '<span class="userScore">' + item.score +'</span>'+
                          '</div>'+
                          '<div class="rankNum">'+ (index+1) +'</div>'+
                        '</div>'
            })
            $('.j-rankList').html(_html)
          } else {
            $('.j-rankList').html('<div class="noRankList">暂无排名</div>')
          }
        } else {
          alert(res.msg)
        }
      },
      error: function(res) {
        console.log(res)
      }
    });    
  },
  // 保存分数
  saveScore: function () {
    var _this = this
    $.ajax({
      url: '/api/result/save',
      type: "post",
      data: {score: parseInt(_this.score)},
      success: function(res) {
        if (res.code === 0) {
          console.log(res.msg)
        } else {
          alert(res.msg)
        }
      },
      error: function(res) {
        console.log(res)
      }
    });     
  }  
}
new game()

wxShare = function(){
  try{
		var appid;
		var signature;
		var nonceStr;
		var timestamp;
		var url = document.location.href;
		var geturl = "/api/wechat/initjssdk";
		$.getJSON(geturl,{url:url},function(json){
			signature = json.signature;
			appid = json.appId;
			timestamp = json.timestamp;
			nonceStr = json.nonceStr;
			wx.config({
				debug: false,
				appId: appid,
				timestamp: timestamp,
				nonceStr: nonceStr,
				signature: signature,
				jsApiList: ['checkJsApi','onMenuShareTimeline','onMenuShareAppMessage','onMenuShareQQ','onMenuShareWeibo','hideMenuItems','startRecord','stopRecord','translateVoice','playVoice','uploadVoice','downloadVoice','chooseImage','previewImage','uploadImage','downloadImage']
			});
		})
    var imgUrl = "img/share.jpg"; // 这个貌似要个绝对地址
    var lineLink = "http://toothgame.ckdcloud.com/"; // 点击分享后跳转的页面地址
    var descContent = "每天刷牙我健康"; // 分享后的描述信息
    var shareTitle = "牙齿保卫战"; // 分享后的标题
    wx.ready(function(){
      document.getElementById("audio").pause(); 
      wx.onMenuShareAppMessage({
        title: shareTitle,
        desc: descContent,
        link: lineLink,
        imgUrl: imgUrl,
        trigger: function(res){},
        success: function(res){ 
        },
        cancel: function(res){},
        fail: function(res){}
      });
      wx.onMenuShareTimeline({
        title: shareTitle,
        link: lineLink,
        imgUrl: imgUrl,
        trigger: function(res){},
        success: function(res){ 
        },
        cancel: function(res){},
        fail: function(res){}
      });
      wx.onMenuShareQQ({
        title: shareTitle,
        desc: descContent,
        link: lineLink,
        imgUrl: imgUrl,
        trigger: function(res){},
        success: function(res){
 
        },
        cancel: function(res){},
        fail: function(res){}
      });
      wx.onMenuShareWeibo({
        title: shareTitle,
        desc: descContent,
        link: lineLink,
        imgUrl: imgUrl,
        trigger: function(res){},
        success: function(res){ 
        },
        cancel: function(res){},
        fail: function(res){}
      });
      wx.hideMenuItems({
        menuList: [
        ],
        success: function (res) {
        //alert('已隐藏“阅读模式”，“分享到朋友圈”，“复制链接”等按钮');
        },
        fail: function (res) {
        //alert(JSON.stringify(res));
        }
      });
    });
  }catch(e){
    alert(e);
  }
}
wxShare();
window.alert = function(name){
  var iframe = document.createElement("IFRAME");
 iframe.style.display="none";
 iframe.setAttribute("src", 'data:text/plain,');
 document.documentElement.appendChild(iframe);
 window.frames[0].window.alert(name);
 iframe.parentNode.removeChild(iframe);
 }