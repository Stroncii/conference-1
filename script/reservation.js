(function() {

	function Reservation(id, client, startDateTime, endDateTime, sequence) {
		
		this.id = id;
		this.client = client;
		this.startDateTime = startDateTime;
		this.endDateTime = endDateTime;
		this.sequence = sequence;
	}

	var reservationsArray = [
		new Reservation(1, "Client_1", new Date(2013, 11, 10, 06, 00), new Date(2013, 11, 10, 09, 00), 0),
		new Reservation(2, "Client_1", new Date(2013, 11, 11, 17, 50), new Date(2013, 11, 11, 19, 20), 0),	
		new Reservation(3, "Client_2", new Date(2013, 11, 12, 16, 30), new Date(2013, 11, 12, 19, 00), 1),
		new Reservation(4, "Client_1", new Date(2013, 11, 13, 13, 00), new Date(2013, 11, 13, 15, 00), 0),
		new Reservation(5, "Client_2", new Date(2013, 11, 14, 16, 30), new Date(2013, 11, 14, 19, 00), 1),
		new Reservation(6, "Client_2", new Date(2013, 11, 09, 16, 30), new Date(2013, 11, 09, 19, 00), 1)
	];
	
	var nextId = 7;
	var nextSequence = 2;
	
	window.initVariables().initReservations( {
		
			create:				createFunction,
			get: 				getFunction,			
			add: 				addFunction,	
			cancel: 			cancelFunction,			
			cancelSequence: 	cancelSequenceFunction,			
	
			showList:			showReservationsListFunction,
			checkPossibility:	checkReservationPossibilityFunction		
	});
	
	function createFunction(id, client, startDateTime, endDateTime, sequence) {
		return new Reservation(id, client, startDateTime, endDateTime, sequence);
	}
	
	function getFunction(id) { 
			
		if (id == undefined) {
			return reservationsArray;
		}
		else {
			var result = null;
			for (var i = 0, j = reservationsArray.length; i < j; i++)
				if (reservationsArray[i].id == id) {
					result = reservationsArray[i];
					break;
				}
			return result;
		}
	}
	
	function addFunction(newReservations) {
			
		for (var i = 0, j = newReservations.length; i < j; i++) {
			if (j > 1) {
				newReservations[i].sequence = nextSequence;
			}
			newReservations[i].id = nextId;
			reservationsArray.push(newReservations[i]);
			nextId++;
		}
		if (j > 1) {
			nextSequence++;
		}
	}
	
	function cancelFunction(id) {
			
		for (var i = 0, j = reservationsArray.length; i < j; i++) {
			if (reservationsArray[i].id == id) {
					reservationsArray.splice(i, 1);
					break;
			}
		}
	}
	
	function cancelSequenceFunction(sequence) {
				
		var currentDate = new Date();
	
		for (var i = 0; i < reservationsArray.length; i++) {
			if (reservationsArray[i].sequence == sequence && reservationsArray[i].startDateTime > currentDate) {
					reservationsArray.splice(i, 1);
					i--;
			}
		}
	}				
	
	function showReservationsListFunction(target, cancelAction, dateFilter) {
		
		var reservationsList = reservationsArray;
		
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
		$(".cancel_button").click(cancelAction);
	}

	function checkReservationPossibilityFunction(startDateTime, endDateTime) {
		
		var reservationsList = reservationsArray;
		
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
	
})();//anonymous function