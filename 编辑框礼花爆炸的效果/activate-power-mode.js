(function webpackUniversalModuleDefinition(root, factory) {
  if (typeof exports === 'object' && typeof module === 'object') module.exports = factory();
  else if (typeof define === 'function' && define.amd) define([], factory);
  else if (typeof exports === 'object') exports["POWERMODE"] = factory();
  else root["POWERMODE"] = factory()
})(this,function() {
  return (function(modules) {
    var installedModules = {};
    function __webpack_require__(moduleId) {
      if (installedModules[moduleId]) return installedModules[moduleId].exports;
      var module = installedModules[moduleId] = {
        exports: {},
        id: moduleId,
        loaded: false
      };
      modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
      module.loaded = true;
      return module.exports
    }
    __webpack_require__.m = modules;
    __webpack_require__.c = installedModules;
    __webpack_require__.p = "";
    return __webpack_require__(0)
  })([function(module, exports, __webpack_require__) {
    'use strict';
    //创建画板
    var canvas = document.createElement('canvas');
    //设置画板的宽度
    canvas.width = window.innerWidth;
    //设置画板的高度
    canvas.height = window.innerHeight;
    //为画板设置样式
    canvas.style.cssText = 'position:fixed;top:0;left:0;pointer-events:none;z-index:999999';
    //添加事件监听
    window.addEventListener('resize',
        function() {
          //重新为画板设置宽高
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight
        });
    //将画板追加到文档的最后
    document.body.appendChild(canvas);
    //获取2d
    var context = canvas.getContext('2d');
    //粒子数组
    var particles = [];
    //粒子指针
    var particlePointer = 0;
    //为POWERMODE设置shake属性
    POWERMODE.shake = true;
    //获取区间内的随机数
    function getRandom(min, max) {
      return Math.random() * (max - min) + min
    }
    //获取颜色
    function getColor(el) {
      //判断是否有值
      if (POWERMODE.colorful) {
        //获取一个随机数
        var u = getRandom(0, 360);
        return 'hsla(' + getRandom(u - 10, u + 10) + ', 100%, ' + getRandom(50, 80) + '%, ' + 1 + ')'
      } else {
        return window.getComputedStyle(el).color
      }
    }
    function getCaret() {
      //获取当前获得焦点的元素
      var el = document.activeElement;
      var bcr;
      //判断元素是否符合类型
      if (el.tagName === 'TEXTAREA' || (el.tagName === 'INPUT' && el.getAttribute('type') === 'text')) {
        var offset = __webpack_require__(1)(el, el.selectionStart);
        //获取元素相对于视窗的位置集合
        bcr = el.getBoundingClientRect();
        return {
          x: offset.left + bcr.left,
          y: offset.top + bcr.top,
          color: getColor(el)
        }
      }
      var selection = window.getSelection();
      if (selection.rangeCount) {
        var range = selection.getRangeAt(0);
        var startNode = range.startContainer;
        if (startNode.nodeType === document.TEXT_NODE) {
          startNode = startNode.parentNode
        }
        bcr = range.getBoundingClientRect();
        return {
          x: bcr.left,
          y: bcr.top,
          color: getColor(startNode)
        }
      }
      return {
        x: 0,
        y: 0,
        color: 'transparent'
      }
    }
    //创建粒子
    function createParticle(x, y, color) {
      return {
        x: x,
        y: y,
        alpha: 1,
        color: color,
        velocity: {
          x: -1 + Math.random() * 2,
          y: -3.5 + Math.random() * 2
        }
      }
    }
    //模式设置
    function POWERMODE() {
      {
        var caret = getCaret();
        var numParticles = 5 + Math.round(Math.random() * 10);
        while (numParticles--) {
          particles[particlePointer] = createParticle(caret.x, caret.y, caret.color);
          particlePointer = (particlePointer + 1) % 500
        }
      } {
        if (POWERMODE.shake) {
          var intensity = 1 + 2 * Math.random();
          var x = intensity * (Math.random() > 0.5 ? -1 : 1);
          var y = intensity * (Math.random() > 0.5 ? -1 : 1);
          document.body.style.marginLeft = x + 'px';
          document.body.style.marginTop = y + 'px';
          setTimeout(function() {
                document.body.style.marginLeft = '';
                document.body.style.marginTop = ''
              },
              75)
        }
      }
    };
    POWERMODE.colorful = false;
    function loop() {
      requestAnimationFrame(loop);
      context.clearRect(0, 0, canvas.width, canvas.height);
      for (var i = 0; i < particles.length; ++i) {
        var particle = particles[i];
        if (particle.alpha <= 0.1) continue;
        particle.velocity.y += 0.075;
        particle.x += particle.velocity.x;
        particle.y += particle.velocity.y;
        particle.alpha *= 0.96;
        context.globalAlpha = particle.alpha;
        context.fillStyle = particle.color;
        context.fillRect(Math.round(particle.x - 1.5), Math.round(particle.y - 1.5), 3, 3)
      }
    }
    requestAnimationFrame(loop);
    module.exports = POWERMODE
  },
    function(module, exports) {
      (function() {
        var properties = ['direction', 'boxSizing', 'width', 'height', 'overflowX', 'overflowY', 'borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth', 'borderStyle', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 'fontStyle', 'fontVariant', 'fontWeight', 'fontStretch', 'fontSize', 'fontSizeAdjust', 'lineHeight', 'fontFamily', 'textAlign', 'textTransform', 'textIndent', 'textDecoration', 'letterSpacing', 'wordSpacing', 'tabSize', 'MozTabSize'];
        var isFirefox = window.mozInnerScreenX != null;
        function getCaretCoordinates(element, position, options) {
          var debug = options && options.debug || false;
          if (debug) {
            var el = document.querySelector('#input-textarea-caret-position-mirror-div');
            if (el) {
              el.parentNode.removeChild(el)
            }
          }
          var div = document.createElement('div');
          div.id = 'input-textarea-caret-position-mirror-div';
          document.body.appendChild(div);
          var style = div.style;
          var computed = window.getComputedStyle ? getComputedStyle(element) : element.currentStyle;
          style.whiteSpace = 'pre-wrap';
          if (element.nodeName !== 'INPUT') style.wordWrap = 'break-word';
          style.position = 'absolute';
          if (!debug) style.visibility = 'hidden';
          properties.forEach(function(prop) {
            style[prop] = computed[prop]
          });
          if (isFirefox) {
            if (element.scrollHeight > parseInt(computed.height)) style.overflowY = 'scroll'
          } else {
            style.overflow = 'hidden'
          }
          div.textContent = element.value.substring(0, position);
          if (element.nodeName === 'INPUT') div.textContent = div.textContent.replace(/\s/g, "\u00a0");
          var span = document.createElement('span');
          span.textContent = element.value.substring(position) || '.';
          div.appendChild(span);
          var coordinates = {
            top: span.offsetTop + parseInt(computed['borderTopWidth']),
            left: span.offsetLeft + parseInt(computed['borderLeftWidth'])
          };
          if (debug) {
            span.style.backgroundColor = '#aaa'
          } else {
            document.body.removeChild(div)
          }
          return coordinates
        }
        if (typeof module != "undefined" && typeof module.exports != "undefined") {
          module.exports = getCaretCoordinates
        } else {
          window.getCaretCoordinates = getCaretCoordinates
        }
      } ())
    }])
});
