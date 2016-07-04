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

  // Do other things here...
};

function search() {
    jQuery('a[href="/search"]').trigger('mouseover');
    jQuery('input#basic_search_query_footer').val('san francisco');
    jQuery('#site-nav-right form[action="/search"]').submit();
};

function testing() {
    return "hello world!";
}

function login() {
    jQuery("input[name='username']").val('formido');
    jQuery("input[name='password']").val('tcttkopd');
    jQuery("input[value='Log in']")[0].click();
};

function getName() {
    return jQuery('a').filter(function() {
	return jQuery(this).text() == 'formido';
    }).text();
};

/* TESTING AIDS */

(function testAndRender() {
   page.evaluate(function() {

       return "what";

   });

    page.render("pics/state.png");

})();

(function quickertest() {
   return page.evaluate(function() {

       return "Sinbad";

});})();

function quicktest() {
   return page.evaluate(function() {

       return "what";

});};

function testfun() {
    return page.evaluate(

	picture

);};


    
