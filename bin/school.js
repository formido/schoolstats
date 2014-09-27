#!/usr/bin/env phantomjs

// STUDENT_ID=id PORTAL_PIN=username PORTAL_PASS=password phantomjs --web-security=false school1.js

phantom.injectJs('tinker.js');
tinker.synchLoadScriptsFromUrls('http://localhost:8080/skewer');

phantom.injectJs('js-signals.min.js');
phantom.injectJs('crossroads.js');

crossroads.ignoreState = true;

console.info = function (msg) {
    require("system").stderr.write(msg + '\n');
};

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
}

function ensureStudentSelected(Id) {
  var el = jQuery('#' + Id);
  if (el.css('display') !== 'none') {
    jQuery('#' + Id).click();
  }
}

function isStudentSelected(Id) {
  return jQuery('#' + Id).css('display') === 'none';
}

function selectStudent(Id) {
  jQuery('#' + Id).click();
}

system = require('system');

crossroads.addRoute('https://qweb.venturausd.org/parentportal/', function() {
  page.evaluate(login, [system.env.PORTAL_PIN, 
			system.env.PORTAL_PASS]);
});

crossroads.addRoute('https://qweb.venturausd.org/ParentPortal/Home/PortalMainPage', function() {
  var Id = system.env.STUDENT_ID;
  if (!page.evaluate(isStudentSelected, Id)) {
    page.evaluate(selectStudent, Id);
  } else {
    json = page.evaluate(function() {
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
	return jQuery('table[id^=tblassign]').map(function() {
	  return course(this);
	}).get();
      }

      return JSON.stringify(report());
    });
    console.log(json);
    phantom.exit();
  }
});

var webPage = require('webpage');
var page = webPage.create();
page.viewportSize = {"height":300, "width": 1237};
//page.open('https://qweb.venturausd.org/ParentPortal/');

page.onConsoleMessage = function(msg) {
    console.info(msg);
};

page.onLoadFinished = function(status) {
    console.info('Status: ' + status);
    console.info('Url: ' + page.url);

    crossroads.parse(page.url);

  // Do other things here...
};

var dev;

function optionParser() {   
  var opt = 0;
  while((opt < phantom.args.length) && (phantom.args[opt][0]=='-')) {
    var sw = phantom.args[opt];
    switch(sw) {
    case '--development':
      opt++;
      dev = true;
      break;
    case '-d':
      opt++;
      dev = true;
      break;
    default:
      console.log('Unknown switch: ' + phantom.args[opt]);
      phantom.exit();
      break;
    }
    opt++;
  }
}

optionParser();

if (dev) {
  tinker.synchLoadScriptsFromUrls('http://localhost:8080/skewer');
  console.info('...development');
} else {
  console.info('...production');
  page.open('https://qweb.venturausd.org/ParentPortal/');
}
