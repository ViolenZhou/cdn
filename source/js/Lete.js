/*添加图片top*/
// 判断移动端设备
browserRedirect();

function browserRedirect() {
    var sUserAgent = navigator.userAgent.toLowerCase();
    var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
    var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
    var bIsMidp = sUserAgent.match(/midp/i) == "midp";
    var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
    var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
    var bIsAndroid = sUserAgent.match(/android/i) == "android";
    var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
    var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
    if (!(bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM)) {
        var top_up = "";
        /*添加到返回顶部按钮下*/
        document.getElementById("go-up").innerHTML += top_up;
    }
}

// 可爱的Title
var OriginTitle = document.title;
var titleTime;
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        $('[rel="icon"]').attr('href', "/img/favicon.png");
        document.title = '(＃°Д°)！！ 页面崩溃啦！！';
        clearTimeout(titleTime);
    } else {
        $('[rel="icon"]').attr('href', "/img/favicon.png");
        document.title = '(*´∇｀*) 噫~又好啦~~' + OriginTitle;
        titleTime = setTimeout(function() {
            document.title = OriginTitle;
        }, 2000);
    }
});
// 移除页脚样式
var app = document.getElementById('footer');
app.removeAttribute('id')

// 设置页脚博主
$(document).ready(function(e) {
  // 自己的请自行更改
  var since = 2021;
  var name = 'Violen';
  var now = new Date();
  var nowYear = now.getFullYear();
  since = since == nowYear?since:since+" - "+nowYear;
  $('.copyright').html('©'+since+'  <i style="color:#FF6A6A;animation: announ_animation 0.8s linear infinite;"  class="fa fa-heartbeat"></i>  '+name);
});


// 鼠标礼花特效
class Circle {
  constructor({ origin, speed, color, angle, context }) {
    this.origin = origin
    this.position = { ...this.origin }
    this.color = color
    this.speed = speed
    this.angle = angle
    this.context = context
    this.renderCount = 0
  }

  draw() {
    this.context.fillStyle = this.color
    this.context.beginPath()
    this.context.arc(this.position.x, this.position.y, 2, 0, Math.PI * 2)
    this.context.fill()
  }

  move() {
    this.position.x = (Math.sin(this.angle) * this.speed) + this.position.x
    this.position.y = (Math.cos(this.angle) * this.speed) + this.position.y + (this.renderCount * 0.3)
    this.renderCount++
  }
}

class Boom {
  constructor ({ origin, context, circleCount = 16, area }) {
    this.origin = origin
    this.context = context
    this.circleCount = circleCount
    this.area = area
    this.stop = false
    this.circles = []
  }

  randomArray(range) {
    const length = range.length
    const randomIndex = Math.floor(length * Math.random())
    return range[randomIndex]
  }

  randomColor() {
    const range = ['8', '9', 'A', 'B', 'C', 'D', 'E', 'F']
    return '#' + this.randomArray(range) + this.randomArray(range) + this.randomArray(range) + this.randomArray(range) + this.randomArray(range) + this.randomArray(range)
  }

  randomRange(start, end) {
    return (end - start) * Math.random() + start
  }

  init() {
    for(let i = 0; i < this.circleCount; i++) {
      const circle = new Circle({
        context: this.context,
        origin: this.origin,
        color: this.randomColor(),
        angle: this.randomRange(Math.PI - 1, Math.PI + 1),
        speed: this.randomRange(1, 6)
      })
      this.circles.push(circle)
    }
  }

  move() {
    this.circles.forEach((circle, index) => {
      if (circle.position.x > this.area.width || circle.position.y > this.area.height) {
        return this.circles.splice(index, 1)
      }
      circle.move()
    })
    if (this.circles.length == 0) {
      this.stop = true
    }
  }

  draw() {
    this.circles.forEach(circle => circle.draw())
  }
}

class CursorSpecialEffects {
  constructor() {
    this.computerCanvas = document.createElement('canvas')
    this.renderCanvas = document.createElement('canvas')

    this.computerContext = this.computerCanvas.getContext('2d')
    this.renderContext = this.renderCanvas.getContext('2d')

    this.globalWidth = window.innerWidth
    this.globalHeight = window.innerHeight

    this.booms = []
    this.running = false
  }

