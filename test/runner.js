// Source: https://medium.com/@ivanmontiel/using-that-headless-chrome-youve-been-hearing-about-543a8cc07af5

const path = require('path');
const browser = require('./browser');
const options = require('./options');

before(function(done) {
	browser.setOptions(options);
	browser.setUp(done);
});

after(function() {
	browser.close();
});
