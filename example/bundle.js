(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _lazyload = require('../src/lazyload');

var _lazyload2 = _interopRequireDefault(_lazyload);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var imgs = document.querySelectorAll('img');

[].concat(_toConsumableArray(imgs)).forEach(function (x) {
  x.dataset.src = x.src;
  x.src = '';
  x.classList.add('js-lazy');
  x.dataset.vw = '100';
});

(0, _lazyload2.default)(document.body);

},{"../src/lazyload":2}],2:[function(require,module,exports){
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
  return '?imageView2/' + param + 'interlace/1/q/88/';
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

},{}]},{},[1]);
