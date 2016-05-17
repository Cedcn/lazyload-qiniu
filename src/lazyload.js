import $ from 'jquery';

const ZOOM = window.devicePixelRatio || 1;
const MAX_WIDTH = 1240;

const str = (type, size) => size ? `${type}/${Math.floor(size)}/` : '';
const qiniuAPI = param => `?imageView2/${param}/interlace/1/q/88/`;

function lazyload(params = {}) {
  const { target, maxWidth, onStart, onLoad } = params;
  const wrapMaxWidth = maxWidth || MAX_WIDTH;
  const $target = $((target || 'body'));
  const containerW = window.innerWidth > wrapMaxWidth ? wrapMaxWidth : window.innerWidth;

  $target.find('img.js-lazy').each(function () {
    const $this = $(this);
    const zData = $this.data();
    const { src } = zData;
    if (typeof src === 'undefined' || src === '') return;

    zData.cb = src => {
      if (typeof onLoad === 'function') $this.on('load', e => onLoad($this, e));
      $this.attr('src', src);
    };
    load(zData);
    if (typeof onStart === 'function') onStart($this);
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

    const newSrc = `${src}${qiniuAPI(params)}`;
    cb(newSrc);
  }

  function calcW({ w, vw, full }) {
    if (full) return window.innerWidth * ZOOM;
    if (vw) return containerW * ( vw / 100 ) * ZOOM;
    if (w) return w * ZOOM;
    return false;
  }
}

export default lazyload;
