function currentDate(dateParam) {
	
	if (dateParam != undefined) {
		currentDate.date = dateParam;
	}	
	return currentDate.date;
}

function showRepeatInput(isVisible) {
		
	if(isVisible == undefined) {
		return;
	}
	
	var displayStyle = (isVisible == true) ? "table-row" : displayStyle = "none";	
	$("#repeat_input").parent().nextAll(".whole_input_div").css("display", displayStyle);
}

function checkReservationPossibility(startDateTime, endDateTime) {
	
	var reservationsList = reservations().get();
	
	if (startDateTime == undefined || endDateTime == undefined) {
		return false;
	}
	
	for (var i = 0; i < reservationsList.length; i++) {
		
		if ((reservationsList[i].startDateTime <= startDateTime && startDateTime <= reservationsList[i].endDateTime) ||
			(reservationsList[i].startDateTime <= endDateTime   && endDateTime   <= reservationsList[i].endDateTime) ||
			(startDateTime <= reservationsList[i].startDateTime && reservationsList[i].startDateTime <= endDateTime) ||
			(startDateTime <= reservationsList[i].endDateTime   && reservationsList[i].endDateTime   <= endDateTime)) {
			
		//	alert(reservationsList[i].startDateTime + "\n" + reservationsList[i].endDateTime + "\n" + 
		//			startDateTime + "\n" + endDateTime);
			return false;
		}
	}
	return true;
}

function getStartDateTimeFromInput() {
	
	var startDateTimeArray = document.getElementById("start_date_time_input").value.split(":");
	
	if (startDateTimeArray.length != 2) {
		return;
	}

	var startDateTime = new Date(currentDate());
	startDateTime.setHours(parseInt(startDateTimeArray[0]));
	startDateTime.setMinutes(parseInt(startDateTimeArray[1]));
	
	return startDateTime;
}

function getEndDateTimeFromInput() {

	var startDateTime = getStartDateTimeFromInput();
	var durationArray = document.getElementById("duration_input").value.split(":");
		
	if (startDateTime == undefined || durationArray.length != 2) {
		return;
	}
	
	var endDateTime = new Date(startDateTime);
	endDateTime.setHours(endDateTime.getHours() + parseInt(durationArray[0]));
	endDateTime.setMinutes(endDateTime.getMinutes() + parseInt(durationArray[1]));

	return endDateTime;
}

//Event listeners

$(document).ready(function() {
	
	currentDate(new Date());
	clients();
	reservations();
	placeCalendar();
	showReservationsList(document.getElementById("reservations_list_div"));
	showRepeatInput(false);
});

function placeCalendar() {

	var calendar = new JsDatePick({
			useMode:1,
			isStripped:true,
			target: "calendar_div",
			cellColorScheme:"beige"
		});
		
	calendar.setOnSelectedDelegate(function(){
			obj = calendar.getSelectedDay(); 
			currentDate(new Date(obj.year, obj.month - 1, obj.day)); 
			if ($("#filter_entries").get(0).checked) {
				showReservationsList(document.getElementById("reservations_list_div"), currentDate());
			}
		});
}

function checkName() {
	
	var inputField = document.getElementById("name_input");
	var hintField = document.getElementById("name_hint"); 
	var clientsList = clients().get();
	
	if (!validateName(inputField, hintField)) {
		return;
	}
	
	if (clientsList.indexOf(inputField.value) != -1) {
		hintField.innerHTML = "Такой пользователь уже есть в базе (нужен его пароль)";
	}
	else {
		hintField.innerHTML = "Такого пользователя нет в базе (будет добавлен)";
	}
}

function checkPassword() {

	validatePassword(document.getElementById("password_input"), document.getElementById("password_hint"));
}

function checkStartDateTime() {
	
	validateStartDateTime(document.getElementById("start_date_time_input"), document.getElementById("start_date_time_hint"));
	//checkReservationPossibility(getStartDateTimeFromInput(), getEndDateTimeFromInput());
}

