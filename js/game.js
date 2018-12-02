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
      $('#audioFalse')[0].play()
      if ($('.j-toothItem').children().length === 0) {
        _this.endGame()
      } else {
        $('.j-toothItem').children().first().remove();       
      } 
    } else {
      $('#audioTrue')[0].play()
      var scoreData = {
        monster1: 10,
        monster2: 15,
        monster3: 20
      }
      var score = 10
      if (_html.hasClass('monster1')) {
        _this.score += scoreData.monster1
        score = scoreData.monster1
      } else if (_html.hasClass('monster2')) {
        _this.score += scoreData.monster2
        score = scoreData.monster2
      } else {
        _this.score += scoreData.monster3
        score = scoreData.monster3
      }
      _html.closest('.hole').after('<span class="score">' + score + '</span>')      
      var string = _html.closest('.hole').prop("className") 
      var curHole = string.replace(/[^\d]/g,"")
      var _score = $('.score')
      _score.addClass('hole' + curHole)
      _score.animate({'left': '1.602rem', 'top': '.25rem', 'opacity': '0'}, 800)
      $('.j-numTotal').text(_this.score)
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
    _this.interId = setInterval(function() {_this.showMouse()}, _this.timeSpeed)
    $('.j-numTotal').text(_this.score)
  },
  endGame: function () {
    var _this = this
    $('.cell').html('')
    clearInterval(_this.interId)    
    $('.j-endGame').show()  
    _this.start = false
    _this.replayGame()
  },
  replayGame: function () {
    var _this = this
    $('.j-replayBtn').click(function () {
      $('.j-endGame').hide()
      $('.j-numTotal').text('0')
      _this.start = false
      _this.score = 0
      $('.j-toothItem').html('<div class="teeth"></div><div class="teeth"></div><div class="teeth"></div>')
      _this.startGame()
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
    $('.j-toolBrush').click(function() {
      $('.j-selectedTool').remove()
      var selectedHtml = '<img src="img/selected.png"  class="img selectedTool j-selectedTool">'
      $(this).append(selectedHtml) 
    })
    $('.j-closeRule').click(function () {
      $('.j-rule').hide()
    })
    $('.j-sureBtn').click(function () {
      var curTool = $('.j-selectedTool').siblings('.curTool')
      $('.j-pg2').show()
      $('.j-pg1').hide()
      _this.toolBrush = curTool.length === 0 ? '<img src="img/blueTool.png" class="img curTool">' : curTool
      $('.j-toolBox').html(_this.toolBrush)
      _this.startGame()
    }) 
  }
}
new game()


document.addEventListener('DOMContentLoaded', function () {
  function audioAutoPlay() {
      document.addEventListener("WeixinJSBridgeReady", function () {      
        var audio = document.getElementById('audio');
        audio.pause()
      }, false);
  }
  audioAutoPlay();
}); 