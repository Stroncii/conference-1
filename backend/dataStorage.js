var jf = require('jsonfile');

var clientsFile = "./datafiles/clients.json";
var reservationsFile = "./datafiles/reservations.json";

function getClients() {

	var clients = require(clientsFile);
	return clients;
}

function getReservations() {

	var reservations = require(reservationsFile);
	return reservations;
}

function addClients(newClients) {
		
	if (newClients.length == 0) {
		return;
	}	
		
	var clients = jf.readFileSync(clientsFile);
	clients = clients.concat(newClients);	
	
	jf.writeFileSync(clientsFile, clients);	
}

function addReservations(newReservations) {
	
	var reservations = jf.readFileSync(reservationsFile);
	reservations = reservations.concat(newReservations);	
	
	jf.writeFileSync(reservationsFile, reservations);	
}

function cancelReservation(id) {
	
	var reservations = jf.readFileSync(reservationsFile);
	
	for (var i = 0, j = reservations.length; i < j; i++) {
		if (reservations[i].id == id) {
			reservations.splice(i, 1);
			break;
		}
	}
		
	jf.writeFileSync(reservationsFile, reservations);	
}

function cancelSequence(sequence) {

	var currentDate = new Date();
	var reservations= jf.readFileSync(reservationsFile);
	
	for (var i = 0; i < reservations.length; i++) {
		if (reservations[i].sequence == sequence && reservations[i].startDateTime > currentDate) {
			reservations.splice(i, 1);
			i--;
		}
	}
	
	jf.writeFileSync(reservationsFile, reservations);	
}

exports.getClients = getClients;
exports.getReservations = getReservations;
exports.addClients = addClients;
exports.addReservations = addReservations;
exports.cancelReservation = cancelReservation;
exports.cancelSequence = cancelSequence;