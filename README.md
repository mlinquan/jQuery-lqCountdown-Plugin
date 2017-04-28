# jQuery-lqCountdown-Plugin

A jQuery countdown plugin.

## Usage
```html
2016-12-31 00:00:00 <span class="countdown" data-endtime="2016-12-31 00:00:00"></span><br>
<span class="countdown2"></span><br>
<span class="countdown3"></span>
```

```js
var now_time = new Date();
var now_time2 = new Date();
var endtime = (new Date(now_time.setMinutes(now_time.getMinutes() + 1))).toString();
var endtime2 = (new Date(now_time2.setSeconds(now_time2.getSeconds() + 10))).toString();
$('.countdown').lqCountdown({
    speed: 1000,
    timerFun: function(obj, t, left_time) {
        obj.html(JSON.stringify(t) + '' + left_time);
    },
    callbackFun: function(obj) {
        obj.html('Done');
    }
});
$('.countdown2').lqCountdown({
    speed: 100,
    endtime: endtime,
    timerFun: function(obj, t, left_time) {
        obj.html(JSON.stringify(t) + '' + left_time);
    },
    callbackFun: function(obj) {
        obj.html('Done');
    }
});
$('.countdown3').lqCountdown({
    speed: 1,
    endtime: endtime2,
    timerFun: function(obj, t, left_time) {
        obj.html(JSON.stringify(t) + '' + left_time);
    },
    callbackFun: function(obj) {
        obj.html('Done');
    }
});
```
