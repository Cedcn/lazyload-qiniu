'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var ZOOM = window.devicePixelRatio || 1;
var MAX_WIDTH = 1240;

var str = function str(type, size) {
  return size ? type + '/' + Math.floor(size) + '/' : '';
};
var qiniuAPI = function qiniuAPI(param) {
  return '?imageView2/' + param + 'interlace/1/q/88/ignore-error/1/';
};

var isSupportWebp = false;

var KEY = 'modernizr_support_webp';

if (localStorage.getItem(KEY)) {
  isSupportWebp = true;
} else {
  if (typeof Modernizr !== 'undefined') {
    Modernizr.on('webp', function (x) {
      if (x) {
        isSupportWebp = true;
        localStorage.setItem(KEY, true);
      }
    });
  }
}

var webp = function webp(str) {
  return isSupportWebp ? str + 'format/webp/' : str;
};

function lazyload() {
  var params = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var target = params.target;
  var maxWidth = params.maxWidth;
  var onStart = params.onStart;
  var onLoad = params.onLoad;

  var wrapMaxWidth = maxWidth || MAX_WIDTH;
  var containerW = window.innerWidth > wrapMaxWidth ? wrapMaxWidth : window.innerWidth;

  var $imgs = document.querySelectorAll((target || 'body') + ' img.js-lazy');

  [].concat(_toConsumableArray($imgs)).forEach(function (x) {
    var zData = {};

    Object.keys(x.dataset).forEach(function (z) {
      zData[z] = x.dataset[z];
    });

    var src = zData.src;

    if (typeof src === 'undefined' || src === '') return;

    zData.cb = function (src) {
      if (typeof onLoad === 'function') x.onload = function (e) {
        return onLoad(x, e);
      };
      x.src = src;
    };
    load(zData);
    if (typeof onStart === 'function') onStart(x);
  });

  function load(args) {
    var src = args.src;
    var w = args.w;
    var h = args.h;
    var vw = args.vw;
    var full = args.full;
    var ratio = args.ratio;
    var cb = args.cb;

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
    cb(webp(newSrc));
  }

  function calcW(_ref) {
    var w = _ref.w;
    var vw = _ref.vw;
    var full = _ref.full;

    if (full) return window.innerWidth * ZOOM;
    if (vw) return containerW * (vw / 100) * ZOOM;
    if (w) return w * ZOOM;
    return false;
  }
}

exports.default = lazyload;
