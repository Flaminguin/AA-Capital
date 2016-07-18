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
  $('.feature-panel ul li').on('click', function () {
    var sceneIndex = $(this).index();
    var $body = (window.opera) ? (document.compatMode == "CSS1Compat" ? $('html') : $('body')) : $('html,body');
    $body.stop(true, false).animate(
      {
        scrollTop: sceneIndex * windowHeight
      },
      500);
  });
  var scrollController = new ScrollMagic.Controller();
  var titles = $('.title');
  var subtitles = $('.subtitle');
  var points = $('.point');
  var lines = $('.line');
  $('.scene').each(function (index, elem) {
    var scene = new ScrollMagic.Scene({triggerElement: elem, reverse: true, triggerHook: .1});
    scene.setTween(TweenMax.fromTo(titles.eq(index), .4,
      {opacity: 0, 'letter-spacing': '100px', 'font-size': '4px'},
      {opacity: 1, 'letter-spacing': '0', 'font-size': '40px'}));
    scene.addTo(scrollController);
    scene = new ScrollMagic.Scene({triggerElement: elem, reverse: true, triggerHook: .1});
    scene.setTween(TweenMax.fromTo(subtitles.eq(index), .4, {
      opacity: 0,
      'letter-spacing': '100px',
      'font-size': '4px'
    }, {opacity: 1, 'letter-spacing': '0', 'font-size': '18px'}));
    scene.addTo(scrollController);

  });

  var scene = new ScrollMagic.Scene({triggerElement: $('#scene1'), reverse: true, triggerHook: .1});
  scene.setTween(TweenMax.from('#animate1', .4, {
    opacity: 0,
    onComplete: drawWing
  }));
  scene.addTo(scrollController);

  function drawWing() {
    console.log($('#animate1'));
    $('#animate1').lazylinepainter(
        {
          "svgData": pathObj,
          "strokeWidth": 2,
          "strokeColor": "#e09b99"
        }).lazylinepainter('paint');
  }

  function onResize() {
    windowHeight = $(window).height();
    $('.scene').height(windowHeight);
  }

  function onScroll() {
    windowScrollTop = $(window).scrollTop();
    var contentHeight = $('.content').height();
    var rate = windowScrollTop * 100 / contentHeight;
    var sceneIndex = curSceneIndex;
    $('.feature-panel').css('position', 'fixed');
    if (rate < 33) {
      sceneIndex = 0;
    } else if (rate > 66) {
      sceneIndex = 2;
      $('.feature-panel').css('position', 'absolute');
    } else {
      if (rate < 66) {
        sceneIndex = 1;
      } else {
        sceneIndex = 2;
      }
    }
    if (curSceneIndex != sceneIndex) {
      selectScene(sceneIndex);
    }
  }

  function selectScene(sceneIndex) {
    var selectors = $('.feature-panel .selector');
    if (sceneIndex <= selectors.length) {
      selectors.each(function (index, elem) {
        selectors.eq(index).removeClass('active');
      });
      selectors.eq(sceneIndex).addClass('active');
    }
    curSceneIndex = sceneIndex;
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