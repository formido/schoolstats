phantom.injectJs('tinker.js');
tinker.synchLoadScriptsFromUrls('http://localhost:8080/skewer');
tinker.synchLoadScriptsFromUrls('http://cdnjs.cloudflare.com/ajax/libs/js-signals/1.0.0/js-signals.min.js',
		   'http://cdnjs.cloudflare.com/ajax/libs/crossroads/0.12.0/crossroads.js');

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

page.onConsoleMessage = function(msg, lineNum, sourceId) {
    console.log('CONSOLE: ' + msg + ' (from line #' + lineNum + ' in "' + sourceId + '")');
};

page.onLoadFinished = function(status) {
    console.log('Status: ' + status);
    console.log('Url: ' + page.url);
    crossroads.parse(page.url);

  // Do other things here...
};

function login() {
    console.log('logging in...');
    $('#Pin').val('501825775');
    $('#Password').val('tcttkopd');
    $('#LoginButton')[0].click();
}

page.evaluate(function() {
    $('#Pin').val('501825775');
    $('#Password').val('tcttkopd');
    console.log($('#Pin').val());
    console.log($('#Password').val());
    $('#LoginButton').click();
});
    

crossroads.ignoreState = true;
crossroads.addRoute('https://qweb.venturausd.org/parentportal/2', login);

