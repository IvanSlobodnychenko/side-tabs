/**
 * Created by Ivan Slobodnychenko on 21.07.17.
 *
 * OPTIONS:
 * side: str (right/left/bottom),
 * position: str (top/center/bottom) // If the side is down, then only the "center" positioning is supported,
 * speed: int,
 * contentWidth: int,
 * heightContent: str/int,
 * btnSize: int
 *
 * You can override the widget's settings on a different width of the screen with the option "responsive"
   Example of using the "responsive":
 *
    responsive: [
         {
             breakpoint: 1200,
             settings: {
                 side: 'bottom',
                 btnSize: 50
             }
         },
         {
             breakpoint: 992,
             settings: {
                 side: 'right',
                 btnSize: 60
             }
         }
    ]
 *
 */

;(function ($, window, document, undefined) {

// default paramms
    let pluginName = 'sideTabs',
        defaults = {
            item: '.side-tabs-block__item',
            side: 'right',
            position: 'center',
            speed: 300,
            heightContent: 'auto',
            btnSize: 60,
            contentWidth: 240
        },
        initClass = 'side-tabs-block';

//constructor
    function Plugin(element, options) {
        this.element = element;
        this.options = $.extend({}, defaults, options);
        this.activeBreakpoint = 1;
        this.initOptions = $.extend({}, defaults, options);
        this.optionSettings = {};

        this._defaults = defaults;
        this._name = pluginName;

        this.sortBreakpoints();
        this.compareRespond();
        let thisElem = this;

        $(window).resize(function () {
            thisElem.compareRespond();
        });
    }

// plugin code
    Plugin.prototype = {
        init: function () {
            let _ = this;
            _.createButtons();
            _.addClasses();
            if (_.optionSettings.side === 'bottom') {
                let heightContent = _.optionSettings.heightContent = _.getHeightContent();
                _.setHeightContent.call(_, heightContent);
            } else {
                let idElem = $(_.element).attr('id');
                $('#' + idElem).find('.side-tabs-block__content').css('height', '');
                _.optionSettings.heightContent = 'auto'
            }
            _.animate();
        },
        reinit: function () {
            let _ = this;
            _.destroy();
            _.init();
        },
        destroy: function () {
            let _ = this,
                $_ = $(this.element);

            $_.attr('class', '').addClass(initClass);
            $_.find('*').filter("[ style ]").attr('style', '');
        },
        sortBreakpoints: function () {
            let _ = this,
                responsiveSettings = _.options.responsive || null;

            if ($.type(responsiveSettings) === 'array' && responsiveSettings.length) {
                responsiveSettings.sort(function (a, b) {
                    return b.breakpoint - a.breakpoint;
                });
            }
        },
        compareRespond: function () {
            let _ = this,
                windowWidth = $(window).width(),
                responsiveSettings = _.options.responsive || null;

            for (let i = 0; i < responsiveSettings.length; i++) {
                if (responsiveSettings[i].breakpoint > windowWidth) {

                    if (!responsiveSettings[i + 1]) {
                        if (_.activeBreakpoint !== responsiveSettings[i].breakpoint) {
                            _.activeBreakpoint = responsiveSettings[i].breakpoint;
                            _.optionSettings = $.extend({}, _.options, responsiveSettings[i].settings);
                            return _.reinit();
                        }
                    } else if (responsiveSettings[i + 1].breakpoint < windowWidth) {
                        if (_.activeBreakpoint !== responsiveSettings[i].breakpoint) {
                            _.activeBreakpoint = responsiveSettings[i].breakpoint;
                            _.optionSettings = $.extend({}, _.options, responsiveSettings[i].settings);
                            return _.reinit();
                        }
                    }
                } else if (windowWidth > responsiveSettings[0].breakpoint) {
                    if (_.activeBreakpoint !== responsiveSettings[0].breakpoint + 1) {
                        _.activeBreakpoint = responsiveSettings[0].breakpoint + 1;
                        _.optionSettings = $.extend({}, _.options, _.initOptions);
                        return _.reinit();
                    }
                }
            }
        },
        createButtons: function () {
            let _ = this,
                $elem = $(_.element),
                elemId = '#' + $elem.attr('id');
            if ($(elemId).find('.side-tabs-block__btn').length == 0) {
                $(elemId).find('.side-tabs-block__icon').wrap('<div class="side-tabs-block__btn"></div>');
            }
            $(elemId).find('.side-tabs-block__btn').css({
                height: _.optionSettings.btnSize + 'px',
                width: _.optionSettings.btnSize + 'px'
            });
        },
        addClasses: function () {
            let _ = this,
                $_ = $(this.element),
                elemId = '#' + $_.attr('id'),
                options = _.optionSettings,
                sideClass = options.side + '-side',
                positionClass = options.position + '-position',
                contentWidth = options.contentWidth;

            $(elemId).attr('class', '').addClass(initClass + ' ' + sideClass + ' ' + positionClass);

            $_.find('.side-tabs-block__content').css({
                width: contentWidth + 'px'
            });
        },
        getHeightContent: function () {
            let contentBlock = $(this.options.item).find('.side-tabs-block__content'),
                height = 0;
            $.each(contentBlock, function (index) {
                if (height < $(contentBlock[index]).outerHeight()) {
                    height = $(contentBlock[index]).outerHeight();
                }
            });
            return height;
        },
        setHeightContent: function (heightContent) {
            let _ = this,
                idElem = $(_.element).attr('id');
            $('#' + idElem).find('.side-tabs-block__content').css('height', heightContent + _.optionSettings.btnSize);
        },
        animate: function () {
            let _ = this,
                $btn = $('.side-tabs-block__btn');

            $btn.off('click').on('click', function () {
                let options = _.optionSettings,
                    side = options.side;

                switch (side) {
                    case 'bottom':
                        _.animateBottom.call(this, options);
                        break;
                    case 'left':
                        _.animateLeft.call(this, options);
                        break;
                    default:
                        _.animateRight.call(this, options);
                }
            });
        },
        animateRight: function (options) {
            let speed = options.speed,
                contentWidth = options.contentWidth,
                $item = $(this).parent('.side-tabs-block__item'),
                $active = $('.active-tab'),
                btnSize = options.btnSize,
                contentHeight = $(this).next('.side-tabs-block__content').height(),
                $activePosition = $(this).hasClass('active-tab') ? 0 : contentWidth,
                itemMargin = {'margin-bottom': '5px'},
                indent = 10;

            $item.velocity({
                'margin-bottom': (contentHeight > 50) ? parseInt(contentHeight - btnSize + indent) + 'px' : '5px'
            }, {
                duration: speed,
                begin: function () {
                    $(this).velocity({
                        right: $activePosition
                    }, speed);
                    $active.velocity({
                        right: 0
                    }, {
                        duration: speed,
                        complete: function (element) {
                            $(element).removeClass('active-tab');
                            $(this).velocity(itemMargin, speed);
                        }
                    });
                },
                complete: function (element) {
                    $(element).addClass('active-tab');
                }
            });
        },
        animateLeft: function (options) {
            let speed = options.speed,
                contentWidth = options.contentWidth,
                $item = $(this).parent('.side-tabs-block__item'),
                $active = $('.active-tab'),
                btnSize = options.btnSize,
                contentHeight = $(this).next('.side-tabs-block__content').height(),
                $activePosition = $(this).hasClass('active-tab') ? 0 : contentWidth,
                itemMargin = {'margin-bottom': '5px'},
                indent = 10;

            $item.velocity({
                'margin-bottom': (contentHeight > 50) ? parseInt(contentHeight - btnSize + indent) + 'px' : '5px'
            }, {
                duration: speed,
                begin: function () {
                    $(this).velocity({
                        left: $activePosition
                    }, speed);
                    $active.velocity({
                        left: 0
                    }, {
                        duration: speed,
                        complete: function (element) {
                            $(element).removeClass('active-tab');
                            $(this).velocity(itemMargin, speed);
                        }
                    });
                },
                complete: function (element) {
                    $(element).addClass('active-tab');
                }
            });
        },
        animateBottom: function (options) {
            let speed = options.speed,
                $item = $(this).parent('.side-tabs-block__item'),
                $active = $('.active-tab'),
                btnSize = options.btnSize,
                contentHeight = options.heightContent,
                $activePosition = $(this).hasClass('active-tab') ? 0 : contentHeight,
                itemMargin = {'margin-bottom': '0'};

            $item.velocity({
                'margin-bottom': 0
            }, {
                duration: speed,
                begin: function () {
                    $(this).velocity({
                        bottom: $activePosition + btnSize
                    }, speed);
                    $active.velocity({
                        bottom: 0
                    }, {
                        duration: speed,
                        complete: function (element) {
                            $(element).removeClass('active-tab');
                            $(this).velocity(itemMargin, speed);
                        }
                    });
                },
                complete: function (element) {
                    $(element).addClass('active-tab');
                }
            });
        }
    };

    // plugin decorator
    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
            }
            else if ($.isFunction(Plugin.prototype[options])) {
                $.data(this, 'plugin_' + pluginName)[options]();
            }
        });
    };

})(jQuery, window, document);

$(document).on('click', function (event) {
    let element = event.target;

    if (!$(element).hasClass('side-tabs-block__btn') && !$(element).hasClass('side-tabs-block__icon')) {
        $('.side-tabs-block__item.active-tab').find('.side-tabs-block__btn').trigger('click');
    }
});