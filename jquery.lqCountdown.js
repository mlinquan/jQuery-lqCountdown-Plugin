/**
 * jQuery-lqCountdown-Plugin
 * https://github.com/mlinquan/jQuery-lqCountdown-Plugin
 *
 * @version
 * 0.0.6 (April 16, 2015)
 *
 * @copyright
 * Copyright (C) 2015 LinQuan.
 *
 * @license
 * Dual licensed under the MIT and GPL licenses.
 */
"use strict";
if (!Number.prototype.cover || !String.prototype.cover) {
    Number.prototype.cover = String.prototype.cover = function(n) {
        var nl = ("" + this).length;
        return "" + new Array(n > nl ? n - nl + 1 :0).join(0) + "" + this;
    };
}

(function( factory ) {
    if ( typeof define === "function" && define.amd ) {
        define( ["jquery"], factory );
    } else {
        factory( jQuery );
    }
} (function($) {
    $.lqCountdown = {
        queue: {},
        time_file: false,
        time_diff: 0,
        start_time: "",
        timer: function(speed) {
            var queue = $.lqCountdown.queue["s" + speed];
            queue.elements = $.grep(queue.elements, function () {
                return this !== null;
            });
            if(queue.elements.length === 0) {
                return;
            }
            var timeoutFun = function() {
                $.lqCountdown.timer(speed);
            };
            for(var i=0;i<queue.elements.length;i++) {
                if(!queue.elements[i]) {
                    continue;
                }
                var $that = $(queue.elements[i]);
                var left_time = new Date($that.attr("data-endtime").replace(/\-/g, '/')).getTime() - new Date().getTime() - $.lqCountdown.time_diff;// + res_time;
                var t = {};
                if(left_time > 0) {
                    var d = parseInt(left_time / 1000 / 60 / 60 / 24, 10);//计算剩余的天数
                    var h = parseInt(left_time / 1000 / 60 / 60 % 24, 10);//计算剩余的小时数
                    var m = parseInt(left_time / 1000 / 60 % 60, 10);//计算剩余的分钟数
                    var s = parseInt(left_time / 1000 % 60, 10);//计算剩余的秒数
                    var ms = parseInt(left_time % 1000);//计算剩余的毫秒数
                    t.d = d;
                    t.h = h.cover(2);
                    t.m = m.cover(2);
                    t.s = s.cover(2);
                    t.ms = ms.cover(2);
                    if(queue.timerFun && $.isFunction(queue.timerFun)) {
                        queue.timerFun($that, t, left_time);
                    }
                    clearTimeout($.lqCountdown.queue["s"+speed].timer);
                    $.lqCountdown.queue["s"+speed].timer = setTimeout(timeoutFun, speed);
                } else {
                    if(queue.callbackFun && $.isFunction(queue.callbackFun)) {
                        queue.callbackFun($that);
                    }
                    queue.elements[i] = null;
                }
            }
        }
    };

    $.fn.do_lqCountdown = function(opt) {
        if(!$.lqCountdown.queue["s"+opt.speed]) {
            $.lqCountdown.queue["s"+opt.speed] = {};
            $.lqCountdown.queue["s"+opt.speed].elements = [];
            $.extend($.lqCountdown.queue["s"+opt.speed], opt);
        }
        this.each(function() {
            $.lqCountdown.queue["s"+opt.speed].elements.push(this);
        });
        $.lqCountdown.timer(opt.speed);
    };

    $.fn.lqCountdown = function(options) {
        var $that = this,
        defaults = {
            speed: 1000,
            timerFun: function(obj, t) {
                $(obj).html(t.h + ":" + t.m + ":" + t.s + " " + t.ms);
            },
            callbackFun: function(obj) {
            }
        },
        opt = $.extend(defaults, options);
        if($.lqCountdown.time_diff === 0 && $.lqCountdown.time_file !== false) {
            $.ajax({
                url: $.lqCountdown.time_file,
                type:'HEAD',
                global: false,
                cache: false,
                beforeSend: function(xhr) {
                    $.lqCountdown.start_time = new Date().getTime();
                    //xhr.setRequestHeader("Range", "bytes=-1");
                }
            }).always(function(text, status, xhr) {
                var servertime = xhr.getResponseHeader("Date").toString();
                //var r_servertime = servertime.toDate();
                var now = new Date().getTime();
                var st = new Date(servertime).getTime();
                $.lqCountdown.time_diff = Math.ceil((st - now) / 1000)*1000 || 1;
                $that.do_lqCountdown(opt);
            });
        } else {
            $that.do_lqCountdown(opt);
        }
        return this;
    };
}));