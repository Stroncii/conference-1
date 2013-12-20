function validateIsDefined(parametersArray, namesArray) {
	
	for(var i = 0, j = namesArray.length; i < j; i++) {
		if (parametersArray[namesArray[i]] == undefined) {
			throw ({message: "Server message: " + namesArray[i] + 
						" parameter is undefined"});
		}
	}
}

function validateClientName(clientName) {

	// See if the input data contains at least 3 symbols (but less than 20)
	var minLength = 3;
	var maxLength = 20;
	var regExp = new RegExp("^[а-яА-ЯёЁa-zA-Z][а-яА-ЯёЁa-zA-Z0-9_]{" + (minLength-1) + "," + (maxLength-1) + "}$");
	if (!regExp.test(clientName)) {
		throw ({message: "Server message: invalid name parameter"});
	}
}

function validatePassword(password) {

	// Then see if the input data contains at least 3 symbols (but less than 20)
	var minLength = 3;
	var maxLength = 20;
	var regExp = new RegExp("^[а-яА-ЯёЁa-zA-Z0-9]{" + minLength + "," + maxLength + "}$");
	if (!regExp.test(password)) {
		throw ({message: "Server message: invalid password parameter"});
	}
}

function validateDateTime(startDateTime, endDateTime) {
		
	startDateTime = parseInt(startDateTime);
	endDateTime = parseInt(endDateTime);
	if (isNaN(startDateTime) || isNaN(endDateTime)) {
		throw ({message: "Server message: one or both of date parameter are invalid (cannot parse)"});
	}
	
	startDateTime = new Date(startDateTime);
	endDateTime = new Date(endDateTime);
	if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
		throw ({message: "Server message: one of or both date parameter are invalid (cannot create Date object)"});
	}
	
	if (startDateTime.getMinutes() % 10 != 0 || endDateTime.getMinutes() % 10 != 0) {
		throw ({message: "Server message: one or both of date parameter are invalid (reservation should be continued 1..10 hours and 10, 20, 30 minutes)"});
	}
	
	/*var minDuration = 1*60*60*1000;
	var maxDuration = 10*60*60*1000;
	var duration = endDateTime.getTime() - startDateTime.getTime();
	
	if (duration < minDuration || duration > maxDuration) {
		throw ({message: "Server message: one or both of date parameter are invalid (duration not between 1 and 10 hours)"});
	}*/
}

function validatePeriod(period) {
		
	var maxPeriod = 14;
	var minPeriod = 0;
		
	period = parseInt(period);
	if (isNaN(period) || period < minPeriod || period > maxPeriod) {
		throw ({message: "Server message: invalid period parameter"});
	}
}

function validateReservationsNumber(reservationsNumber) {
		
	var maxReservationsNumber = 10;
	var minReservationsNumber = 1;
		
	reservationsNumber = parseInt(reservationsNumber);
	if (isNaN(reservationsNumber) || reservationsNumber < minReservationsNumber || 
			reservationsNumber > maxReservationsNumber) {
		throw ({message: "Server message: invalid reservationsNumber parameter"});
	}
}

function validateId(id) {
	id = parseInt(id);
	if (isNaN(id)) {
		throw ({message: "Server message: invalid id parameter"});
	}
}

function validateSequence(sequence) {
	sequence = parseInt(sequence);
	if (isNaN(sequence)) {
		throw ({message: "Server message: invalid sequence parameter"});
	}
}


exports.validateIsDefined = validateIsDefined;
exports.validateClientName = validateClientName;
exports.validatePassword = validatePassword;
exports.validateDateTime = validateDateTime;
exports.validatePeriod = validatePeriod;
exports.validateReservationsNumber = validateReservationsNumber;
exports.validateId = validateId;
exports.validateSequence = validateSequence;