/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

;(function($) {
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
        // Reset all accordion panels
        $('.panel').removeAttr('style');
        // Reset the carousel to adjust heights
        setupCarousel();
    }
    // Call once when done loading the page to initialize.
    $(doneResizing);

    var accordion = {
        // Expand the accordion horizontally
        expandHorz: function(action, elem) {
            $('.panel-title').fadeOut(200);
            elem.stop().removeClass('compressed').addClass('expanded').animate({'width':'64%'},500);
            elem.siblings().stop().removeClass('expanded').addClass('compressed').animate({'width':'12%'},500);
            $('.panel-content', elem).stop(true,true).delay(200).fadeIn();
            track_accordion(action, ($('.panel').index(elem) + 1), elem.attr('id'));
        },

        // Contract the accordion horizontally
        contractHorz: function() {
            $('.panel').stop().animate({'width':'25%'},700, function() {
                $('.panel-title').fadeIn(250);
            }).removeClass('expanded compressed');
            $('.panel-content').stop(true,true).fadeOut(500);
        },

        // Expand the accordion vertically
        expandVert: function(action, elem) {
            $('.panel-title').fadeOut(200);
            elem.stop().removeClass('compressed').addClass('expanded').animate({'height':'26em'},500);
            elem.siblings().stop().removeClass('expanded').addClass('compressed').animate({'height':'3em'},500);
            $('.panel-content', elem).stop(true,true).delay(200).fadeIn();
            track_accordion(action, ($('.panel').index(elem) + 1), elem.attr('id'));
        },

        // Contract the accordion vertically
        contractVert: function() {
            $('.panel').stop().animate({'height':'4.5em'},700, function() {
                $('.panel-title').fadeIn(250);
            }).removeClass('expanded compressed');
            $('.panel-content').stop(true,true).fadeOut(500);
        },
    };


    // Expand onmouseover, contract onmouseout
    $('.panel').hover(
        function() {
            if (wideMode) {
                accordion.expandHorz('hover', $(this));
            } else {
                accordion.expandVert('hover', $(this));
            }
        },
        function() {
            if (wideMode) {
                accordion.contractHorz();
            } else {
                accordion.contractVert();
            }
        }
    );

    // Expand on click, but only in small viewports
    $('.panel').on('click', function() {
        if (!wideMode) {
            accordion.expandVert('click', $(this));
        }
    });

    // Contract when the inner link loses focus
    $('.panel-content > a').on('blur', function() {
        if (wideMode) {
            accordion.contractHorz();
        } else {
            accordion.contractVert();
        }
    });

    // News
    // Set up the carousel
    function setupCarousel() {
        $('.news > .hfeed').jcarousel({
            auto: 6,
            vertical: true,
            scroll: 1,
            visible: 1,
            wrap: 'circular',
            itemLastOutCallback: { onAfterAnimation: disableButtons },
            itemLastInCallback: { onAfterAnimation: disableButtons },
            initCallback: controlButtons
        });
    }

    // Add the next and previous control buttons
    function controlButtons(carousel) {
        var $buttonNext = $('<button type="button" class="btn-next">' + window.trans('news-next') + '</button>');
        var $buttonPrev = $('<button type="button" class="btn-prev">' + window.trans('news-prev') + '</button>');
        var $buttons = $('<span class="news-buttons"></span>');

        $buttonNext.prependTo($buttons);
        $buttonPrev.prependTo($buttons);
        $buttons.prependTo('.news > .control');

        $('.btn-next').bind('click', function() {
            carousel.next();
            if (window._gaq) {
                window._gaq.push(['_trackEvent', 'Mozilla in the News Interactions', 'Next', 'News Navigation Arrows']);
            }
        });
        $('.btn-prev').bind('click', function() {
            carousel.prev();
            if (window._gaq) {
                window._gaq.push(['_trackEvent', 'Mozilla in the News Interactions', 'Previous', 'News Navigation Arrows']);
            }
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


    // Track which accordion panels are opened
    var track_accordion = function(action, position, id) {
        if (window._gaq) {
            window._gaq.push(['_trackEvent','Homepage Interactions', action, position, id]);
        }
    };

    // Track newsletter signups
    $('#footer-email-form').on('submit', function() {
        if (window._gaq) {
            window._gaq.push(['_trackEvent', 'Newsletter Registration','submit', 'Registered for Mozilla Updates']);
        }
    });

    // Track Firefox downloads
    $('.download-link').on('click', function() {
        var platform;
        if ($(this).parents('li.os_android')) {
            platform = 'Firefox for Android';
        } else {
            platform = 'Firefox Desktop';
        }
        if (window._gaq) {
            window._gaq.push(['_trackEvent', 'Firefox Downloads', 'download click', platform]);
        }
    });

    // Track news clicks
    $('.news a').on('click', function() {
        if (window._gaq) {
            window._gaq.push(['_trackEvent', 'Mozilla in the News Interactions','click', this.href]);
        }
    });

    // Track contribute clicks
    $('.contribute a').on('click', function() {
        if (window._gaq) {
            window._gaq.push(['_trackEvent', 'Get Involved Interactions','clicks', 'Get Involved Button']);
        }
    });

})(window.jQuery);
