(function() {
    'use strict';

    var $window = $(window);
    var wideMode = false;

    if ($window.width() >= 760) {
        wideMode = true;
        $('body').addClass('wide');
    }

    $window.resize(function() {
        clearTimeout(this.resizeTimeoutId);
        this.resizeTimeoutId = setTimeout(doneResizing, 200);
    });

    function doneResizing() {
        if ($window.width() >= 768) {
            wideMode = true;
            $('body').addClass('wide');
        } else {
            wideMode = false;
            $('body').removeClass('wide');
        }
    }
    $(doneResizing);  // Call once when done loading the page to initialize.


    // Animate the accordion
    $('.accordion > li').hover(
        function() {
            var $this = $(this);
            if (wideMode) {
                $('.panel-title').fadeOut(400);
                $this.stop().addClass('expanded').animate({'width':'64%'},500);
                $this.siblings().stop().addClass('compressed').animate({'width':'12%'},500);
                $('.panel-content',$this).stop(true,true).delay(200).fadeIn();
            } else {
                $('.panel-title').fadeOut(400);
                $this.stop().addClass('expanded').animate({'height':'300px'},500);
                $this.siblings().stop().addClass('compressed').animate({'height':'3em'},500);
                $('.panel-content',$this).stop(true,true).delay(200).fadeIn();
            }
        },
        function() {
            var $this = $(this);
            if (wideMode) {
                $('.accordion > li').stop().animate({'width':'25%'},700, function(){
                    $('.panel-title').fadeIn(250);
                }).removeClass('expanded compressed');
                $('.panel-content',$this).stop(true,true).fadeOut(500);
            } else {
                $('.accordion > li').stop().animate({'height':'4em'},700, function(){
                    $('.panel-title').fadeIn(250);
                }).removeClass('expanded compressed');
                $('.panel-content',$this).stop(true,true).fadeOut(500);
            }
        }
    );

    // News
    // Set up the carousel
    $(".news > .hfeed").jcarousel({
        auto: 6,
        vertical: true,
        scroll: 1,
        visible: 1,
        wrap: 'circular',
        itemLastOutCallback: { onAfterAnimation: disableButtons },
        itemLastInCallback: { onAfterAnimation: disableButtons },
        initCallback: controlButtons
    });

    // Add the next and previous control buttons
    function controlButtons(carousel) {
        var $buttonNext = $('<button class="btn-next">' + window.trans('news-next') + '</button>');
        var $buttonPrev = $('<button class="btn-prev">' + window.trans('news-prev') + '</button>');
        var $buttons = $('<span class="news-buttons"></span>');

        $buttonNext.prependTo($buttons);
        $buttonPrev.prependTo($buttons);
        $buttons.prependTo('.news > .control');

        $('.btn-next').bind('click', function() {
            carousel.next();
        });
        $('.btn-prev').bind('click', function() {
            carousel.prev();
        });
    }

    // Disable the buttons at the end of the carousel
    function disableButtons(carousel) {
        if (carousel.first === 1) {
            $('.btn-prev').attr('disabled','disabled').addClass('disabled');
        } else {
            $('.btn-prev').removeAttr('disabled').removeClass('disabled');
        }
        if (carousel.last === carousel.size()) {
            $('.btn-next').attr('disabled','disabled').addClass('disabled');
        } else {
            $('.btn-next').removeAttr('disabled').removeClass('disabled');
        }
    }

})(window, jQuery);
