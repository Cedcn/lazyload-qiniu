'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var _mdetect = require('mdetect');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ZOOM = _mdetect.isRetina ? 2 : 1;
var qiniuAPI = '?imageView2/2/';
var setting = {
  target: 'body', // 容器
  expand: 30, // 增加的图片像素
  wrapMaxWidth: 1240 // vw的相对宽度
};

function lazyload(options) {
  var newOptions = Object.assign(setting, options);
  var target = newOptions.target;
  var expand = newOptions.expand;
  var wrapMaxWidth = newOptions.wrapMaxWidth;

  var $target = (0, _jquery2.default)(target);
  var containerW = window.innerWidth > wrapMaxWidth ? wrapMaxWidth : window.innerWidth;

  $target.find('img.js-lazy').each(function () {
    var $this = (0, _jquery2.default)(this);
    var src = $this.data('src');
    var w = $this.data('w');
    var h = $this.data('h');
    var vw = $this.data('vw');

    if (typeof src === 'undefined') return;
    // 设置小图
    $this.addClass('blur').addClass('loaded').attr('src', '' + src + qiniuAPI + 'w/20');

    // use qiniu API for image URL
    var newImgSrc = imgSizeCND(src, { vw: vw, h: h });

    // 加载大图
    loadImg(newImgSrc, function () {
      $this.removeClass('blur').attr('src', newImgSrc);
    });
  });

  function imgSizeCND(imgSrc, size) {
    var params = '',
        newImgSrc = void 0;

    if (size.h) params = 'h/' + Math.floor(size.h * ZOOM + expand);
    if (size.vw) params = 'w/' + Math.floor(containerW * (size.vw / 100) * ZOOM + expand);

    newImgSrc = '' + imgSrc + qiniuAPI + params;
    return newImgSrc;
  }

  function loadImg(src, cb) {
    var largeImg = new Image();

    largeImg.src = src;
    largeImg.onload = function () {
      if (typeof cb !== 'undefined') cb();
    };
  }
}

exports.default = lazyload;
