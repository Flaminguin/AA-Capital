'use strict';

$(function () {
  var windowHeight = $(window).height();
  var windowScrollTop = $(window).scrollTop();

  onResize();
  $(window).resize(onResize);

  function onResize() {
    windowHeight = $(window).height();
    // $('.about-wrapper').height(windowHeight);
  }
})
;