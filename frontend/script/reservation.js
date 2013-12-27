(function(namespace) {

	function Reservation(id, clientId, startDateTime, endDateTime, sequence) {
		
		this.id = id;
		this.clientId = clientId;
		this.startDateTime = startDateTime;
		this.endDateTime = endDateTime;
		this.sequence = sequence;
	}

	var reservationsArray = new Array(); //stores all Reservations objects
	
	namespace.reservations = { 
	
		create:				createFunction,
		get: 				getFunction,			
		add: 				addFunction,	
		cancel: 			cancelFunction,			
		cancelSequence: 	cancelSequenceFunction,			
	
		showList:			showReservationsListFunction,
		checkPossibility:	checkReservationPossibilityFunction
	}			
	
	//return new Reservation object
	function createFunction(id, clientId, startDateTime, endDateTime, sequence) {
	
		return new Reservation(id, clientId, startDateTime, endDateTime, sequence);
	}
	
	//get Reservation object from reservationsArray by id
	//function returns null if there is no such object
	function getFunction(id) { 
			
		for (var i = 0, j = reservationsArray.length; i < j; i++) {
			if (reservationsArray[i].id == id) {
				return reservationsArray[i];
			}
		}
		return null;
	}
	
	//add array of Reservation objects to clientsArray
	function addFunction(newReservations) {
	
		reservationsArray = reservationsArray.concat(newReservations);
	}
	
	//delete one Reservation object from reservationsArray by id
	function cancelFunction(id) {
			
		for (var i = 0, j = reservationsArray.length; i < j; i++) {
			if (reservationsArray[i].id == id) {
				reservationsArray.splice(i, 1);
				break;
			}
		}
	}
	
	//delete some Reservation objects from reservationsArray by sequence (only unfinished)
	function cancelSequenceFunction(sequence) {
				
		var currentDate = new Date();
	
		for (var i = 0; i < reservationsArray.length; i++) {
			if (reservationsArray[i].sequence == sequence && reservationsArray[i].startDateTime > currentDate) {
				reservationsArray.splice(i, 1);
				i--;
			}
		}
	}				
	
	//generate list of reservations using jquery tmpl
	function showReservationsListFunction() {
		
		reservationsArray.sort(function(reservation1, reservation2) { 
			return reservation1.startDateTime - reservation2.startDateTime; });
		
		$("#reservations_list_div").empty();
		$("#reservationsTmpl").tmpl(reservationsArray).appendTo("#reservations_list_div");
		$(".cancel_button").click(namespace.main.cancelButtonClick);
		
		for (var i = 0, reservationEntries = $(".whole_reservation_div"), j = reservationEntries.length; i < j; i++) {
			reservationEntries[i].style.backgroundColor = (i % 2) ? "#DDDDDD" : "#FFFFFF";
		}
	}

	//see if reservation covers another one
	function checkReservationPossibilityFunction(startDateTime, endDateTime) {
		
		for (var i = 0, j = reservationsArray.length; i < j; i++) {
			
			if ((reservationsArray[i].startDateTime < startDateTime && startDateTime < reservationsArray[i].endDateTime) ||
				(reservationsArray[i].startDateTime < endDateTime   && endDateTime   < reservationsArray[i].endDateTime) ||
				(startDateTime < reservationsArray[i].startDateTime && reservationsArray[i].startDateTime < endDateTime) ||
				(startDateTime < reservationsArray[i].endDateTime   && reservationsArray[i].endDateTime   < endDateTime)) {
				return false;
			}
		}
		return true;
	}
	
})(myNamespace);