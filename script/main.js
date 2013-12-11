//stores current date (can not take it direct from calendar widget)
function currentDate(dateParam) {
	
	if (dateParam != undefined) {
		currentDate.date = dateParam;
	}	
	return currentDate.date;
}

//add widgets on html page

function placeCalendar() {

	var calendar = new JsDatePick({
			useMode:1,
			isStripped:true,
			target: "calendar_div",
			cellColorScheme:"beige"
		});
		
	calendar.setOnSelectedDelegate(function(){
			var obj = calendar.getSelectedDay(); 
			currentDate(new Date(obj.year, obj.month - 1, obj.day)); 
			if ($("#filter_entries").get(0).checked) {
				showReservationsList(document.getElementById("reservations_list_div"), currentDate());
			}
		});
}

function placeStartDateTimePicker() {

	$("#start_date_time_input").datetimepicker({
		datepicker: false,
		format:"H:i"
	});
}

function placeDurationDateTimePicker() {

	$("#duration_input").datetimepicker({
		datepicker: false,
		format:"H:i",
		allowTimes:[
			'00:00', '02:00', '03:00', '04:00', '05:00',
			'06:00', '07:00', '08:00', '09:00', '10:00'
		]
	});
}

//read values from input elements

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
	
	currentDate(new Date());		//init current date
	clients();						//init local list of clients
	reservations();					//init local list of reervations
	
	placeCalendar();
	placeStartDateTimePicker();
	placeDurationDateTimePicker();
	
	$("#filter_entries").on("click", filterEntriesBoxOnClick);
	$("#name_input").on("blur", checkName);
	$("#password_input").on("blur", checkPassword);
	$("#start_date_time_input").on("blur", checkStartDateTime);
	$("#duration_input").on("blur", checkDuration);
	$("#repeat_check_box").on("click", repeatCheckBoxOnClick);
	$("#period_input").on("blur", checkPeriod);
	$("#reservations_number_input").on("blur", checkReservationsNumber);
	$("#reserve_button").on("click", reserveButtonOnClick);
	$("#reset_button").on("click", resetButtonOnClick);
	
	repeatCheckBoxOnClick();
	showReservationsList(document.getElementById("reservations_list_div"));
});

function checkName() {
	
	var inputField = document.getElementById("name_input");
	var hintField = document.getElementById("name_hint"); 
	
	if (!validateName(inputField, hintField)) {
		return;
	}	
	hintField.innerHTML = (clients().has(inputField.value)) ? 
		"Такой пользователь уже есть в базе (нужен его пароль)" : "Такого пользователя нет в базе (будет добавлен)";
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
	
	var displayStyle = (document.getElementById("repeat_check_box").checked) ? "table-row" : displayStyle = "none";	
	$("#repeat_check_box").parent().nextAll(".whole_input_div").css("display", displayStyle);
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
	
	if (document.getElementById("repeat_check_box").checked) {
	
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
			document.getElementById("reservations_number_hint").innerHTML = "Please enter a value between 1 and 10.";
			return;
		}
	}
	
	var name = document.getElementById("name_input").value;
	var password = document.getElementById("password_input").value;
	var startDateTime = getStartDateTimeFromInput();
	var endDateTime = getEndDateTimeFromInput();
	
	var newClient = null;
	var newReservations = new Array();
	
	if (startDateTime < new Date()) {
		document.getElementById("start_date_time_hint").innerHTML = "You can not reserve room behindhand!";
		document.getElementById("start_date_time_input").focus();
		return;
	}
	
	if (!clients().has(name)) {
		newClient = new Client(name, password);
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
		
		reservation = new Reservation(null, name, new Date(startDateTime), new Date(endDateTime), 0);
		newReservations.push(reservation);
		
		startDateTime.setDate(startDateTime.getDate() + period);
		endDateTime.setDate(endDateTime.getDate() + period);
	}
	
	startDateTime = getStartDateTimeFromInput();
	endDateTime = getEndDateTimeFromInput();
	
	clients().add(newClient);
	reservations().add(newReservations);
	
	filterEntriesBoxOnClick();
	alert("New reservation was successfully added");
}

function resetButtonOnClick() {

	$(".input_elem").val("");
	$(".hint_elem").html("");
}

function cancelButtonClick() {
	
	var id = parseInt($(this).data("id"));
	var reservationToCancel = reservations().get(id);
	
	if (reservationToCancel == null) {
		$(".cancel_hint[data-id='" + id + "']").text("Strangely, but it seems this reservation was already cancelled");
		return;
	}
	
	var name = document.getElementById("name_input").value;
	var password = document.getElementById("password_input").value;
	
	if (reservationToCancel.client != name) {
		$(".cancel_hint[data-id='" + id + "']").text("This reservation was made by another user! You can not cancel it.");
		return;
	}
	if (clients().checkPass(name, password) == false) {
		$(".cancel_hint[data-id='" + id + "']").text("Wrong password!");
		return;
	}
	$(".cancel_hint[data-id='" + id + "']").text("");
	
	if (reservationToCancel.sequence != "0") {
		
		$(function() {
			$( "#dialog-confirm" ).dialog({
				resizable: false,
				height:140,
				width: 700, 
				modal: true,
				title: "This reservation belongs to sequence. Cancel only this reservation or all of them?",
			  
				buttons: {
					"Cancel only this reservation": function() {
							reservations().cancel(id);
							showReservationsList(document.getElementById("reservations_list_div"));
							$( this ).dialog( "close" );
						},
						
					"Cancel all sequence": function() {
							reservations().cancelSequence(reservationToCancel.sequence);
							showReservationsList(document.getElementById("reservations_list_div"));
							$( this ).dialog( "close" );
						},
						
					"Do not cancel anything": function() {
							$( this ).dialog( "close" );
						}
				}
			});
		});
	}
	else {
		
		$(function() {
			$( "#dialog-confirm" ).dialog({
				resizable: false,
				height:140,
				width: 700, 
				modal: true,
				title: "Are you really want cancel this reservation?",
			  
				buttons: {
					"Yes": function() {
							reservations().cancel(id);
							showReservationsList(document.getElementById("reservations_list_div"));
							$( this ).dialog( "close" );
						},
						
					"No": function() {
							$( this ).dialog( "close" );
						},
				}
			});
		});
	}
	
}
