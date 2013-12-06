//global variables to store data from server storage on client side

var reservationsList = new Array();

var clientsList = new Array();

var tempReservationsList = new Array();

var tempClientsList = new Array();

var ajaxReq = new AjaxRequest();

var selectedDate = new Date();

var filterByDate = false;

function showReservationsList(target, dateFilter) {
	
	// First sort the reservationsList in chronological order
    reservationsList.sort(function(reservation1, reservation2) { 
    	return reservation1.startDateTime - reservation2.startDateTime; });
	
	var entriesText = "";
	
	for (var i = 0; i < reservationsList.length; i++) {
		
		if (filterByDate && dateFilter != undefined) {
			if (dateFilter.getDate() != reservationsList[i].startDateTime.getDate() ||
					dateFilter.getMonth() != reservationsList[i].startDateTime.getMonth() ||
					dateFilter.getFullYear() != reservationsList[i].startDateTime.getFullYear()) {
				continue;
			}
		}
		
		if (i % 2 == 0) {
			entriesText += "<div class='whole_reservation_div' style='background-color: #DDDDDD'>";
		}
		else {
			entriesText += "<div class='whole_reservation_div'>";
		}
		
		entriesText += "<span class='title_elem'>On</span><span class='text_elem'>" + 
			reservationsList[i].startDateTime.shortDateFormat() + "</span>" + 
			"<div class='separator'></div>" + 
			"<span class='title_elem'>Duration</span><span class='text_elem'>" + 
			reservationsList[i].startDateTime.shortTimeFormat() + "-" + 
			reservationsList[i].endDateTime.shortTimeFormat() + "</span>" + 
			"<div class='separator'></div>" + 
			"<span class='title_elem'>Reserved by</span><span class='text_elem'>" + 
			reservationsList[i].client + "</span>" + "</div>";
		
		/*entriesText += "<table class='reservation_entry_table'>" + 
			"<tr><td class='title_column'>On</td><td class='text_column'>" + 
			reservationsList[i].startDateTime.shortDateFormat() + "</td><td class='button_column'></td></tr>" + 
			"<tr><td class='title_column'>Duration</td><td class='text_column'>" + 
			reservationsList[i].startDateTime.shortTimeFormat() + "-" + 
			reservationsList[i].endDateTime.shortTimeFormat() + "</td><td class='button_column'></td></tr>" + 
			"<tr><td class='title_column'>Reserved by</td><td class='text_column'>" + 
			reservationsList[i].client + "</td><td class='button_column'></td></tr>" + 
			"</table></div>";*/
	}
	
	target.innerHTML = entriesText;
}

function showRepeatInput(isVisible) {
		
	if(isVisible == undefined) {
		return;
	}
	
	var displayStyle = (isVisible == true) ? "table-row" : displayStyle = "none";	
	$("#repeat_input").parent().nextAll(".whole_input_div").css("display", displayStyle);
}

function checkReservationPossibility(startDateTime, endDateTime) {
	
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
	
	var startDateTime = new Date(selectedDate);
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

function init() {

	//Place calendar on html page
	g_globalObject = new JsDatePick({
			useMode:1,
			isStripped:true,
			target:"calendar_div",
			cellColorScheme:"beige"
		});
		
	g_globalObject.setOnSelectedDelegate(function(){
			obj = g_globalObject.getSelectedDay();
			selectedDate = new Date(obj.year, obj.month - 1, obj.day); 
			showReservationsList(document.getElementById("reservations_list_div"), selectedDate);
		});
	
	loadBase();
	showRepeatInput(false);
}

function checkName() {
	
	var inputField = document.getElementById("name_input");
	var hintField = document.getElementById("name_hint"); 
	
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
	
	filterByDate = document.getElementById("filter_entries").checked;
	showReservationsList(document.getElementById("reservations_list_div"), selectedDate);
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
	
	tempClientsList = new Array();
	tempReservationsList.length = new Array();
	
	if (startDateTime < new Date()) {
		document.getElementById("start_date_time_hint").innerHTML = "You can not reserve room behindhand!";
		document.getElementById("start_date_time_input").focus();
		return;
	}
	
	if (clientsList.indexOf(name) == -1) {
		tempClientsList.push(name);
	}
	
	for (var i = 0; i < reservationsNumber; i++) {
	
		if (!checkReservationPossibility(startDateTime, endDateTime)) {
			document.getElementById("start_date_time_hint").innerHTML = "This reservation covers another one!";
			document.getElementById("start_date_time_input").focus();
			return;
		}	
		
		reservation = new Reservation(name, new Date(startDateTime), new Date(endDateTime), "0");
		tempReservationsList.push(reservation);
		
		startDateTime.setDate(startDateTime.getDate() + period);
		endDateTime.setDate(endDateTime.getDate() + period);
	}
	
	startDateTime = getStartDateTimeFromInput();
	endDateTime = getEndDateTimeFromInput();
	addToBase(name, password, startDateTime, endDateTime, period, reservationsNumber);
}

function resetButtonOnClick() {

	document.getElementById("name_input").value="";
	document.getElementById("name_hint").innerHTML="";
	document.getElementById("password_input").value="";
	document.getElementById("password_hint").innerHTML="";
	document.getElementById("start_date_time_input").value="";
	document.getElementById("start_date_time_hint").innerHTML="";
	document.getElementById("duration_input").value="";
	document.getElementById("duration_hint").innerHTML="";
	document.getElementById("period_input").value="";
	document.getElementById("period_hint").innerHTML="";
	document.getElementById("reservations_number_input").value="";
	document.getElementById("reservations_number_hint").innerHTML="";
}
