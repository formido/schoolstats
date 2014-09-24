// PORTAL_PIN=username PORTAL_PASS=password phantomjs --web-security=false school1.js

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

function login(keys) {
    jQuery('input#Pin').val(keys[0]);
    jQuery('input#Password').val(keys[1]);
    jQuery('input#LoginButton').click();
    console.log("finished login...");
}

function selectStudent(Id) {
    jQuery('#' + Id).click();
}

function assignments(tbl) {
  var columns = jQuery(tbl).find('thead th').map(function() {
    return $(this).text();
  });

  return jQuery(tbl).find('tbody tr').map(function(i) {
    var row = {};
    $(this).find('td').each(function(i) {
      var rowName = columns[i];
      row[rowName] = $(this).text();
    });
    return row;
  }).get();
}

function course(tbl) {
  var course = {};
  course['name'] = jQuery(tbl).find('tr:nth-child(1)')
    .find('b:nth-child(2)').text().trim().split(" ")[0];
  course['grade'] = jQuery(tbl).find('tr:nth-child(2) td:nth-child(1)')
    .first().contents().eq(2).text().split('\n')[0];
  course['assignments'] = assignments(tbl);
  return course;
}

function report() {
  return jQuery('table[id^=tblassign').map(function() {
    return course(this);
  }).get();
}

crossroads.addRoute('https://qweb.venturausd.org/parentportal/', function() {
  var system = require('system');
  var user = system.env.PORTAL_PIN;
  var pass = system.env.PORTAL_PASS;

  page.evaluate(login, [user, pass]);
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

