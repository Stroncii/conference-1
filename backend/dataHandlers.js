var dataStorage = require("./dataStorage");

var clientsArray;
var reservationsArray;

var nextReservationId = 1;
var nextClientId = 1;

var nextSequence = 1;

initData();

function initData() {

	clientsArray = dataStorage.getClients();
	reservationsArray = dataStorage.getReservations();
	
	for (var i = 0, j = reservationsArray.length; i < j; i++) {
	
		if (reservationsArray[i].id >= nextReservationId) {
			nextReservationId = reservationsArray[i].id + 1;
		}
		
		if (reservationsArray[i].sequence >= nextSequence) {
			nextSequence = reservationsArray[i].sequence + 1;
		}
	}
	
	for (var i = 0, j = clientsArray.length; i < j; i++) {
	
		if (clientsArray[i].id >= nextClientId) {
			nextClientId = clientsArray[i].id + 1;
		}
	}
}

function getClients() {
	
	return withoutPasswords(clientsArray);
}

function getReservations() {
	return reservationsArray;
}

function addData(name, password, startDateTime, endDateTime, period, reservationsNumber) {

	var newClients = new Array();
	var newReservations = new Array();
	var sequence = 0;
	
	var newReservationsOwner = getClientByName(name);
	
	if (newReservationsOwner == null) {
		newReservationsOwner = {id: nextClientId, name: name, password: password}
		newClients.push(newReservationsOwner);
		nextClientId++;
	}
	if (newReservationsOwner.password != password) {
		return	{
					message: "Server message: wrong password",
				}
	}
	
	if (reservationsNumber > 1) {
		sequence = nextSequence;
		nextSequence++;
	}
	
	for (var i = 0; i < reservationsNumber; i++) {	
		
		newReservations.push(
			{	id: nextReservationId,
				clientId: newReservationsOwner.id,
				startDateTime: startDateTime.getTime(),
				endDateTime: endDateTime.getTime(),
				sequence: sequence
			});
		
		nextReservationId++;
		startDateTime.setDate(startDateTime.getDate() + period);
		endDateTime.setDate(endDateTime.getDate() + period);
	}
	
	dataStorage.addClients(newClients);
	dataStorage.addReservations(newReservations);
	
	clientsArray = clientsArray.concat(newClients);
	reservationsArray = reservationsArray.concat(newReservations);
	
	return	{
				message: "Server message: new reservations were successfully added",
				clients: withoutPasswords(newClients),
				reservations: newReservations
			}
}

function cancelReservation(reservationId, password) {
	
	var client = getReservationOwner(reservationId);
	if (client == null) {
		return	{
					message: "Server message: cannot find owner of this reservation",
				}
	}
	if (client.password != password) {
		return	{
					message: "Server message: wrong password",
				}
	}
	
	dataStorage.cancelReservation(reservationId);
	
	for (var i = 0, j = reservationsArray.length; i < j; i++) {
		if (reservationsArray[i].id == reservationId) {
			reservationsArray.splice(i, 1);
			break;
		}
	}
	
	return	{
				message: "Server message: reservation was successfully cancelled",
				canceledReservationId: reservationId
			}
}

function cancelSequence(sequence, password) {

	var client = getSequenceOwner(sequence);
	if (client == null) {
		return	{
					message: "Server message: cannot find owner of this sequence",
				}
	}
	if (client.password != password) {
		return	{
					message: "Server message: wrong password",
				}
	}
	
	var currentDate = Date.now();
	dataStorage.cancelSequence(sequence);
	
	for (var i = 0; i < reservationsArray.length; i++) {
		if (reservationsArray[i].sequence == sequence && reservationsArray[i].startDateTime > currentDate) {
			reservationsArray.splice(i, 1);
			i--;
		}
	}
	
	return	{
				message: "Server message: all reservations were successfully canceled",
				canceledSequence: sequence
			}
}

exports.getClients = getClients;
exports.getReservations = getReservations;
exports.addData = addData;
exports.cancelReservation = cancelReservation;
exports.cancelSequence = cancelSequence;

function getReservationOwner(reservationId) {
	
	var reservation = null;
	var client = null;
	
	for (var i = 0, j = reservationsArray.length; i < j; i++) {
		if (reservationsArray[i].id == reservationId) {
			reservation = reservationsArray[i];
			break;
		}
	}
	if (reservation == null) {
		return client;
	}
	for (var i = 0, j = clientsArray.length; i < j; i++) {
	
		if (clientsArray[i].id == reservation.clientId) {
			client = clientsArray[i];
			break;
		}
	}
	return client;
}

function getSequenceOwner(sequence) {
	
	var reservation = null;
	var client = null;
	
	for (var i = 0, j = reservationsArray.length; i < j; i++) {
		if (reservationsArray[i].sequence == sequence) {
			reservation = reservationsArray[i];
			break;
		}
	}
	if (reservation == null) {
		return client;
	}
	for (var i = 0, j = clientsArray.length; i < j; i++) {
	
		if (clientsArray[i].id == reservation.clientId) {
			client = clientsArray[i];
			break;
		}
	}
	return client;
}

function getClientByName(name) {
	
	for (var i = 0, j = clientsArray.length; i < j; i++) {
	
		if (clientsArray[i].name == name) {
			return clientsArray[i];
		}
	}
	return null;
}

function withoutPasswords(clients) {

	var result = new Array();
	
	for (var i = 0, j = clients.length; i < j; i++) {
		result.push({id: clients[i].id, name:  clients[i].name});
	}
	
	return result;
}
