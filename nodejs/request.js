var request = require("request");

	// How to use the request library: 
request('https://api.webshrinker.com/categories/v3/Z29vZ2xlLmNvbQ==?key=f7byZqBIJTnNVTkYLRty&hash=f1d9636a4222402e45ad122d8f9d558d', function (error, response, html) {
  	console.log('response',response.body);
});