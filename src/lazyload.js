import $ from 'jquery';
import { isRetina } from 'mdetect'

const ZOOM = isRetina ? 2 : 1;
const qiniuAPI = '?imageView2/2/';
const setting = {
  target: 'body',           // 容器
  expand: 30,               // 增加的图片像素
  wrapMaxWidth: 1240        // vw的相对宽度
}

function lazyload(options) {
  const newOptions = Object.assign(setting, options);
  const { target, expand, wrapMaxWidth } = newOptions;
  const $target = $(target);
  const containerW = window.innerWidth > wrapMaxWidth ? wrapMaxWidth : window.innerWidth;

  $target.find('img.js-lazy').each(function () {
    const $this = $(this);
    const src = $this.data('src');
    const w = $this.data('w');
    const h = $this.data('h');
    const vw = $this.data('vw');
    const cover = $this.data('cover');

    if ( typeof src === 'undefined' ) return;
    // 设置小图
    $this.addClass('blur').addClass('loaded').attr('src', `${src}${qiniuAPI}w/20`);

    // use qiniu API for image URL
    const newImgSrc = imgSizeCND(src, { w, h, vw, cover });

    // 加载大图
    loadImg(newImgSrc, () => {
      $this.removeClass('blur').attr('src', newImgSrc);
    });
  });

  function imgSizeCND (imgSrc, size) {
    let params = '',
        newImgSrc;

    if (size.h) params = 'h/' + Math.floor( size.h * ZOOM + expand );
    if (size.w) params = 'w/' + Math.floor( size.w * ZOOM + expand );
    if (size.vw) params = 'w/' + Math.floor(containerW * ( size.vw / 100 ) * ZOOM + expand);
    if (size.cover === 'full') params = 'w/' + Math.floor( window.innerWidth * ZOOM + expand )

    newImgSrc = `${imgSrc}${qiniuAPI}${params}`;
    return newImgSrc;
  }

  function loadImg (src, cb) {
    const largeImg = new Image();

    largeImg.src = src;
    largeImg.onload = () => {
      if (typeof cb !== 'undefined') cb();
    }
  }
}

export default lazyload;
