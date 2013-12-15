var jf = require('jsonfile');

var clientsFile = "./datafiles/clients.json";
var reservationsFile = "./datafiles/reservations.json";

function getClients() {

	var clients = require(clientsFile);
	return clients;
}

function getReservations() {

	var reservations = require(reservationsFile);
	/*for (var i = 0; i < reservations.length; i++) {
		reservations[i].startDateTime = new Date(reservations[i].startDateTime.year, reservations[i].startDateTime.month, reservations[i].startDateTime.day,
						reservations[i].startDateTime.hour, reservations[i].startDateTime.minute);
		reservations[i].endDateTime = new Date(reservations[i].endDateTime.year, reservations[i].endDateTime.month, reservations[i].endDateTime.day,
						reservations[i].endDateTime.hour, reservations[i].endDateTime.minute);
	}*/
	return reservations;
}

function addClients(newClients) {
		
	if (newClients.length == 0) {
		return;
	}	
		
	var clients = require(clientsFile);
	clients = clients.concat(newClients)	
		
	jf.writeFile(clientsFile, clients, function(err) {
		console.log(err);
	});
}

function addReservations(newReservations) {
	
	if (newReservations.length == 0) {
		return;
	}
	
	var reservations = require(reservationsFile);
	reservations = reservations.concat(newReservations)	
		
	jf.writeFile(reservationsFile, reservations, function(err) {
		console.log(err);
	});
}

function cancelReservation() {

}

function cancelSequence() {

}

exports.getClients = getClients;
exports.getReservations = getReservations;
exports.addClients = addClients;
exports.addReservations = addReservations;
exports.cancelReservation = cancelReservation;
exports.cancelSequence = cancelSequence;