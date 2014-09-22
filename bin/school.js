#!/usr/bin/env phantomjs

// var obj = {"color":"red", "size":"big"};
// console.log(JSON.stringify(obj));

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
  console.log('...development');
} else {
  console.log('...production');
  phantom.exit();
}
