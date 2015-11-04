var ILOVETT = (function () {
    'use strict';

    function outboundSiteClick() {
        var qs;
        qs = {
            event: 'exit',
            url: jQuery(this).attr('href').replace(/https?:\/\//, '').replace(/\/$/, '')
        };
        jQuery.get('/tracking', qs);
    }

    function greet(answer) {
        var qs = {
            type: answer
        };

        jQuery.get('/greeting', qs, function (data) {
            jQuery('#who .trigger').addClass('hidden');
            jQuery('#who .answers').addClass('hidden');
            jQuery('#who .response').removeClass('hidden').text(data);
            localStorage.setItem('greeting', answer);
        });
    }

    function testCapabilities() {
        var keyword = 'probably';

        if (!window.sessionStorage) {
            return;
        }

        if (window.sessionStorage.getItem('human') === keyword) {
            return;
        }

        jQuery('BODY').one('touchstart mousemove', function (e) {
            var cookie = document.cookie.split('&').reduce(function (acc, pair) {
                var fields = pair.split('=');
                acc[fields[0]] = fields[1];
                return acc;
            }, {});

            jQuery.get('/caps', {
                m: (e.type === 'mousemove')? 1:0,
                w: screen.width,
                h: screen.height,
                ah: screen.availHeight,
                al: screen.availLeft,
                at: screen.availTop,
                aw: screen.availWidth,
                px: screen.pixelDepth,
                sx: window.screenX,
                sy: window.screenY
            });
            window.sessionStorage.setItem('human', keyword);
        });
    }

    return {
        init: function () {
            var greeting;
            jQuery('A[rel=external]').click(outboundSiteClick);

            jQuery('#who .trigger').on('click', function (e) {
                e.preventDefault();
                jQuery('#who .answers').toggleClass('hidden');
            });

            jQuery('#who .answers A').on('click', function (e) {
                e.preventDefault();

                greet(jQuery(this).attr('data-answer'));

            });

            greeting = localStorage.getItem('greeting');

            if (greeting) {
                greet(greeting);
            } else {
                jQuery('#who .trigger').removeClass('hidden');
            }

            testCapabilities();
        },

        sendBeacon: function () {
            var endpoint = '/au-revoir';
            if (navigator.sendBeacon) {
                navigator.sendBeacon(endpoint);
            } else {
                jQuery.post(endpoint);
            }
        }
    };
}());

jQuery(document).ready(ILOVETT.init);
jQuery(window).unload(ILOVETT.sendBeacon);
