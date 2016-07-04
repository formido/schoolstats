phantom.injectJs('tinker.js');
tinker.synchLoadScriptsFromUrls('http://localhost:8080/skewer');
// tinker.synchLoadScriptsFromUrls('http://cdnjs.cloudflare.com/ajax/libs/js-signals/1.0.0/js-signals.min.js',
// 		   'http://cdnjs.cloudflare.com/ajax/libs/crossroads/0.12.0/crossroads.js');

phantom.onError = function(msg, trace) {
    var msgStack = ['PHANTOM ERROR: ' + msg];
    if (trace) {
        msgStack.push('TRACE:');
        trace.forEach(function(t) {
            msgStack.push(' -> ' + (t.file || t.sourceURL) + ': ' + t.line + (t.function ? ' (in function ' + t.function +')' : ''));
        });
    }
    console.error(msgStack.join('\n'));
    phantom.exit(1);
};

var webPage = require('webpage');
var page = webPage.create();
page.open('https://qweb.venturausd.org/ParentPortal/');
page.viewportSize = {"height":300, "width": 1237};

page.onConsoleMessage = function(msg, lineNum, sourceId) {
    console.log('CONSOLE: ' + msg + ' (from line #' + lineNum + ' in "' + sourceId + '")');
};

page.onLoadFinished = function(status) {
    console.log('Status: ' + status);
    console.log('Url: ' + page.url);

  // Do other things here...
};

function login() {
    jQuery('input#Pin').val('501825775');
    jQuery('input#Password').val('weenis');
    jQuery('input#LoginButton').click();
    console.log("finished...");
};

function getName() {
    return jQuery('a').filter(function() {
	return jQuery(this).text() == 'formido';
    }).text();
};
