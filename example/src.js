import lazy from '../src/lazyload';

const imgs = document.querySelectorAll('img');

[...imgs].forEach(x => {
  x.dataset.src = x.src;
  x.src = '';
  x.classList.add('js-lazy');
  x.dataset.vw = '100';
});

lazy(document.body);
