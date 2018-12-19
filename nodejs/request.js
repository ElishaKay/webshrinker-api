var mysql = require('mysql');
var dbconfig = require('./config/database');
let connection;
var request = require("request");

function handleDisconnect() {
  connection = mysql.createConnection(dbconfig.connection); // Recreate the connection, since
                                                  // the old one cannot be reused.
  connection.connect(function(err) {              // The server is either down
    if(err) {                                     // or restarting (takes a while sometimes).
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
    }                                     // to avoid a hot loop, and to allow our node script to
  });                                     // process asynchronous requests in the meantime.
                                          // If you're also serving http, display a 503 error.
  connection.on('error', function(err) {
    console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
      handleDisconnect();                         // lost due to either server restart, or a
    } else {                                      // connnection idle timeout (the wait_timeout
      throw err;                                  // server variable configures this)
    }
  });
}

handleDisconnect();

function insertBackslashBeforeQuotes(str){
	 var reg = /"/g;
	 var newstr = '\\"';
	 str = str.replace(reg,newstr);

	 var reg2 = /'/g;
	 return  str.replace(reg2,newstr);
}

function requestAndSave(apiUrl){
		// How to use the request library: 
	request(apiUrl, function (error, response, html) {
	  	console.log('response.body',response.body);

	  	let theDomain = JSON.parse(response.body);
		let {categories, url} = theDomain.data[0];

		for (let i = 0; i < categories.length; i++) { 
		  let {id, label, parent, score, confident} = categories[i];
	    
		  //insert data into domain table
			connection.query('INSERT IGNORE INTO domain (domain_saved_date, url, category_id, category_label, category_parent, category_score, category_confident) VALUES (NOW(),?,?,?,?,?,?)',
				[url, id, label, parent, score, confident], function (err, result, fields) {
			    if (err){
			    	console.log('sql error: ',err)
			    	handleDisconnect();
				};
				console.log('sql result: ',result);
			});

		}
	});	
}

