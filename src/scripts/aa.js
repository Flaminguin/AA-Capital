'use strict';

$(function() {
  var curSliderIndex = 0;
  var windowHeight = $(window).height();
  var timeout = setTimeout(nextSlider, 5000);;

  resize();
  $(window).resize(resize);


  $('.slider-dot ul li').on('click', function () {
    selectSlider($(this).index());
  });

  function resize() {
    windowHeight = $(window).height();
    $('.slider').height(windowHeight);
  }

  function nextSlider() {
    selectSlider(curSliderIndex + 1);
  }

  function selectSlider(index) {
    var sliders = $('.slider');
    var sliderDots = $('.slider-dot ul li');

    sliders.eq(curSliderIndex).removeClass('active');
    sliderDots.eq(curSliderIndex).removeClass('active');

    curSliderIndex = (index) % sliders.length;

    sliders.eq(curSliderIndex).addClass('active');
    sliderDots.eq(curSliderIndex).addClass('active');

    clearTimeout(timeout);
    timeout = setTimeout(nextSlider, 5000);
  }
});