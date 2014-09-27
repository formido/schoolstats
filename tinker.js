function Tinker() {};
//   phantom.onError = function(msg, trace) {
//     var msgStack = ['PHANTOM ERROR: ' + msg];
//     if (trace) {
//       msgStack.push('TRACE:');
//       trace.forEach(function(t) {
//         msgStack.push(' -> ' + (t.file || t.sourceURL) + ': ' + t.line + (t.function ? ' (in function ' + t.function +')' : ''));
//       });
//     }
//     console.error(msgStack.join('\n'));
//     phantom.exit(1);
//   };

//   phantom.injectJs('js-signals.min.js');
//   phantom.injectJs('crossroads.min.js');

//   var webPage = require('webpage');
//   this.page = webPage.create();

//   this.page.onConsoleMessage = function(msg, lineNum, sourceId) {
//     console.log('CONSOLE: ' + msg + ' (from line #' + lineNum + ' in "' + sourceId + '")');
//   };

//   this.page.onLoadFinished = function(status) {
//     console.log('Status: ' + status);
//     console.log('Url: ' + this.page.url);
//     crossroads.parse(this.page.url);

//     // Do other things here...
//   };

// };

// function testLoadScripts() {
//     console.log("Starting testLoadScripts...");
//     count = 0;
//     tinker.synchLoadScriptsFromUrls('http://cdnjs.cloudflare.com/ajax/libs/js-signals/1.0.0/js-signals.min.js',
// 				    'http://cdnjs.cloudflare.com/ajax/libs/crossroads/0.12.0/crossroads.js');
// }

Tinker.prototype.synchLoadScriptsFromUrls = function() {
    (function load(urls) {
	var url = urls.shift();
	var s = document.createElement('script');
	s.src = url;
	(function(url, urls) {
	    s.onload = function() {
		console.info('loaded: ' + url);
		urls.length>0 && load(urls);
	    };
	})(url, urls);
	document.body.appendChild(s);
    })(Array.prototype.slice.call(arguments));
};

tinker = new Tinker();



