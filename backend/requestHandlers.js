var fs = require("fs"); 
var url = require("url");
var dataHandlers = require("./dataHandlers");
var validators = require("./validators");

//send information about reservations and clients to client side
//this request has no parameters
function load(request, response) {
	
	var result = {
		clients: dataHandlers.getClients(),
		reservations: dataHandlers.getReservations()
	}
	response.writeHead(200, {"Content-Type": "application/json",});
	response.write(JSON.stringify(result)); 
	response.end();
}

//validate request parameters (definition, data type)
//add new reservations
function add(request, response) {
	
	var urlParams = url.parse(request.url, true);
	
	try {
		validators.validateIsDefined(urlParams.query, ["client", "password", "startDateTime", 
			"endDateTime", "period", "reservationsNumber"]);
		validators.validateClientName(urlParams.query.client);
		validators.validatePassword(urlParams.query.password);
		validators.validateDateTime(urlParams.query.startDateTime, urlParams.query.endDateTime);
		validators.validatePeriod(urlParams.query.period);
		validators.validateReservationsNumber(urlParams.query.reservationsNumber);
	}
	catch(e) {
	
		response.writeHead(200, {"Content-Type": "application/json",});
		response.write(JSON.stringify({
			message: e.message
		})); 
		response.end();
		return;
	}
	
	var result = dataHandlers.addData(
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

//validate request parameters (definition, data type)
//cancel one reservation
function cancelReservation(request, response) {

	var urlParams = url.parse(request.url, true);
	
	try {
		validators.validateIsDefined(urlParams.query, ["id", "password"]);
		validators.validateId(urlParams.query.id);
		validators.validatePassword(urlParams.query.password);
	}
	catch(e) {
	
		response.writeHead(200, {"Content-Type": "application/json",});
		response.write(JSON.stringify({
			message: e.message,	
		})); 
		response.end();
		return;
	}
	
	var result = dataHandlers.cancelReservation(urlParams.query.id, urlParams.query.password);
	
	response.writeHead(200, {"Content-Type": "application/json",});
	response.write(JSON.stringify(result)); 
	response.end();
}

//validate request parameters (definition, data type)
//cancel some reservations
function cancelSequence(request, response) {

	var urlParams = url.parse(request.url, true);
	
	try {
		validators.validateIsDefined(urlParams.query, ["sequence", "password"]);
		validators.validateSequence(urlParams.query.sequence);
		validators.validatePassword(urlParams.query.password);
	}
	catch(e) {
	
		response.writeHead(200, {"Content-Type": "application/json",});
		response.write(JSON.stringify({
			message: e.message,	
		})); 
		response.end();
		return;
	}
	
	var result = dataHandlers.cancelSequence(urlParams.query.sequence, urlParams.query.password);
	
	response.writeHead(200, {"Content-Type": "application/json",});
	response.write(JSON.stringify(result)); 
	response.end();
}


exports.load = load;
exports.add = add;
exports.cancelReservation = cancelReservation;
exports.cancelSequence = cancelSequence;