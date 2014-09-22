// PHJS_USER=username PHJS_PASS=password phantomjs --web-security=false school1.js

phantom.injectJs('tinker.js');
tinker.synchLoadScriptsFromUrls('http://localhost:8080/skewer');

phantom.injectJs('js-signals.min.js');
phantom.injectJs('crossroads.js');

crossroads.ignoreState = true;

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

crossroads.addRoute('https://qweb.venturausd.org/parentportal/', function() {
  var system = require('system');
  var user = system.env.PHJS_USER;
  var pass = system.env.PHJS_PASS;

  page.evaluate(function(credentials) {
    jQuery('input#Pin').val(credentials[0]);
    jQuery('input#Password').val(credentials[1]);
    jQuery('input#LoginButton').click();
    console.log("finished login...");
  }, [user, pass]);
});

var webPage = require('webpage');
var page = webPage.create();
page.viewportSize = {"height":300, "width": 1237};
//page.open('https://qweb.venturausd.org/ParentPortal/');

page.onConsoleMessage = function(msg, lineNum, sourceId) {
    console.log('CONSOLE: ' + msg + ' (from line #' + lineNum + ' in "' + sourceId + '")');
};

page.onLoadFinished = function(status) {
    console.log('Status: ' + status);
    console.log('Url: ' + page.url);

    crossroads.parse(page.url);

  // Do other things here...
};