let apiUrls = ['https://api.webshrinker.com/categories/v3/eW91dHViZS5jb20=?key=f7byZqBIJTnNVTkYLRty&hash=2e3432e11bc5a7ef360d0c4a4a962fc5','https://api.webshrinker.com/categories/v3/YmxvZ2dlci5jb20=?key=f7byZqBIJTnNVTkYLRty&hash=dddcf3170968efb0bd1e3e5874909d42','https://api.webshrinker.com/categories/v3/d29yZHByZXNzLm9yZw==?key=f7byZqBIJTnNVTkYLRty&hash=6021f21624cc2bce0d35c70e49f5f75d','https://api.webshrinker.com/categories/v3/bWljcm9zb2Z0LmNvbQ==?key=f7byZqBIJTnNVTkYLRty&hash=6cb3b6c3a9068782c8b1887a350242ad','https://api.webshrinker.com/categories/v3/bGlua2VkaW4uY29t?key=f7byZqBIJTnNVTkYLRty&hash=b43d34d4e1fb2f61c5354d4704585930','https://api.webshrinker.com/categories/v3/d2lraXBlZGlhLm9yZw==?key=f7byZqBIJTnNVTkYLRty&hash=7362db291299352d4b1f342ba0246306','https://api.webshrinker.com/categories/v3/cGludGVyZXN0LmNvbQ==?key=f7byZqBIJTnNVTkYLRty&hash=53b1941425267df2263454f1b1950cb7','https://api.webshrinker.com/categories/v3/YXBwbGUuY29t?key=f7byZqBIJTnNVTkYLRty&hash=0050310ae641df99b8f5eb0aee0ca0c1','https://api.webshrinker.com/categories/v3/dmltZW8uY29t?key=f7byZqBIJTnNVTkYLRty&hash=a6d58be58f03aa7da6ed4aa1597f6741','https://api.webshrinker.com/categories/v3/Z29vLmds?key=f7byZqBIJTnNVTkYLRty&hash=446f326690b0141a1bbe3c8806d43dfb','https://api.webshrinker.com/categories/v3/YW1hem9uLmNvbQ==?key=f7byZqBIJTnNVTkYLRty&hash=6b343ac6434bcb22d15a6042576a4059','https://api.webshrinker.com/categories/v3/Yml0Lmx5?key=f7byZqBIJTnNVTkYLRty&hash=8aebc97c5438f3a69a076c26764941a6','https://api.webshrinker.com/categories/v3/YWRvYmUuY29t?key=f7byZqBIJTnNVTkYLRty&hash=0ed84e1992ff76b358373f3ec2f59a4e','https://api.webshrinker.com/categories/v3/ZmxpY2tyLmNvbQ==?key=f7byZqBIJTnNVTkYLRty&hash=478ec967975a29e9ca866429d7626582','https://api.webshrinker.com/categories/v3/Z29vZ2xlLmRl?key=f7byZqBIJTnNVTkYLRty&hash=521638c1acecc2ca980c1bd0d25a9f34','https://api.webshrinker.com/categories/v3/d2VlYmx5LmNvbQ==?key=f7byZqBIJTnNVTkYLRty&hash=a5bf21fc39db85999bf4e3c4ce921ee6','https://api.webshrinker.com/categories/v3/eWFob28uY29t?key=f7byZqBIJTnNVTkYLRty&hash=54ce668cbbae74b8afa1bcae0d5b94e9','https://api.webshrinker.com/categories/v3/dC5jbw==?key=f7byZqBIJTnNVTkYLRty&hash=cef60819b20723c44b486656ed6e5147','https://api.webshrinker.com/categories/v3/Y2xvdWRmbGFyZS5jb20=?key=f7byZqBIJTnNVTkYLRty&hash=e6685a2905c31b4a6db610adec60ca4c','https://api.webshrinker.com/categories/v3/YmFpZHUuY29t?key=f7byZqBIJTnNVTkYLRty&hash=f518ab1442539898ee2616f6f5363d40','https://api.webshrinker.com/categories/v3/ZWMuZXVyb3BhLmV1?key=f7byZqBIJTnNVTkYLRty&hash=298fc56b9af3ee7d4c91dbff4e318a6c','https://api.webshrinker.com/categories/v3/bnl0aW1lcy5jb20=?key=f7byZqBIJTnNVTkYLRty&hash=bd26a551ee8011bdca1ebf9c8717aecf','https://api.webshrinker.com/categories/v3/dzMub3Jn?key=f7byZqBIJTnNVTkYLRty&hash=36cb2013966660ef86c9f1ec823da0bb','https://api.webshrinker.com/categories/v3/eWFuZGV4LnJ1?key=f7byZqBIJTnNVTkYLRty&hash=3fa6fa2e90b79e2a2f6760a7327d45e1','https://api.webshrinker.com/categories/v3/YmJjLmNvLnVr?key=f7byZqBIJTnNVTkYLRty&hash=57470f01fb0763a6207662514df76f81','https://api.webshrinker.com/categories/v3/Z29kYWRkeS5jb20=?key=f7byZqBIJTnNVTkYLRty&hash=36a26b60e9d3a6aa2b54ea84585f5c4a','https://api.webshrinker.com/categories/v3/c291bmRjbG91ZC5jb20=?key=f7byZqBIJTnNVTkYLRty&hash=1d4d5625acebf1eb0d743c855c384a2e','https://api.webshrinker.com/categories/v3/Z2l0aHViLmNvbQ==?key=f7byZqBIJTnNVTkYLRty&hash=fdbdc3892a5434d91c2ef7b80ca71e6c','https://api.webshrinker.com/categories/v3/Y3JlYXRpdmVjb21tb25zLm9yZw==?key=f7byZqBIJTnNVTkYLRty&hash=b446bf52758a96bfb99ac53113218215','https://api.webshrinker.com/categories/v3/bW96aWxsYS5vcmc=?key=f7byZqBIJTnNVTkYLRty&hash=28ddc532c8ac5b38f8138bf223c6a53a','https://api.webshrinker.com/categories/v3/dGhlZ3VhcmRpYW4uY29t?key=f7byZqBIJTnNVTkYLRty&hash=8c406521e2c7a461c17cc861b8a500c9','https://api.webshrinker.com/categories/v3/Y25uLmNvbQ==?key=f7byZqBIJTnNVTkYLRty&hash=d479f9732f9f0946769f0049f462e4b0','https://api.webshrinker.com/categories/v3/Z3JhdmF0YXIuY29t?key=f7byZqBIJTnNVTkYLRty&hash=184bdbb35ea7da2953b8a3a0518b0e61','https://api.webshrinker.com/categories/v3/ZmVlZGJ1cm5lci5jb20=?key=f7byZqBIJTnNVTkYLRty&hash=b8e557dcc63f0d9f27a2576da91b5855','https://api.webshrinker.com/categories/v3/Z29vZ2xlLmNvLmpw?key=f7byZqBIJTnNVTkYLRty&hash=dc72d649145955009b1eb1ca522be486','https://api.webshrinker.com/categories/v3/aXNzdXUuY29t?key=f7byZqBIJTnNVTkYLRty&hash=845530f27fec3f77f8bbce3933b4d524','https://api.webshrinker.com/categories/v3/dGlueXVybC5jb20=?key=f7byZqBIJTnNVTkYLRty&hash=04ffcdc11be86617373a0b5264fa9377','https://api.webshrinker.com/categories/v3/YW1hem9uYXdzLmNvbQ==?key=f7byZqBIJTnNVTkYLRty&hash=ecd04cafa7e14637fea867cb7b1ab52b','https://api.webshrinker.com/categories/v3/Zm9yYmVzLmNvbQ==?key=f7byZqBIJTnNVTkYLRty&hash=2cf2a6e471a9427b440b1fac85a2f56a','https://api.webshrinker.com/categories/v3/c2luYS5jb20uY24=?key=f7byZqBIJTnNVTkYLRty&hash=5ebdf18318356de8dff23b729815aba9','https://api.webshrinker.com/categories/v3/b3BlcmEuY29t?key=f7byZqBIJTnNVTkYLRty&hash=5c337987d9b0f51ec5175124900e3fd7','https://api.webshrinker.com/categories/v3/YXJjaGl2ZS5vcmc=?key=f7byZqBIJTnNVTkYLRty&hash=570fa00d1cec051e6ff39fe108e1245b','https://api.webshrinker.com/categories/v3/Z29vZ2xldXNlcmNvbnRlbnQuY29t?key=f7byZqBIJTnNVTkYLRty&hash=dbf86ababecf381e044cebb061b92324','https://api.webshrinker.com/categories/v3/Z29vZ2xlLmNvLnVr?key=f7byZqBIJTnNVTkYLRty&hash=67483a4cbd8302f8d0a00aeccf5a6d45','https://api.webshrinker.com/categories/v3/d2lraW1lZGlhLm9yZw==?key=f7byZqBIJTnNVTkYLRty&hash=73efecf338ca73bdba6c1f697be3d1f0','https://api.webshrinker.com/categories/v3/ZXRzeS5jb20=?key=f7byZqBIJTnNVTkYLRty&hash=e98b2966eeef3df7b0c2fd6178ab0711','https://api.webshrinker.com/categories/v3/amltZG8uY29t?key=f7byZqBIJTnNVTkYLRty&hash=ee0774cd39cd29872c114dd829e20f95','https://api.webshrinker.com/categories/v3/aHVmZmluZ3RvbnBvc3QuY29t?key=f7byZqBIJTnNVTkYLRty&hash=cc34ecb7b3a69359fa3385a717f86e78'];

for (let i = 0; i < apiUrls.length; i++) { 
	requestAndSave(apiUrls[i]);
}

