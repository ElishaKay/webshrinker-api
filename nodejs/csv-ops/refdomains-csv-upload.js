let fs = require('fs');
let csv = require('fast-csv');

let mysql = require('mysql');
let dbconfig = require('../config/database');
let connection = mysql.createConnection(dbconfig.connection);

var stream = fs.createReadStream("./skylinyl.csv");
 
var csvStream = csv()
    .on("data", function(data){
         console.log(data);
         let profile_id = data[1];
         let theFirstQuery = `SELECT ks_user_id FROM ks_user WHERE ks_user_profile_url LIKE concat('%','${profile_id}')`;
         
         // let theQuery = `select * from ks_campaign`;
         console.log('theQuery: ', theFirstQuery);
		    connection.query(theFirstQuery, function(err, result, fields){
					if (err) {throw err};
    				if(result.length === 0){
    					console.log('no results for first query');
    					// let theSecondQuery = `SELECT ks_user_id FROM ks_user WHERE ks_user_name LIKE concat('%','${profile_id}','%')`; 
    				} else {
    					console.log(result);
    					let user_id = result[0].ks_user_id;
    					let user_email = data[3];
    					let user_country = data[4];
    					let theUpdateQuery = `UPDATE ks_user
												SET ks_user_email = '${user_email}', ks_user_country = '${user_country}' 
												WHERE ks_user_id='${user_id}'`;

						console.log('theUpdateQuery: ',theUpdateQuery);

						connection.query(theUpdateQuery, function (err, result, fields) {
						    if (err) throw err;
						    console.log(result);
						});
    				}
			});
	})
    .on("end", function(){
         console.log("done");
    });
 
stream.pipe(csvStream);
