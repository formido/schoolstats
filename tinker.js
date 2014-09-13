// tinker.synchLoadScriptsFromUrls('http://cdnjs.cloudflare.com/ajax/libs/js-signals/1.0.0/js-signals.min.js',
// 		   'http://cdnjs.cloudflare.com/ajax/libs/crossroads/0.12.0/crossroads.js');

function Tinker() {};

function testLoadScripts() {
    console.log("Starting testLoadScripts...");
    count = 0;
    tinker.synchLoadScriptsFromUrls('http://cdnjs.cloudflare.com/ajax/libs/js-signals/1.0.0/js-signals.min.js',
				    'http://cdnjs.cloudflare.com/ajax/libs/crossroads/0.12.0/crossroads.js');
}

Tinker.prototype.synchLoadScriptsFromUrls = function() {
    (function load(urls) {
	var url = urls.shift();
	var s = document.createElement('script');
	s.src = url;
	(function(url, urls) {
	    s.onload = function() {
		console.log('loaded: ' + url);
		urls.length>0 && load(urls);
	    };
	})(url, urls);
	document.body.appendChild(s);
    })(Array.prototype.slice.call(arguments));
};

tinker = new Tinker();