function checkDuration() {

	validateDuration(document.getElementById("duration_input"), document.getElementById("duration_hint"));
	//checkReservationPossibility(getStartDateTimeFromInput(), getEndDateTimeFromInput());
}

function checkPeriod() {
	
	validatePeriod(document.getElementById("period_input"), document.getElementById("period_hint"));
}

function checkReservationsNumber() {
	
	validateReservationsNumber(document.getElementById("reservations_number_input"), document.getElementById("reservations_number_hint"));
}

function repeatCheckBoxOnClick() {
	
	showRepeatInput(document.getElementById("repeat_input").checked);
}

function filterEntriesBoxOnClick() {
	
	if ($("#filter_entries").get(0).checked) {
		showReservationsList(document.getElementById("reservations_list_div"), currentDate());
	}
	else {
		showReservationsList(document.getElementById("reservations_list_div"));
	}
}

function reserveButtonOnClick() {

	if (!validateName(document.getElementById("name_input"), document.getElementById("name_hint"))) {
		document.getElementById("name_input").focus();
		return;
	}
	if (!validatePassword(document.getElementById("password_input"), document.getElementById("password_hint"))) {
		document.getElementById("password_input").focus();
		return;
	}
	if (!validateStartDateTime(document.getElementById("start_date_time_input"), document.getElementById("start_date_time_hint"))) {
		document.getElementById("start_date_time_input").focus();
		return;
	}
	if (!validateDuration(document.getElementById("duration_input"), document.getElementById("duration_hint"))) {
		document.getElementById("duration_input").focus();
		return;
	}
	
	var period = 0;
	var reservationsNumber = 1;
	
	if (document.getElementById("repeat_input").checked) {
	
		if (!validatePeriod(document.getElementById("period_input"), document.getElementById("period_hint"))) {
			document.getElementById("period_input").focus();
			return;
		}
		
		if (!validateReservationsNumber(document.getElementById("reservations_number_input"), document.getElementById("reservations_number_hint"))) {
			document.getElementById("reservations_number_input").focus();
			return;
		}
		
		period = parseInt(document.getElementById("period_input").value);
		if (period < 1 || period > 14) {
			document.getElementById("period_hint").innerHTML = "Please enter a value between 1 and 14.";
			return;
		}
		
		reservationsNumber = parseInt(document.getElementById("reservations_number_input").value);
		if (reservationsNumber < 1 || reservationsNumber > 10) {
			document.getElementById("reservations_number__hint").innerHTML = "Please enter a value between 1 and 10.";
			return;
		}
	}
	
	var name = document.getElementById("name_input").value;
	var password = document.getElementById("password_input").value;
	var startDateTime = getStartDateTimeFromInput();
	var endDateTime = getEndDateTimeFromInput();
	
	var clientsList = clients().get();
	var newClient = null;
	var newReservations = new Array();
	
	if (startDateTime < new Date()) {
		document.getElementById("start_date_time_hint").innerHTML = "You can not reserve room behindhand!";
		document.getElementById("start_date_time_input").focus();
		return;
	}
	
	if (clientsList.indexOf(name) == -1) {
		newClient = name;
	}
	else {
		if (clients().checkPass(name, password) == false) {
			alert("Wrong password!");
			return;
		}
	}
	
	for (var i = 0; i < reservationsNumber; i++) {
	
		if (!checkReservationPossibility(startDateTime, endDateTime)) {
			document.getElementById("start_date_time_hint").innerHTML = "This reservation covers another one!";
			document.getElementById("start_date_time_input").focus();
			return;
		}	
		
		reservation = new Reservation(name, new Date(startDateTime), new Date(endDateTime), "0");
		newReservations.push(reservation);
		
		startDateTime.setDate(startDateTime.getDate() + period);
		endDateTime.setDate(endDateTime.getDate() + period);
	}
	
	startDateTime = getStartDateTimeFromInput();
	endDateTime = getEndDateTimeFromInput();
	
	clients().add(newClient);
	reservations().add(newReservations);
	
	filterEntriesBoxOnClick();
}

function resetButtonOnClick() {

	$(".input_elem").val("");
	$(".hint_elem").html("");
}
