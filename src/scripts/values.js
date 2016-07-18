'use strict';

$(function () {
  var curSceneIndex = 0;
  var windowHeight = $(window).height();
  var windowScrollTop = $(window).scrollTop();
  var mousewheelLock = false;

  onResize();
  $(window).resize(onResize);
  $(window).scroll(onScroll);
  $('html').on('mousewheel', onMousewheel);

  var scrollController = new ScrollMagic.Controller();
  var titles = $('.title');
  var subtitles = $('.subtitle');
  var points = $('.point');
  var lines = $('.line');
  $('.scene').each(function (index, elem) {
    if (index > 0) {
      var scene = new ScrollMagic.Scene({triggerElement: elem, reverse: true, triggerHook: .1});
      scene.setTween(TweenMax.fromTo(titles.eq(index), .4, {
        opacity: 0,
        'letter-spacing': '100px',
        'font-size': '4px'
      }, {opacity: 1, 'letter-spacing': '2', 'font-size': '40px', 'line-height': '64px'}));
      scene.addTo(scrollController);
      scene = new ScrollMagic.Scene({triggerElement: elem, reverse: true, triggerHook: .1});
      scene.setTween(TweenMax.fromTo(subtitles.eq(index), .4, {
        opacity: 0,
        'letter-spacing': '100px',
        'font-size': '4px'
      }, {opacity: 1, 'letter-spacing': '2', 'font-size': '18px'}));
      scene.addTo(scrollController);
      scene = new ScrollMagic.Scene({triggerElement: elem, reverse: true, triggerHook: .1});
      scene.setTween(TweenMax.from(points.eq(index - 1), .4, {bottom: 0, opacity: 0}));
      scene.addTo(scrollController);
      scene = new ScrollMagic.Scene({triggerElement: elem, reverse: true, triggerHook: .1});
      scene.setTween(TweenMax.from(lines.eq(index - 1), .3, {height: 0, opacity: 0}));
      scene.addTo(scrollController);
    }
  });

  function onResize() {
    windowHeight = $(window).height();
    $('.scene').height(windowHeight);
  }

  function onScroll() {
    windowScrollTop = $(window).scrollTop();
    var contentHeight = $('.content').height();
    var rate = windowScrollTop * 100 / contentHeight;
    if (rate < 20) {
      curSceneIndex = 0;
      $('.chart-panel').fadeOut();
    } else if (rate > 81) {
      curSceneIndex = 4;
      $('.chart-panel').css('position', 'absolute');
    } else {
      $('.chart-panel').fadeIn();
      $('.chart-panel').css('position', 'fixed');
      if (rate < 40) {
        curSceneIndex = 1;
        rate = rate - 20;
      } else if (rate < 60) {
        curSceneIndex = 2;
        rate = rate - 40;
      } else if (rate < 80) {
        curSceneIndex = 3;
        rate = rate - 60;
      } else {
        curSceneIndex = 4;
      }
      var left0 = $('.line').eq(curSceneIndex - 1).position().left;
      var left1 = curSceneIndex < 3 ? $('.line').eq(curSceneIndex).position().left : 700;
      var inc = Math.ceil(rate * (left1 - left0) / 20);
      $('.progress').width(left0 + inc);
    }
  }

  function onMousewheel(event) {
    if (!mousewheelLock) {
      mousewheelLock = true;
      var scenes = $('.scene');
      var sceneIndex = curSceneIndex;
      if (event.deltaY < 0) {
        sceneIndex++;
      } else {
        sceneIndex--;
      }
      if (sceneIndex < scenes.length && sceneIndex >= 0) {
        var $body = (window.opera) ? (document.compatMode == "CSS1Compat" ? $('html') : $('body')) : $('html,body');
        $body.stop(true, false).animate(
            {
              scrollTop: sceneIndex * windowHeight
            },
            500,
            function () {
              mousewheelLock = false;
            });
      } else {
        mousewheelLock = false;
      }
    }
  }

})
;