  handleMouseDown(e) {
    const boom = new Boom({
      origin: { x: e.clientX, y: e.clientY },
      context: this.computerContext,
      area: {
        width: this.globalWidth,
        height: this.globalHeight
      }
    })
    boom.init()
    this.booms.push(boom)
    this.running || this.run()
  }

  handlePageHide() {
    this.booms = []
    this.running = false
  }

  init() {
    const style = this.renderCanvas.style
    style.position = 'fixed'
    style.top = style.left = 0
    style.zIndex = '999999999999999999999999999999999999999999'
    style.pointerEvents = 'none'

    style.width = this.renderCanvas.width = this.computerCanvas.width = this.globalWidth
    style.height = this.renderCanvas.height = this.computerCanvas.height = this.globalHeight

    document.body.append(this.renderCanvas)

    window.addEventListener('mousedown', this.handleMouseDown.bind(this))
    window.addEventListener('pagehide', this.handlePageHide.bind(this))
  }

  run() {
    this.running = true
    if (this.booms.length == 0) {
      return this.running = false
    }

    requestAnimationFrame(this.run.bind(this))

    this.computerContext.clearRect(0, 0, this.globalWidth, this.globalHeight)
    this.renderContext.clearRect(0, 0, this.globalWidth, this.globalHeight)

    this.booms.forEach((boom, index) => {
      if (boom.stop) {
        return this.booms.splice(index, 1)
      }
      boom.move()
      boom.draw()
    })
    this.renderContext.drawImage(this.computerCanvas, 0, 0, this.globalWidth, this.globalHeight)
  }
}

const cursorSpecialEffects = new CursorSpecialEffects()
cursorSpecialEffects.init()

//气泡

$(function() {

  // 气泡
  function bubble() {
      $('#page-header').circleMagic({
          radius: 10,
          density: .2,
          color: 'rgba(255,255,255,.4)',
          clearOffset: 0.99
      });
  }! function(p) {
      p.fn.circleMagic = function(t) {
          var o, a, n, r, e = !0,
              i = [],
              d = p.extend({ color: "rgba(255,0,0,.5)", radius: 10, density: .3, clearOffset: .2 }, t),
              l = this[0];

          function c() { e = !(document.body.scrollTop > a) }

          function s() { o = l.clientWidth, a = l.clientHeight, l.height = a + "px", n.width = o, n.height = a }

          function h() {
              if (e)
                  for (var t in r.clearRect(0, 0, o, a), i) i[t].draw();
              requestAnimationFrame(h)
          }

          function f() {
              var t = this;

              function e() { t.pos.x = Math.random() * o, t.pos.y = a + 100 * Math.random(), t.alpha = .1 + Math.random() * d.clearOffset, t.scale = .1 + .3 * Math.random(), t.speed = Math.random(), "random" === d.color ? t.color = "rgba(" + Math.floor(255 * Math.random()) + ", " + Math.floor(0 * Math.random()) + ", " + Math.floor(0 * Math.random()) + ", " + Math.random().toPrecision(2) + ")" : t.color = d.color }
              t.pos = {}, e(), this.draw = function() { t.alpha <= 0 && e(), t.pos.y -= t.speed, t.alpha -= 5e-4, r.beginPath(), r.arc(t.pos.x, t.pos.y, t.scale * d.radius, 0, 2 * Math.PI, !1), r.fillStyle = t.color, r.fill(), r.closePath() }
          }! function() {
              o = l.offsetWidth, a = l.offsetHeight,
                  function() {
                      var t = document.createElement("canvas");
                      t.id = "canvas", t.style.top = 0, t.style.zIndex = 0, t.style.position = "absolute", l.appendChild(t), t.parentElement.style.overflow = "hidden"
                  }(), (n = document.getElementById("canvas")).width = o, n.height = a, r = n.getContext("2d");
              for (var t = 0; t < o * d.density; t++) {
                  var e = new f;
                  i.push(e)
              }
              h()
          }(), window.addEventListener("scroll", c, !1), window.addEventListener("resize", s, !1)
      }
  }(jQuery);

  // 调用气泡方法
  bubble();
})


