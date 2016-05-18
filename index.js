'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ZOOM = window.devicePixelRatio || 1;
var MAX_WIDTH = 1240;

var str = function str(type, size) {
  return size ? type + '/' + Math.floor(size) + '/' : '';
};
var qiniuAPI = function qiniuAPI(param) {
  return '?imageView2/' + param + 'interlace/1/q/88/';
};

function lazyload() {
  var params = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var target = params.target;
  var maxWidth = params.maxWidth;
  var onStart = params.onStart;
  var onLoad = params.onLoad;

  var wrapMaxWidth = maxWidth || MAX_WIDTH;
  var $target = (0, _jquery2.default)(target || 'body');
  var containerW = window.innerWidth > wrapMaxWidth ? wrapMaxWidth : window.innerWidth;

  $target.find('img.js-lazy').each(function () {
    var $this = (0, _jquery2.default)(this);
    var zData = $this.data();
    var src = zData.src;

    if (typeof src === 'undefined' || src === '') return;

    zData.cb = function (src) {
      if (typeof onLoad === 'function') $this.on('load', function (e) {
        return onLoad($this, e);
      });
      $this.attr('src', src);
    };
    load(zData);
    if (typeof onStart === 'function') onStart($this);
  });

  function load(_ref) {
    var src = _ref.src;
    var w = _ref.w;
    var h = _ref.h;
    var vw = _ref.vw;
    var full = _ref.full;
    var ratio = _ref.ratio;
    var cb = _ref.cb;

    var params = void 0;
    var _w = calcW({ w: w, vw: vw, full: full });
    var wStr = str('w', _w);
    var hStr = str('h', h);
    var largeImg = new Image();

    if (ratio) {
      params = '1/' + (_w ? wStr + str('h', _w * ratio) : hStr + str('w', h / ratio));
    } else {
      params = '2/' + wStr + hStr;
    }

    var newSrc = '' + src + qiniuAPI(params);
    cb(newSrc);
  }

  function calcW(_ref2) {
    var w = _ref2.w;
    var vw = _ref2.vw;
    var full = _ref2.full;

    if (full) return window.innerWidth * ZOOM;
    if (vw) return containerW * (vw / 100) * ZOOM;
    if (w) return w * ZOOM;
    return false;
  }
}

exports.default = lazyload;
