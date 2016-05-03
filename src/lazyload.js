import $ from 'jquery';

const ZOOM = window.devicePixelRatio || 1;
const qiniuAPI = '?imageView2/';
const MAX_WIDTH = 1240;

const str = (type, size) => size ? `${type}/${Math.floor(size)}/` : '';

const BLUR_EFFECT = false;

function lazyload(params = {}) {
  const { target, maxWidth } = params;
  const wrapMaxWidth = maxWidth || MAX_WIDTH;
  const $target = $((target || 'body'));
  const containerW = window.innerWidth > wrapMaxWidth ? wrapMaxWidth : window.innerWidth;

  $target.find('img.js-lazy').each(function () {
    const $this = $(this);
    const zData = $this.data();
    const { src } = zData;
    if (typeof src === 'undefined' || src === '') return;

    if(BLUR_EFFECT) {
      // first load tiny blur img
      $this.addClass('blur').attr('src', `${src}${qiniuAPI}2/w/20`);
      // then load source img with calced size
      zData.cb = result => $this.removeClass('blur').attr('src', result);
    } else {
      zData.cb = src => $this.removeClass('blur').attr('src', src);
    }
    load(zData);
  });

  function load({ src, w, h, vw, full, ratio, cb }) {
    let params;
    const _w = calcW({ w, vw, full });
    const wStr = str('w', _w);
    const hStr = str('h', h);
    const largeImg = new Image();

    if (ratio) {
      params = `1/${_w ? wStr + str('h', _w * ratio) : hStr + str('w', h/ratio)}`;
    } else {
      params = `2/${wStr}${hStr}`;
    }

    const newSrc = `${src}${qiniuAPI}${params}`;

    if (BLUR_EFFECT) {
      largeImg.onload = () => cb(newSrc);
      largeImg.src = newSrc;
    } else {
      cb(newSrc);
    }

  }

  function calcW({ w, vw, full }) {
    if (full) return window.innerWidth * ZOOM;
    if (vw) return containerW * ( vw / 100 ) * ZOOM;
    if (w) return w * ZOOM;
    return false;
  }
}

export default lazyload;
