﻿function validateRegEx(regex, input, hintField, hintMessage) {
    // See if the input data validates OK
    if (!regex.test(input)) {
        // The data is invalid, so set the help message and return false
        if (hintField != null)
			hintField.innerHTML = hintMessage;
        return false;
    }
    else {
		// The data is OK, so clear the help message and return true
		if (hintField != null)
			hintField.innerHTML = "";
		return true;
    }
}

function validateNonEmpty(inputField, hintField) {
    // See if the input value contains any text
    return validateRegEx(/.+/, inputField.value, hintField,
        "Please enter a value.");
}

function validateName(inputField, hintField) {

	// First see if the input value contains data
    if (!validateNonEmpty(inputField, hintField))
        return false;
	// Then see if the input data contains at least 3 symbols (but less than 20)
	var minLength = 3;
	var maxLength = 20;
	var regExp = new RegExp("^[а-яА-ЯёЁa-zA-Z][а-яА-ЯёЁa-zA-Z0-9_]{" + (minLength-1) + "," + (maxLength-1) + "}$");
	var hintMessage = "Please enter a value " + minLength + " to " + maxLength +
          " characters or numbers in length (character first).";
	
	return validateRegEx(regExp, inputField.value, hintField, hintMessage);
}

function validatePassword(inputField, hintField) {

	// First see if the input value contains data
    if (!validateNonEmpty(inputField, hintField))
        return false;
	// Then see if the input data contains at least 3 symbols (but less than 20)
	var minLength = 3;
	var maxLength = 20;
	var regExp = new RegExp("^[а-яА-ЯёЁa-zA-Z0-9]{" + minLength + "," + maxLength + "}$");
	var hintMessage = "Please enter a value " + minLength + " to " + maxLength +
          " characters or numbers in length.";
	
	return validateRegEx(regExp, inputField.value, hintField, hintMessage);
}

function validateStartDateTime(inputField, hintField) {
	
	// First see if the input value contains data
    if (!validateNonEmpty(inputField, hintField))
        return false;
		
	var regExp =  /^([01]?[0-9]|2[0-3]):[0-5]\d$/;
	var hintMessage = "Please enter a correct value.";
	
	if (!validateRegEx(regExp, inputField.value, hintField, hintMessage)) {
		return false;
	}
	
	regExp = /^([01]?[0-9]|2[0-3]):[0-5]0$/;
	hintMessage = "Should be started at 00, 10, 20... minutes!";
	
	return validateRegEx(regExp, inputField.value, hintField, hintMessage);
}

function validateDuration (inputField, hintField) {
	
	// First see if the input value contains data
    if (!validateNonEmpty(inputField, hintField))
        return false;
	
	var regExp =  /^([01]?[0-9]|2[0-3]):[0-5]\d$/;
	var hintMessage = "Please enter a correct value.";
	
	if (!validateRegEx(regExp, inputField.value, hintField, hintMessage)) {
		return false;
	}
	
	regExp = /^([0]?[0-9]|10):[0-5]0$/;
	hintMessage = "Should be continued 0..10 hours and 00, 10, 20... minutes!";
	
	return validateRegEx(regExp, inputField.value, hintField, hintMessage);
}

function validatePeriod(inputField, hintField) {
	
	// First see if the input value contains data
    if (!validateNonEmpty(inputField, hintField))
        return false;
	
	var regExp =  /^\d{1,2}$/;
	var hintMessage = "Please enter a correct value (1 - 14).";
	
	return validateRegEx(regExp, inputField.value, hintField, hintMessage);
}

function validateReservationsNumber(inputField, hintField) {
	
	// First see if the input value contains data
    if (!validateNonEmpty(inputField, hintField))
        return false;
	
	var regExp =  /^\d{1,2}$/;
	var hintMessage = "Please enter a correct value (1 - 10).";
	
	return validateRegEx(regExp, inputField.value, hintField, hintMessage);
}