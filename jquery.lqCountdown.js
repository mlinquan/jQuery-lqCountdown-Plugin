/**
 * jQuery-lqCountdown-Plugin
 * https://github.com/mlinquan/jQuery-lqCountdown-Plugin
 *
 * @version
 * 0.0.1 (April 16, 2015)
 *
 * @copyright
 * Copyright (C) 2015 LinQuan.
 *
 * @license
 * Dual licensed under the MIT and GPL licenses.
 */
 if (!Date.format) {
    Date.prototype.format = function(format) {
        var o = {
            "M+":this.getMonth() + (new Date("2015-01-01").getMonth() == 0 ? 1 :0),
            "d+":this.getDate(),
            "h+":this.getHours(),
            "m+":this.getMinutes(),
            "s+":this.getSeconds(),
            "q+":Math.floor((this.getMonth() + 3) / 3),
            S:this.getMilliseconds()
        };
        if (/(y+)/.test(format)) {
            format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] :("00" + o[k]).substr(("" + o[k]).length));
            }
        }
        return format;
    };
}

if (!String.toDate) {
    String.prototype.toDate = function(format) {
        var Mon = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
        var dt = this.split(", ")[1].split(" ");
        if (dt.length != 5) return;
        var y = dt[2], M = Mon.indexOf(dt[1]) + 1, m = m < 10 ? "0" + M :M, d = dt[0], time = dt[3], tzone = dt[4];;
        return new Date("" + y + "/" + M + "/" + d + " " + time + " " + tzone);
    };
}

if (!Number.cover) {
    Number.prototype.cover = function(n) {
        var nl = ("" + this).length;
        return "" + new Array(n > nl ? n - nl + 1 :0).join(0) + "" + this;
    };
}

if (!String.toDateFormat) {
    String.prototype.toDateFormat = function(format) {
        var ms = this;
        if (!Number(ms) || ms > 365*24*60*60*1000) {
            return;
        }
        if(!format) {
            format = '{d} days, {h} hours, {m} minutes, {s} seconds and {S} milliseconds.';
        }
        var o = {
            "{d+}": parseInt(ms / 1000 / 60 / 60 / 24, 10),
            "{h+}": parseInt(ms / 1000 / 60 / 60 % 24, 10),
            "{m+}": parseInt(ms / 1000 / 60 % 60, 10),
            "{s+}": parseInt(ms / 1000 % 60, 10),
            "{S+}": parseInt(ms % 1000)
        };
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] :("00" + o[k]).substr(("" + o[k]).length));
            }
        }
        return format;
    }
}

if (!Array.indexOf) {
    Array.prototype.indexOf = function(obj) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] == obj) {
                return i;
            }
        }
        return -1;
    };
}

if (!Array.remove) {
    Array.prototype.remove = function(i) {
        this.splice(i, 1);
    };
}

$.lqCountdown = {
    queue: {},
    time_file: "",
    time_diff: 0,
    start_time: "",
    timer: function(speed) {
        var queue = $.lqCountdown.queue["s" + speed];
        if(queue.elements.length == 0) {
            return;
        }
        for(var i=0;i<queue.elements.length;i++) {
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
                setTimeout(function() {
					$.lqCountdown.timer(speed);
                }, speed);
            } else {
                if(queue.callbackFun && $.isFunction(queue.callbackFun)) {
                    queue.callbackFun($that);
                }
                queue.elements.splice(i, 1);
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
    if($.lqCountdown.time_diff == 0 && $.lqCountdown.time_file) {
        $.ajax({
            url: $.lqCountdown.time_file,
            type: "get",
            global: false,
            success:function(xml,status,xhr) {
                var servertime = xhr.getResponseHeader("Date").toString();
                var r_servertime = servertime.toDate();
                var now = new Date().getTime();
                var st = new Date(servertime).getTime();
                $.lqCountdown.time_diff = (st - now);
                $that.do_lqCountdown(opt);
            },
            beforeSend: function(xhr) {
                $.lqCountdown.start_time = new Date().getTime();
                //xhr.setRequestHeader("Range", "bytes=-1");
            }
        });
    } else {
        $that.do_lqCountdown(opt);
    }
    return this;
};