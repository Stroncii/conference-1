var dataStorage = require("./dataStorage");

var clientsArray;
var namesArray = new Array();
var reservationsArray;

var nextId = 1;
var nextSequence = 1;

initData();

function initData() {

	clientsArray = dataStorage.getClients();
	reservationsArray = dataStorage.getReservations();
	for (var i = 0; i < clientsArray.length; i++) {
		namesArray.push(clientsArray[i].name);
	}
	
	for (var i = 0, j = reservationsArray.length; i < j; i++) {
	
		if (reservationsArray[i].id >= nextId) {
			nextId = reservationsArray[i].id + 1;
		}
		
		if (reservationsArray[i].sequence >= nextSequence) {
			nextSequence = reservationsArray[i].sequence + 1;
		}
	}
}

function getClients() {
	return clientsArray;
}

function getReservations() {
	return reservationsArray;
}

function addData(name, password, startDateTime, endDateTime, period, reservationsNumber) {

	var newClients = new Array();
	var newReservations = new Array();
	var sequence = 0;

	if (namesArray.indexOf(name) == -1) {
		newClients.push({name: name, password: password});
	}
	
	if (reservationsNumber > 1) {
		sequence = nextSequence;
		nextSequence++;
	}
	
	for (var i = 0; i < reservationsNumber; i++) {	
		
		newReservations.push(
			{	id: nextId,
				client: name,
				startDateTime: startDateTime,
				endDateTime: endDateTime,
				sequence: sequence
			});
		
		nextId++;
		startDateTime.setDate(startDateTime.getDate() + period);
		endDateTime.setDate(endDateTime.getDate() + period);
	}
	
	dataStorage.addClients(newClients);
	dataStorage.addReservations(newReservations);
	
	clientsArray = clientsArray.concat(newClients);
	reservationsArray = reservationsArray.concat(newReservations);
	
	return	{
				message: "Server message: new reservations were successfully added",
				clients: newClients,
				reservations: newReservations
			}
}

function cancelReservation() {
	
}

function cancelSequence() {

}

exports.getClients = getClients;
exports.getReservations = getReservations;
exports.addData = addData;
exports.cancelReservation = cancelReservation;
exports.cancelSequence = cancelSequence;