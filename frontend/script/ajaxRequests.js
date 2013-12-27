(function(namespace) {

	namespace.ajaxRequests = {
	
		loadData: loadDataFunction,
		addData: addDataFunction,
		cancelReservation: cancelReservationFunction,
		cancelSequence: cancelSequenceFunction
	}

	//load all reservation and client entries in JSON format from server
	//create Client and Reservation objects, add them to corresponding arrays
	function loadDataFunction(onLoad) {
	
		$.ajax({
		
			url: "/load", 
			success: function(data) {
			
				addObjects(data.reservations, data.clients);	
				onLoad();
			}, 
			error: errorHandler,
			timeout: 5000,
			dataType: "json"
		});
	}
	
	//send new reservation's parameters to server
	//if new reservations or clients were added to database - add them to local arrays
	//call callback function with server message as parameter
	function addDataFunction(name, password, startDateTime, endDateTime, period, reservationsNumber, onAdd) {
	
		$.ajax({
		
			url: "/add", 
			data: {client: name, password: password, startDateTime: startDateTime.getTime(),
					endDateTime: endDateTime.getTime(), period: period, reservationsNumber: reservationsNumber},		
					
			success: function(data) {
			
				addObjects(data.reservations, data.clients);
				onAdd(data.message);
			},
			error: errorHandler,
			timeout: 5000,
			dataType: "json"
		});
	}
	
	//send cancelled reservation's id and password of its owner to server
	//if reservation was deleted from database - delete it from local array
	//call callback function with server message as parameter
	function cancelReservationFunction(id, name, password, onCancelReservation) {
		
		$.ajax({
			url: "/cancelReservation", 
			data: {id: id, name: name, password: password}, 
			success: function(data) {
			
				var canceledReservationId = data.canceledReservationId;		
				if (canceledReservationId != undefined) {
					namespace.reservations.cancel(canceledReservationId);
				}
				onCancelReservation(data.message);
			}, 
			error: errorHandler,
			timeout: 5000,
			dataType: "json"
		});
	}
	
	//send cancelled reservation's sequence and password of their owner to server
	//if reservations were deleted from database - delete them from local array
	//call callback function with server message as parameter
	function cancelSequenceFunction(sequence, name, password, onCancelSequence) {
	
		$.ajax({
			url: "/cancelSequence", 
			data: {sequence: sequence, name: name, password: password}, 
			success: function(data) {
			
				var canceledSequence = data.canceledSequence;		
				if (canceledSequence != undefined) {
					namespace.reservations.cancelSequence(canceledSequence);
				}
				onCancelSequence(data.message);
			}, 
			error: errorHandler,
			timeout: 5000,
			dataType: "json"
		});
	}
	
	//show error message if request failed
	function errorHandler(jqxhr, status, errorMsg) {
	
		noty({
			
			layout: 'topRight',
			type: 'error',
			text: "Request failed, status: " + status, 
			timeout: 3000
		});
	}
	
	//create Client and Reservation objects, add them to corresponding arrays
	function addObjects(loadedReservations, loadedClients) {
	
		if (loadedReservations != undefined && loadedClients != undefined) {
			for (var i = 0, j = loadedReservations.length; i < j; i++) {
				loadedReservations[i] = namespace.reservations.create(loadedReservations[i].id, 
				loadedReservations[i].clientId, new Date(loadedReservations[i].startDateTime),
				new Date(loadedReservations[i].endDateTime), loadedReservations[i].sequence);
			}
			namespace.reservations.add(loadedReservations);				
			for (var i = 0, j = loadedClients.length; i < j; i++) {
				loadedClients[i] = namespace.clients.create(loadedClients[i].id, loadedClients[i].name);
			}
			namespace.clients.add(loadedClients);
		}
	}
	
})(myNamespace);