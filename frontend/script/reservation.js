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

	function checkReservationPossibilityFunction(startDateTime, endDateTime) {
		
		for (var i = 0, j = reservationsArray.length; i < j; i++) {
			
			if ((reservationsArray[i].startDateTime <= startDateTime && startDateTime <= reservationsArray[i].endDateTime) ||
				(reservationsArray[i].startDateTime <= endDateTime   && endDateTime   <= reservationsArray[i].endDateTime) ||
				(startDateTime <= reservationsArray[i].startDateTime && reservationsArray[i].startDateTime <= endDateTime) ||
				(startDateTime <= reservationsArray[i].endDateTime   && reservationsArray[i].endDateTime   <= endDateTime)) {
				return false;
			}
		}
		return true;
	}
	
})(myNamespace);//anonymous function