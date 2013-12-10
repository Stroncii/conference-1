function Reservation(id, client, startDateTime, endDateTime, sequence) {
	
	this.id = id;
	this.client = client;
	this.startDateTime = startDateTime;
	this.endDateTime = endDateTime;
	this.sequence = sequence;
}

function reservations() {

	if (reservations.data == undefined) {
		reservations.data = [
			new Reservation(1, "Client_1", new Date(2013, 11, 10, 6, 0), new Date(2013, 11, 8, 9, 0), "0"),
			new Reservation(2, "Client_1", new Date(2013, 11, 11, 17, 50), new Date(2013, 11, 8, 19, 20), "0"),	
			new Reservation(3, "Client_2", new Date(2013, 11, 12, 16, 30), new Date(2013, 11, 8, 19, 00), "0"),
			new Reservation(4, "Client_1", new Date(2013, 11, 13, 13, 00), new Date(2013, 11, 8, 15, 00), "0")
		];
		reservations.nextId = 5;
	}
	
	return {
		get: function(id) { 
		
				if (id == undefined) {
					return reservations.data;
				}
				else {
					var result = null;
					for (var i = 0, j = reservations.data.length; i < j; i++)
						if (reservations.data[i].id == id) {
							result = reservations.data[i];
							break;
						}
					return result;
				}
			},
			
		add: function(newReservations) {
		
				for (var i = 0; i < newReservations.length; i++) {
					newReservations[i].id = reservations.nextId;
					reservations.data.push(newReservations[i]);
					reservations.nextId++;
				}
			},
			
		cancel: function(id) {
		
				for (var i = 0, j = reservations.data.length; i < j; i++) {
					if (reservations.data[i].id == id) {
							reservations.data.splice(i, 1);
							break;
					}//if
				}//for
			}//cancel function				
	}//returned object
}//reservation function


function showReservationsList(target, dateFilter) {
	
	var reservationsList = reservations().get();
	
	// First sort the reservationsList in chronological order
    reservationsList.sort(function(reservation1, reservation2) { 
    	return reservation1.startDateTime - reservation2.startDateTime; });
	
	var entriesText = "";
	var coloredBackground = true;
	var currentDate = new Date();
	
	for (var i = 0; i < reservationsList.length; i++) {
		
		if (dateFilter != undefined) {
			if (dateFilter.getDate() != reservationsList[i].startDateTime.getDate() ||
					dateFilter.getMonth() != reservationsList[i].startDateTime.getMonth() ||
					dateFilter.getFullYear() != reservationsList[i].startDateTime.getFullYear()) {
				continue;
			}
		}
		
		var buttonElementText = "";
		
		if (reservationsList[i].startDateTime > currentDate) {			
			buttonElementText = "<input type='button', class='cancel_button' data-id='" + 
				reservationsList[i].id + "' value='Cancel' />" + 
				"<span class='cancel_hint' data-id='" + 
				reservationsList[i].id + "'></span>";
		}
		
		if (coloredBackground) {
			entriesText += "<div class='whole_reservation_div' style='background-color: #DDDDDD'>";
		}
		else {
			entriesText += "<div class='whole_reservation_div'>";
		}
		coloredBackground = !coloredBackground;
		
		entriesText += "<span class='title_elem'>On</span><span class='text_elem'>" + 
			reservationsList[i].startDateTime.shortDateFormat() + "</span>" + 
			"<div class='separator'></div>" + 
			"<span class='title_elem'>Duration</span><span class='text_elem'>" + 
			reservationsList[i].startDateTime.shortTimeFormat() + "-" + 
			reservationsList[i].endDateTime.shortTimeFormat() + "</span>" + buttonElementText +
			"<div class='separator'></div>" + 
			"<span class='title_elem'>Reserved by</span><span class='text_elem'>" + 
			reservationsList[i].client + "</span>" + "</div>";
	}
	
	target.innerHTML = entriesText;
	$(".cancel_button").click(cancelButtonClick);
}

function checkReservationPossibility(startDateTime, endDateTime) {
	
	var reservationsList = reservations().get();
	
	if (startDateTime == undefined || endDateTime == undefined) {
		return false;
	}
	
	for (var i = 0, j = reservationsList.length; i < j; i++) {
		
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