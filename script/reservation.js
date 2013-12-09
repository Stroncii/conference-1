function Reservation(client, startDateTime, endDateTime, sequence) {
	
	this.client = client;
	this.startDateTime = startDateTime;
	this.endDateTime = endDateTime;
	this.sequence = sequence;
}

function reservations() {

	if (reservations.data == undefined) {
		reservations.data = [
			new Reservation("Client_1", new Date(2013, 11, 8, 6, 0), new Date(2013, 11, 8, 9, 0), "0"),
			new Reservation("Client_1", new Date(2013, 11, 8, 17, 50), new Date(2013, 11, 8, 19, 20), "0"),	
			new Reservation("Client_1", new Date(2013, 11, 9, 16, 30), new Date(2013, 11, 8, 19, 00), "0"),
			new Reservation("Client_1", new Date(2013, 11, 10, 13, 00), new Date(2013, 11, 8, 15, 00), "0")
		];
	}
	
	return {
		get: function() { return reservations.data; },
		add: function(newReservations) {
			for (var i = 0; i < newReservations.length; i++) {
				reservations.data.push(newReservations[i]);
			}
		}
	}
}

function showReservationsList(target, dateFilter) {
	
	var reservationsList = reservations().get();
	
	// First sort the reservationsList in chronological order
    reservationsList.sort(function(reservation1, reservation2) { 
    	return reservation1.startDateTime - reservation2.startDateTime; });
	
	var entriesText = "";
	var coloredBackground = true;
	
	for (var i = 0; i < reservationsList.length; i++) {
		
		if (dateFilter != undefined) {
			if (dateFilter.getDate() != reservationsList[i].startDateTime.getDate() ||
					dateFilter.getMonth() != reservationsList[i].startDateTime.getMonth() ||
					dateFilter.getFullYear() != reservationsList[i].startDateTime.getFullYear()) {
				continue;
			}
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
			reservationsList[i].endDateTime.shortTimeFormat() + "</span>" + 
			"<div class='separator'></div>" + 
			"<span class='title_elem'>Reserved by</span><span class='text_elem'>" + 
			reservationsList[i].client + "</span>" + "</div>";
	}
	
	target.innerHTML = entriesText;
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