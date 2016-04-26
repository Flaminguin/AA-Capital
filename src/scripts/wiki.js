'use strict';

$(function () {
  var windowHeight = $(window).height();
  var windowScrollTop = $(window).scrollTop();
  $('.wiki-wall .member').click(function (event) {
    $('.nav-aa').addClass('mask');
    $('.content').addClass('mask');
    $('.footer').addClass('mask');
    
    $('.wiki-details').eq($(this).index()).addClass('active');
    $('.wiki-details-mask').addClass('active');
  });
  $('.wiki-details-mask').click(function (event) {
    $('.nav-aa').removeClass('mask');
    $('.content').removeClass('mask');
    $('.footer').removeClass('mask');

    $('.wiki-details').removeClass('active');
    $('.wiki-details-mask').removeClass('active');
  });
 })
;