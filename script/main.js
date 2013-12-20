var myNamespace = myNamespace || {};

(function(namespace) {
	
	var validators;
	var clients;
	var reservations;
	var ajaxRequests;
	
	//add widgets on html page

	function placeCalendar() {

		$("#calendar_div").datepicker({
			onSelect: function(dateText, inst) {
				if ($("#filter_entries").get(0).checked) {
					reservations.showList($("#reservations_list_div")[0], cancelButtonClick, true, $(this).datepicker("getDate"));
				}
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
				'01:00', '02:00', '03:00', '04:00', '05:00',
				'06:00', '07:00', '08:00', '09:00', '10:00'
			]
		});
	}

	//read values from input elements

	function getStartDateTimeFromInput() {
		
		var startDateTimeArray = $("#start_date_time_input").get(0).value.split(":");
		
		if (startDateTimeArray.length != 2) {
			return;
		}

		var startDateTime = new Date($("#calendar_div").datepicker("getDate"));
		startDateTime.setHours(parseInt(startDateTimeArray[0]));
		startDateTime.setMinutes(parseInt(startDateTimeArray[1]));
		
		return startDateTime;
	}

	function getEndDateTimeFromInput() {

		var startDateTime = getStartDateTimeFromInput();
		var durationArray = $("#duration_input").get(0).value.split(":");
			
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
		
		//currentDate = new Date();		//init current date
		
		validators = namespace.validators;
		clients = namespace.clients;
		reservations = namespace.reservations;
		ajaxRequests = namespace.ajaxRequests;
		
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
		
		$("#repeat_check_box").parent().nextAll(".whole_input_div").css("display", "none");

		$("#reservations_list_div").prepend("<img src='img/wait.gif' />");
		ajaxRequests.loadData(function(){	
			$("#reservations_list_div").empty();
			reservations.showList($("#reservations_list_div").get(0), cancelButtonClick, 
				$("#filter_entries").get(0).checked, $("#calendar_div").datepicker("getDate"));
		});
	});

	function checkName() {
		
		var hintField = $(this).siblings(".hint_elem").get(0);
		if (!validators.validateName(this, hintField)) {
			return;
		}	
		hintField.innerHTML = (clients.has(this.value)) ? 
			"This user is present in the database" : "This user is not present in the database (will be added)";
	}

	function checkPassword() {
		validators.validatePassword(this, $(this).siblings(".hint_elem").get(0));
	}

	function checkStartDateTime() {	
		validators.validateStartDateTime(this, $(this).siblings(".hint_elem").get(0));
		//checkReservationPossibility(getStartDateTimeFromInput(), getEndDateTimeFromInput());
	}

	function checkDuration() {
		validators.validateDuration(this, $(this).siblings(".hint_elem").get(0));
		//checkReservationPossibility(getStartDateTimeFromInput(), getEndDateTimeFromInput());
	}

	function checkPeriod() {
		validators.validatePeriod(this, $(this).siblings(".hint_elem").get(0));
	}

	function checkReservationsNumber() {
		validators.validateReservationsNumber(this, $(this).siblings(".hint_elem").get(0));
	}

	function repeatCheckBoxOnClick() {
		
		var displayStyle = (this.checked) ? "table-row" : displayStyle = "none";	
		$(this).parent().nextAll(".whole_input_div").css("display", displayStyle);
	}

	function filterEntriesBoxOnClick() {
		reservations.showList($("#reservations_list_div").get(0), cancelButtonClick, this.checked, $("#calendar_div").datepicker("getDate"));
	}

	function reserveButtonOnClick() {

		if (!validators.validateName($("#name_input").get(0), $("#name_hint").get(0))) {
			$("#name_input").get(0).focus();
			return;
		}
		if (!validators.validatePassword($("#password_input").get(0), $("#password_hint").get(0))) {
			$("#password_input").get(0).focus();
			return;
		}
		if (!validators.validateStartDateTime($("#start_date_time_input").get(0), $("#start_date_time_hint").get(0))) {
			$("#start_date_time_input").get(0).focus();
			return;
		}
		if (!validators.validateDuration($("#duration_input").get(0), $("#duration_hint").get(0))) {
			$("#duration_input").get(0).focus();
			return;
		}
		
		var period = 0;
		var reservationsNumber = 1;
		
		if ($("#repeat_check_box").get(0).checked) {
		
			if (!validators.validatePeriod($("#period_input").get(0), $("#period_hint").get(0))) {
				$("#period_input").get(0).focus();
				return;
			}
			
			if (!validators.validateReservationsNumber($("#reservations_number_input").get(0), $("#reservations_number_hint").get(0))) {
				$("#reservations_number_input").get(0).focus();
				return;
			}
			
			period = parseInt($("#period_input").get(0).value);
			if (period < 1 || period > 14) {
				$("#period_hint").get(0).innerHTML = "Please enter a value between 1 and 14.";
				return;
			}
			
			reservationsNumber = parseInt($("#reservations_number_input").get(0).value);
			if (reservationsNumber < 1 || reservationsNumber > 10) {
				$("#reservations_number_input").get(0).innerHTML = "Please enter a value between 1 and 10.";
				return;
			}
		}
		
		var name = $("#name_input").get(0).value;
		var password = $("#password_input").get(0).value;
		var startDateTime = getStartDateTimeFromInput();
		var endDateTime = getEndDateTimeFromInput();
		
		if (startDateTime < new Date()) {
			$("#start_date_time_hint").get(0).innerHTML = "You can not reserve room behindhand!";
			$("#start_date_time_input").get(0).focus();
			return;
		}
		
		for (var i = 0; i < reservationsNumber; i++) {
		
			if (!reservations.checkPossibility(startDateTime, endDateTime)) {
				$("#start_date_time_hint").get(0).innerHTML = "This reservation covers another one!";
				$("#start_date_time_input").get(0).focus();
				return;
			}	
			
			startDateTime.setDate(startDateTime.getDate() + period);
			endDateTime.setDate(endDateTime.getDate() + period);
		}
		
		startDateTime = getStartDateTimeFromInput();
		endDateTime = getEndDateTimeFromInput();
		
		ajaxRequests.addData(name, password, startDateTime, endDateTime, period, reservationsNumber, function(message) {
			noty({
				layout: 'topRight',
				type: 'information',
				text: message, 
				timeout: 3000
			});
			reservations.showList($("#reservations_list_div").get(0), cancelButtonClick, $("#filter_entries").get(0).checked, currentDate);
		});
	}

	function resetButtonOnClick() {

		$(".input_elem").val("");
		$(".hint_elem").html("");
	}

	function cancelButtonClick() {
		
		var id = parseInt($(this).data("id"));
		var reservationToCancel = reservations.get(id);
		
		if (reservationToCancel == null) {
			$(".cancel_hint[data-id='" + id + "']").text("Strangely, but it seems this reservation was already cancelled");
			return;
		}
		
		var name = $("#name_input").get(0).value;
		var password = $("#password_input").get(0).value;
		
		var client = clients.getById(reservationToCancel.clientId);
		
		if (client == null) {
			$(".cancel_hint[data-id='" + id + "']").text("This reservation was made by unknown user (data structure error).");
			return;
		}
		if ( client.name != name) {
			$(".cancel_hint[data-id='" + id + "']").text("This reservation was made by another user! You can not cancel it.");
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
								ajaxRequests.cancelReservation(id, password, function(message) {
									noty({
										layout: 'topRight',
										type: 'information',
										text: message, 
										timeout: 3000
									});
									reservations.showList($("#reservations_list_div").get(0), cancelButtonClick, 
										$("#filter_entries").get(0).checked, $("#calendar_div").datepicker("getDate"));
								});
								$( this ).dialog( "close" );
							},
							
						"Cancel all sequence": function() {
								ajaxRequests.cancelSequence(reservationToCancel.sequence, password, function(message) {
									noty({
										layout: 'topRight',
										type: 'information',
										text: message, 
										timeout: 3000
									});
									reservations.showList($("#reservations_list_div").get(0), cancelButtonClick, 
										$("#filter_entries").get(0).checked, $("#calendar_div").datepicker("getDate"));
								});
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
								ajaxRequests.cancelReservation(id, password, function(message) {
									noty({
										layout: 'topRight',
										type: 'information',
										text: message, 
										timeout: 3000
									});
									reservations.showList($("#reservations_list_div").get(0), cancelButtonClick, 
										$("#filter_entries").get(0).checked, $("#calendar_div").datepicker("getDate"));
								});
								$( this ).dialog( "close" );
							},
							
						"No": function() {
								$( this ).dialog( "close" );
							},
					}
				});
			});
		}
		
	}//cancel button click
	
})(myNamespace);
