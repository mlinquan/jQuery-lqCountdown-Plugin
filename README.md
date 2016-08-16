#jQuery-lqCountdown-Plugin

A jQuery countdown plugin.

##Usage
```html
2016-12-31 00:00:00 <span class="countdown" data-endtime="2016-12-31 00:00:00"></span>
2016-12-31 00:00:00 <span class="countdown2" data-endtime="2016-12-31 00:00:00"></span>
```

```js
$('.countdown').lqCountdown({
    speed: 1000,
    timerFun: function(obj, t, left_time) {
        obj.html(left_time);
    },
    callbackFun: function(obj) {
        obj.html('Done');
    }
});
$('.countdown2').lqCountdown({
    speed: 100,
    timerFun: function(obj, t, left_time) {
        obj.html(left_time);
    },
    callbackFun: function(obj) {
        obj.html('Done');
    }
});
```