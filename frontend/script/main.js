var myNamespace = myNamespace || {};

(function(namespace) {
	
	namespace.main = {
	
		placeCalendar: placeCalendar,
		placeStartDateTimePicker: placeStartDateTimePicker,
		placeDurationDateTimePicker: placeDurationDateTimePicker,
		
		checkName: checkName,
		checkPassword: checkPassword,
		checkStartDateTime: checkStartDateTime,
		checkDuration: checkDuration,
		checkPeriod: checkPeriod,
		checkReservationsNumber: checkReservationsNumber,
		
		repeatCheckBoxOnClick: repeatCheckBoxOnClick,
		filterEntriesBoxOnClick: filterEntriesBoxOnClick,
		reserveButtonOnClick: reserveButtonOnClick,
		resetButtonOnClick: resetButtonOnClick,
		cancelButtonClick: cancelButtonClick
	};
	
	//add widgets on html page
	//(calendar, startDateTimePicker, endDateTimePicker)
	function placeCalendar() {

		$("<div id='calendar_div'></div>").prependTo("#date_div");
		
		$("#calendar_div").datepicker({
			onSelect: function(dateText, inst) {
				if ($("#filter_entries").is(":checked")) {
					namespace.reservations.showList();
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

	//read startDateTime and endDateTime values from input elements
	//return Data objects

	function getStartDateTimeFromInput() {
		
		var startDateTimeArray = $("#start_date_time_input").val().split(":");
		
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
		var durationArray = $("#duration_input").val().split(":");
			
		if (startDateTime == undefined || durationArray.length != 2) {
			return;
		}
		
		var endDateTime = new Date(startDateTime);
		endDateTime.setHours(endDateTime.getHours() + parseInt(durationArray[0]));
		endDateTime.setMinutes(endDateTime.getMinutes() + parseInt(durationArray[1]));

		return endDateTime;
	}

	//Event listeners

	//validate format of entered values
	function checkName() {
		
		var hintField = $(this).siblings(".hint_elem")[0];
		if (!namespace.validators.validateName(this, hintField)) {
			return;
		}	
		hintField.innerHTML = (namespace.clients.has(this.value)) ? 
			"This user is present in the database" : "This user is not present in the database (will be added)";
	}

	function checkPassword() {
		namespace.validators.validatePassword(this, $(this).siblings(".hint_elem")[0]);
	}

	function checkStartDateTime() {	
		namespace.validators.validateStartDateTime(this, $(this).siblings(".hint_elem")[0]);
		//checkReservationPossibility(getStartDateTimeFromInput(), getEndDateTimeFromInput());
	}

	function checkDuration() {
		namespace.validators.validateDuration(this, $(this).siblings(".hint_elem")[0]);
		//checkReservationPossibility(getStartDateTimeFromInput(), getEndDateTimeFromInput());
	}

	function checkPeriod() {
		namespace.validators.validatePeriod(this, $(this).siblings(".hint_elem")[0]);
	}

	function checkReservationsNumber() {
		namespace.validators.validateReservationsNumber(this, $(this).siblings(".hint_elem")[0]);
	}
	
	//show/hide "period" and "reservations number" input fields
	function repeatCheckBoxOnClick() {
		
		var displayStyle = (this.checked) ? "table-row" : displayStyle = "none";	
		$(this).parent().nextAll(".whole_input_div").css("display", displayStyle);
	}

	//filter reservations by date or not
	function filterEntriesBoxOnClick() {
		namespace.reservations.showList();
	}

	//on reserveButton click
	function reserveButtonOnClick() {

		//validate all entered values again
		//(name, password, startDateTime, duration)
		if (!namespace.validators.validateName($("#name_input")[0], $("#name_hint")[0])) {
			$("#name_input")[0].focus();
			return;
		}
		if (!namespace.validators.validatePassword($("#password_input")[0], $("#password_hint")[0])) {
			$("#password_input")[0].focus();
			return;
		}
		if (!namespace.validators.validateStartDateTime($("#start_date_time_input")[0], $("#start_date_time_hint")[0])) {
			$("#start_date_time_input")[0].focus();
			return;
		}
		if (!namespace.validators.validateDuration($("#duration_input")[0], $("#duration_hint")[0])) {
			$("#duration_input")[0].focus();
			return;
		}
		
		var period = 0;
		var reservationsNumber = 1;
		
		//if repeatCheckBox checked
		//validate also period and reservations number
		if ($("#repeat_check_box")[0].checked) {
		
			if (!namespace.validators.validatePeriod($("#period_input")[0], $("#period_hint")[0])) {
				$("#period_input")[0].focus();
				return;
			}
			
			if (!namespace.validators.validateReservationsNumber($("#reservations_number_input")[0], $("#reservations_number_hint")[0])) {
				$("#reservations_number_input")[0].focus();
				return;
			}
			
			period = parseInt($("#period_input").val());	
			reservationsNumber = parseInt($("#reservations_number_input").val());
		}
		
		var name = $("#name_input").val();
		var password = $("#password_input").val();
		var startDateTime = getStartDateTimeFromInput();
		var endDateTime = getEndDateTimeFromInput();
		
		//see if client tries to reserve room behindhand
		if (startDateTime < new Date()) {
			$("#start_date_time_hint")[0].innerHTML = "You can not reserve room behindhand!";
			$("#start_date_time_input")[0].focus();
			return;
		}
		
		//see if one of new reservations covers another one
		for (var i = 0; i < reservationsNumber; i++) {
		
			if (!namespace.reservations.checkPossibility(startDateTime, endDateTime)) {
				$("#start_date_time_hint")[0].innerHTML = "This reservation covers another one!";
				$("#start_date_time_input")[0].focus();
				return;
			}	
			
			startDateTime.setDate(startDateTime.getDate() + period);
			endDateTime.setDate(endDateTime.getDate() + period);
		}
		
		startDateTime = getStartDateTimeFromInput();
		endDateTime = getEndDateTimeFromInput();
		
		//send new reservation's parameters to server
		//show server message
		namespace.ajaxRequests.addData(name, password, startDateTime, endDateTime, period, reservationsNumber, function(message) {
			noty({
				layout: 'topRight',
				type: 'information',
				text: message, 
				timeout: 3000
			});
			namespace.reservations.showList();
		});
	}

	//on resetButton click
	//clear all input fields
	function resetButtonOnClick() {

		$(".input_elem").val("");
		$(".hint_elem").html("");
	}

	//on cancelButton click
	function cancelButtonClick() {
		
		//get corresponding Reservation object and its id
		var id = parseInt($(this).data("id"));
		var reservationToCancel = namespace.reservations.get(id);
		
		if (reservationToCancel == null) {
			$(".cancel_hint[data-id='" + id + "']").text("Strangely, but it seems this reservation was already cancelled");
			return;
		}
		
		//get name and password of client from input fields
		var name = $("#name_input").val();
		var password = $("#password_input").val();
		
		//get owner of reservation
		var client = namespace.clients.getById(reservationToCancel.clientId);
			
		if (client == null) {
			$(".cancel_hint[data-id='" + id + "']").text("This reservation was made by unknown user (data structure error).");
			return;
		}
		if ( client.name != name) {
			$(".cancel_hint[data-id='" + id + "']").text("This reservation was made by another user! You can not cancel it.");
			return;
		}
		//clear cancel hint
		$(".cancel_hint[data-id='" + id + "']").empty();
		
		//if cancelled reservation belongs to some sequence
		if (reservationToCancel.sequence != "0") {
			//show dialog window with three buttons
			$(function() {
				$( "#dialog-confirm" ).dialog({
					resizable: false,
					height:140,
					width: 700, 
					modal: true,
					title: "This reservation belongs to sequence. Cancel only this reservation or all of them?",
				  
					buttons: {
						//send cancelled reservation's id and password of its owner to server
						"Cancel only this reservation": function() {
								namespace.ajaxRequests.cancelReservation(id, name, password, function(message) {
									noty({
										layout: 'topRight',
										type: 'information',
										text: message, 
										timeout: 3000
									});
									namespace.reservations.showList();
								});
								$( this ).dialog( "close" );
							},
						//send cancelled reservation's sequence and password of their owner to server	
						"Cancel all sequence": function() {
								namespace.ajaxRequests.cancelSequence(reservationToCancel.sequence, name, password, function(message) {
									noty({
										layout: 'topRight',
										type: 'information',
										text: message, 
										timeout: 3000
									});
									namespace.reservations.showList();
								});
								$( this ).dialog( "close" );
							},
						//do nothing	
						"Do not cancel anything": function() {
								$( this ).dialog( "close" );
							}
					}
				});
			});
		}
		//if cancelled reservation is single
		else {
			//show dialog window with two buttons
			$(function() {
				$( "#dialog-confirm" ).dialog({
					resizable: false,
					height:140,
					width: 700, 
					modal: true,
					title: "Are you really want cancel this reservation?",
				  
					buttons: {
						//send cancelled reservation's id and password of its owner to server
						"Yes": function() {
								namespace.ajaxRequests.cancelReservation(id, name, password, function(message) {
									noty({
										layout: 'topRight',
										type: 'information',
										text: message, 
										timeout: 3000
									});
									namespace.reservations.showList();
								});
								$( this ).dialog( "close" );
							},
						//do nothing		
						"No": function() {
								$( this ).dialog( "close" );
							},
					}
				});
			});
		}
		
	}//cancel button click
	
})(myNamespace);
