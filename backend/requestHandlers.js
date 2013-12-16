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
				new Date(parseInt(urlParams.query.startDateTime)),
				new Date(parseInt(urlParams.query.endDateTime)),
				parseInt(urlParams.query.period),
				parseInt(urlParams.query.reservationsNumber));
	
	response.writeHead(200, {"Content-Type": "application/json",});
	response.write(JSON.stringify(result)); 
	response.end();
}

function cancelReservation(request, response) {

	var urlParams = url.parse(request.url, true);
	
	result = dataHandlers.cancelReservation(urlParams.query.id);
	
	response.writeHead(200, {"Content-Type": "application/json",});
	response.write(JSON.stringify(result)); 
	response.end();
}

function cancelSequence(request, response) {

	var urlParams = url.parse(request.url, true);
	
	result = dataHandlers.cancelSequence(urlParams.query.sequence);
	
	response.writeHead(200, {"Content-Type": "application/json",});
	response.write(JSON.stringify(result)); 
	response.end();
}


exports.load = load;
exports.add = add;
exports.cancelReservation = cancelReservation;
exports.cancelSequence = cancelSequence;