// 气泡
// function qipao() {
//     $('#page-header').circleMagic({
//         radius: 10,
//         density: .2,
//         color: 'rgba(255,255,255,.4)',
//         clearOffset: 0.99
//     });
// }!function(a){a.fn.circleMagic=function(y){var g,x,j,b,u=!0,m=[],v=a.extend({color:"rgba(255,0,0,.5)",radius:10,density:0.3,clearOffset:0.2},y),k=this[0];function w(){u=!(document.body.scrollTop>x)}function z(){g=k.clientWidth,x=k.clientHeight,k.height=x+"px",j.width=g,j.height=x}function p(){if(u){for(var c in b.clearRect(0,0,g,x),m){m[c].draw()}}requestAnimationFrame(p)}function q(){var c=this;function d(){c.pos.x=Math.random()*g,c.pos.y=x+100*Math.random(),c.alpha=0.1+Math.random()*v.clearOffset,c.scale=0.1+0.3*Math.random(),c.speed=Math.random(),"random"===v.color?c.color="rgba("+Math.floor(255*Math.random())+", "+Math.floor(0*Math.random())+", "+Math.floor(0*Math.random())+", "+Math.random().toPrecision(2)+")":c.color=v.color}c.pos={},d(),this.draw=function(){c.alpha<=0&&d(),c.pos.y-=c.speed,c.alpha-=0.0005,b.beginPath(),b.arc(c.pos.x,c.pos.y,c.scale*v.radius,0,2*Math.PI,!1),b.fillStyle=c.color,b.fill(),b.closePath()}}!function(){g=k.offsetWidth,x=k.offsetHeight,function(){var e=document.createElement("canvas");e.id="canvas",e.style.top=0,e.style.zIndex=0,e.style.position="absolute",k.appendChild(e),e.parentElement.style.overflow="hidden"}(),(j=document.getElementById("canvas")).width=g,j.height=x,b=j.getContext("2d");for(var c=0;c<g*v.density;c++){var d=new q;m.push(d)}p()}(),window.addEventListener("scroll",w,!1),window.addEventListener("resize",z,!1)}}(jQuery);
// qipao()

// var sUserAgent = navigator.userAgent.toLowerCase();
// var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
// var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
// var bIsMidp = sUserAgent.match(/midp/i) == "midp";
// var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
// var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
// var bIsAndroid = sUserAgent.match(/android/i) == "android";
// var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
// var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
// if (!(bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM)) {
//     // 判断 header里是否存在full_page
//     if($("#page-header").hasClass("full_page")||$("#page-header").hasClass("not-home-page")){
//       // 插入<video>
//       var html = "<video id='video' muted loop autoplay style='height: 100%;width: 100%;object-fit: cover;'></video>";
//       document.getElementsByClassName("full_page")[0].innerHTML += html;
//       // 随机数
//       var randomNum = Math.floor((Math.random() * 15)+1);
//       // 获取 <video>
//       var video = document.getElementById('video');
//       // 插入视频(m3u8)
//       var videoSrc = 'https://cdn.jsdelivr.net/gh/lete114/CDN2/video/'+randomNum+'.m3u8';
//       if (Hls.isSupported()) {
//         var hls = new Hls();
//         hls.loadSource(videoSrc);
//         hls.attachMedia(video);
//         hls.on(Hls.Events.MANIFEST_PARSED, function() {
//           video.play();
//         });
//       }
//     }
// }else{
//   // 判断 header里是否存在full_page
//   if($("#page-header").hasClass("full_page")||$("#page-header").hasClass("not-home-page")){
//     // 插入<video>
//     var html = "<video id='video' muted loop autoplay style='height: 100%;width: 100%;object-fit: cover;'></video>";
//     document.getElementsByClassName("full_page")[0].innerHTML += html;
//     // 随机数
//     var randomNum = Math.floor((Math.random() * 6)+1);
//     // 获取 <video>
//     var video = document.getElementById('video');
//     // 插入视频(m3u8)
//     var videoSrc = 'https://cdn.jsdelivr.net/gh/lete114/CDN2/video/mobile/'+randomNum+'.m3u8';
//     if (Hls.isSupported()) {
//       var hls = new Hls();
//       hls.loadSource(videoSrc);
//       hls.attachMedia(video);
//       hls.on(Hls.Events.MANIFEST_PARSED, function() {
//         video.play();
//       });
//     }
//   }
// }

