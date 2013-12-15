var fs = require("fs"); 
var url = require("url");
var dataHandlers = require("./dataHandlers");


function load(request, response) {
	
	var result = {
		clients: dataHandlers.getClients(),
		reservations: dataHandlers.getReservations()
	}
	response.writeHead(200, {"Content-Type": "application/json",});
	response.write(JSON.stringify(result)); 
	response.end();
}

function add(request, response) {
	
	var urlParams = url.parse(request.url, true);
	
	result = dataHandlers.addData(
				urlParams.query.client,
				urlParams.query.password,
				new Date(urlParams.query.startDateTime),
				new Date(urlParams.query.endDateTime),
				urlParams.query.period,
				reservationsNumber = urlParams.query.reservationsNumber);
	
	response.writeHead(200, {"Content-Type": "application/json",});
	response.write(JSON.stringify(result)); 
	response.end();
}


exports.load = load;
exports.add = add;