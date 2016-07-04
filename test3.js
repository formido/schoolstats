phantom.injectJs('jquery.min.js');
console.log($.fn.jquery);

phantom.injectJs('test-inc.js');
console.log(testme);

// phantom.injectJs('http://ec2-54-91-117-181.compute-1.amazonaws.com:8000/static/test.js');
// console.log(foo);

var page = require('webpage').create();
page.onConsoleMessage = function(msg) {
    console.log(msg);
};

page.onLoadFinished = function(status) {
    page.evaluate(function() {
	console.log('url: ' + document.location.href);
    });
};

page.open('http://news.ycombinator.com/', function(status) {
    page.evaluate(function() {
	console.log(document.title);
    });
});

phantom.exit();
