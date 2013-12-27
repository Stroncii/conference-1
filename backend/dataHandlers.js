var dataStorage = require("./dataStorage");

var clientsArray;
var reservationsArray;

var nextReservationId = 1;
var nextClientId = 1;

var nextSequence = 1;

initData();

//initialization of clientArray, reservationArray (load info from database),
//next id, next sequence (calculate)
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

//return arrays to request handler
function getClients() {	
	return withoutPasswords(clientsArray);
}

function getReservations() {
	return reservationsArray;
}

//validate new reservation entry (is password correct, this reservation covers another one or not)
//add it to database and local array
function addData(name, password, startDateTime, endDateTime, period, reservationsNumber) {

	var newClients = new Array();
	var newReservations = new Array();
	var sequence = 0;
	
	var newReservationsOwner = getClientByName(name);
	
	//if reservation's owner isn't in database - create him
	if (newReservationsOwner == null) {
		newReservationsOwner = {id: nextClientId, name: name, password: password}
		newClients.push(newReservationsOwner);
		nextClientId++;
	}
	//check password
	if (newReservationsOwner.password != password) {
		return	{ message: "Server message: wrong password" };
	}
	 
	if (reservationsNumber > 1) {
		sequence = nextSequence;
		nextSequence++;
	}
	//create one or more Reservation objects
	for (var i = 0; i < reservationsNumber; i++) {	
		
		if (!checkReservationPossibility(startDateTime, endDateTime)) {
			return { message: "Server message: this reservation covers another one!" };
		}
		
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
	//store created client and reservations in database
	dataStorage.addClients(newClients);
	dataStorage.addReservations(newReservations);
	//return created client and reservations as one object
	clientsArray = clientsArray.concat(newClients);
	reservationsArray = reservationsArray.concat(newReservations);
	
	return	{
				message: "Server message: new reservations were successfully added",
				clients: withoutPasswords(newClients),
				reservations: newReservations
			}
}

//validate id - find corresponding reservation and its owner
//if this reservation in array and not finished - remove it
//from database and local array
function cancelReservation(reservationId, name, password) {
	
	var client = getReservationOwner(reservationId);
	if (client == null) {
		return	{ message: "Server message: cannot find owner of this reservation" };
	}
	if (client.name != name) {
		return	{ message: "Server message: This reservation was made by another user! You can not cancel it." };
	}
	if (client.password != password) {
		return	{ message: "Server message: wrong password" };
	}
	
	var currentDate = Date.now();
	
	for (var i = 0, j = reservationsArray.length; i < j; i++) {
	
		if (reservationsArray[i].id == reservationId) {
		
			if (reservationsArray[i].startDateTime < currentDate) {
				return	{ message: "Server message: cannot cancel finished conference" };
			}
		
			reservationsArray.splice(i, 1);	
			dataStorage.cancelReservation(reservationId);
			break;
		}
	}
	
	return	{
				message: "Server message: reservation was successfully cancelled",
				canceledReservationId: reservationId
			};
}

//validate sequence - find corresponding reservations and their owner
//if these reservations are in array and not finished - remove them
//from database and local array
function cancelSequence(sequence, name, password) {

	var client = getSequenceOwner(sequence);
	if (client == null) {
		return	{ message: "Server message: cannot find owner of this sequence"	};
	}
	if (client.name != name) {
		return	{ message: "Server message: This reservation was made by another user! You can not cancel it." };
	}
	if (client.password != password) {
		return	{ message: "Server message: wrong password" };
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
				message: "Server message: all unfinished reservations from this sequence were successfully cancelled",
				canceledSequence: sequence
			};
}

exports.getClients = getClients;
exports.getReservations = getReservations;
exports.addData = addData;
exports.cancelReservation = cancelReservation;
exports.cancelSequence = cancelSequence;

//auxiliary functions

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
//return clientsArray without passwords (to send them to client side)
function withoutPasswords(clients) {

	var result = new Array();
	
	for (var i = 0, j = clients.length; i < j; i++) {
		result.push({id: clients[i].id, name:  clients[i].name});
	}
	
	return result;
}
//see if reservation covers another one
function checkReservationPossibility(startDateTime, endDateTime) {

	for (var i = 0, j = reservationsArray.length; i < j; i++) {
			
		if ((reservationsArray[i].startDateTime < startDateTime && startDateTime < reservationsArray[i].endDateTime) ||
			(reservationsArray[i].startDateTime < endDateTime   && endDateTime   < reservationsArray[i].endDateTime) ||
			(startDateTime < reservationsArray[i].startDateTime && reservationsArray[i].startDateTime < endDateTime) ||
			(startDateTime < reservationsArray[i].endDateTime   && reservationsArray[i].endDateTime   < endDateTime)) {
	
			return false;
		}
	}
	return true;
}
