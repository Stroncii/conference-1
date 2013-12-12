var fs = require("fs"); 

function load(request, response) {
	
	response.writeHead(200, {"Content-Type": "application/json",});
	
	var data = require('./data.json');
	response.write(JSON.stringify(data)); 
	response.end();
}


exports.load = load;