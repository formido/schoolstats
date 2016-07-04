var elId = 'ctl00_userControlHeader_LoginView1_WelcomeAnonymUser';

var casper = require('casper').create({logLevel: 'debug'});

casper.options.waitTimeout = 5000;

casper.on('remote.message', function(message) {
    this.echo("hello");
});

function login() {
    console.log("hello");
    return "login go...";
    // document.querySelector('#ctl00_contentArea_Login1_UserName').value = 'bruceclayadmin';
    // document.querySelector('#ctl00_contentArea_Login1_Password').value = 'roca';
    // document.querySelector('#ctl00_contentArea_Login1_LinkButtonLogin').click();
    // return document.readyState;
    // return 7;
};

casper.start('http://tools.seotoolset.com/LoginPage.aspx?ReturnUrl=%2fManageProject.aspx%3fplaceholder%3dnone%26mode%3dedit', function() {
    this.echo(this.evaluate(login));
});

casper.then( function(){
    this.wait(2000); 
});

function testLogin() {
    return document.readyState;
};

casper.then( function(){
    this.echo("We're here!");
    this.echo(this.evaluate(testLogin));
});

// casper.waitForUrl('http://tools.seotoolset.com/ManageProject.aspx?placeholder=none&mode=edit', function() {
//     this.echo('hello');
// });

// casper.then(function() {
//     this.echo(this.getTitle());
// });

casper.run();
