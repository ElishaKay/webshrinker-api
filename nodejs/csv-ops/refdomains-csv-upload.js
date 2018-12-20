let fs = require('fs');
let csv = require('fast-csv');

let mysql = require('mysql');
let dbconfig = require('../config/database');
let connection = mysql.createConnection(dbconfig.connection);

var stream = fs.createReadStream("./kickstarter-refdomains.csv");
 
var csvStream = csv()
    .on("data", function(data){
         console.log(data);
         let url = data[3];
         let theFirstQuery = `SELECT domain_id FROM domain WHERE url = '${url}'`;
         
         // let theQuery = `select * from ks_campaign`;
         console.log('theQuery: ', theFirstQuery);
		    connection.query(theFirstQuery, function(err, result, fields){
					if (err) {throw err};
    				if(result.length === 0){
    					console.log('no results for first query');
    					// let theSecondQuery = `SELECT ks_user_id FROM ks_user WHERE ks_user_name LIKE concat('%','${profile_id}','%')`; 
    				} else {
    					console.log(result);

                        let domainRecords = result;
                        for (let i = 0; i < domainRecords.length; i++) { 
        					let domain_id = domainRecords[i].domain_id;


        					let domain_trust_score = data[2];
        					let number_of_backlinks = data[4];
                            let ip_address = data[5];
                            let country = data[6];
        					let theUpdateQuery = `UPDATE domain
    												SET 
                                                        domain_trust_score = '${domain_trust_score}', number_of_backlinks = '${number_of_backlinks}',
                                                        country = '${country}', ip_address = '${ip_address}'
    												WHERE domain_id='${domain_id}'`;

    						console.log('theUpdateQuery: ',theUpdateQuery);

    						connection.query(theUpdateQuery, function (err, result, fields) {
    						    if (err) throw err;
    						    console.log(result);
    						});
                        }
    				}
			});
	})
    .on("end", function(){
         console.log("done");
    });
 
stream.pipe(csvStream);
