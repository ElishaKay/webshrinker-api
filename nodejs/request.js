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


var request = require("request");

	// How to use the request library: 
request('https://api.webshrinker.com/categories/v3/Z29vZ2xlLmNvbQ==?key=f7byZqBIJTnNVTkYLRty&hash=f1d9636a4222402e45ad122d8f9d558d', function (error, response, html) {
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





	// let sql = `INSERT INTO igg_user 
	// 						(igg_user_saved_date,
	// 						igg_pledger_display_name,
	// 						igg_pledger_profile_url,
	// 						igg_time_ago,
	// 					    igg_display_amount,
	// 					    igg_display_amount_iso_code,
	// 					    igg_campaign_id	    
	// 						) 
	// 					VALUES ?`;
		
	// 	connection.query(sql, [newBackersArr], function (err, result, fields) {
	// 	    if (err){
	// 	    	console.log('sql error: ',err)
	// 	    	handleDisconnect();
	// 		};
	// 		console.log('sql result: ',result);
	// 	});
