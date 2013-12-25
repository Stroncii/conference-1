(function(namespace) {

	function Reservation(id, clientId, startDateTime, endDateTime, sequence) {
		
		this.id = id;
		this.clientId = clientId;
		this.startDateTime = startDateTime;
		this.endDateTime = endDateTime;
		this.sequence = sequence;
	}

	var reservationsArray = new Array();
	
	namespace.reservations = { 
	
		create:				createFunction,
		get: 				getFunction,			
		add: 				addFunction,	
		cancel: 			cancelFunction,			
		cancelSequence: 	cancelSequenceFunction,			
	
		showList:			showReservationsListFunction,
		checkPossibility:	checkReservationPossibilityFunction
	}			
	
	function createFunction(id, clientId, startDateTime, endDateTime, sequence) {
		return new Reservation(id, clientId, startDateTime, endDateTime, sequence);
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
		reservationsArray = reservationsArray.concat(newReservations);
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
	
	function showReservationsListFunction(target, cancelAction, needFiltration, dateFilter) {
		
		var reservationsList = reservationsArray;
		
		// First sort the reservationsList in chronological order
		reservationsList.sort(function(reservation1, reservation2) { 
			return reservation1.startDateTime - reservation2.startDateTime; });
		
		var entriesText = "";
		var coloredBackground = true;
		var currentDate = new Date();
		
		for (var i = 0; i < reservationsList.length; i++) {
			
			if (needFiltration != undefined && needFiltration != false && dateFilter != undefined) {
				if (dateFilter.getDate() != reservationsList[i].startDateTime.getDate() ||
						dateFilter.getMonth() != reservationsList[i].startDateTime.getMonth() ||
						dateFilter.getFullYear() != reservationsList[i].startDateTime.getFullYear()) {
					continue;
				}
			}
			
			var buttonElementText = "";
			
			var client = namespace.clients.getById(reservationsList[i].clientId);
			var clientName = (client == null) ? "Unknown (data structure error)" : client.name;
			
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
				clientName + "</span>" + "</div>";
		}	
		
		target.innerHTML = entriesText;
		$(".cancel_button").click(cancelAction);
	}

	function checkReservationPossibilityFunction(startDateTime, endDateTime) {
		
		for (var i = 0, j = reservationsArray.length; i < j; i++) {
			
			if ((reservationsArray[i].startDateTime <= startDateTime && startDateTime <= reservationsArray[i].endDateTime) ||
				(reservationsArray[i].startDateTime <= endDateTime   && endDateTime   <= reservationsArray[i].endDateTime) ||
				(startDateTime <= reservationsArray[i].startDateTime && reservationsArray[i].startDateTime <= endDateTime) ||
				(startDateTime <= reservationsArray[i].endDateTime   && reservationsArray[i].endDateTime   <= endDateTime)) {
			//	alert(reservationsList[i].startDateTime + "\n" + reservationsList[i].endDateTime + "\n" + 
			//			startDateTime + "\n" + endDateTime);
				return false;
			}
		}
		return true;
	}
	
})(myNamespace);//anonymous function