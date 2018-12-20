let fs = require('fs');
let csv = require('fast-csv');

let mysql = require('mysql');
let dbconfig = require('../config/database');
let connection = mysql.createConnection(dbconfig.connection);

var stream = fs.createReadStream("./indiegogo-refdomains.csv");
let uniqueIGGDomains = [];

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
    					console.log(url);
                        uniqueIGGDomains.push(url);
    				} else {
    				    //
    				}
			});
	})
    .on("end", function(){
         console.log("done");
         console.log('uniqueIGGDomains: ', uniqueIGGDomains);
         console.log('uniqueIGGDomains as string: ', uniqueIGGDomains.toString());        
    });
 
stream.pipe(csvStream);

console.log('uniqueIGGDomains: ', uniqueIGGDomains);
console.log('uniqueIGGDomains as string: ', uniqueIGGDomains.toString());    