(function(namespace) {

	namespace.ajaxRequests = {
	
		loadData: loadDataFunction,
		addData: addDataFunction,
		cancelReservation: cancelReservationFunction,
		cancelSequence: cancelSequenceFunction
	}

	function loadDataFunction(onLoad) {
	
		$.ajax({
		
			url: "/load", 
			success: function(data) {
			
				var loadedReservations = data.reservations;		
				for (var i = 0, j = data.reservations.length; i < j; i++) {
					loadedReservations[i].startDateTime = new Date(loadedReservations[i].startDateTime);
					loadedReservations[i].endDateTime = new Date(loadedReservations[i].endDateTime);
				}
				namespace.reservations.add(loadedReservations);		
				
				var loadedClients = data.clients;
				namespace.clients.add(loadedClients);
				
				onLoad();
			}, 
			error: errorHandler,
			timeout: 5000,
			dataType: "json"
		});
	}
	
	function addDataFunction(name, password, startDateTime, endDateTime, period, reservationsNumber, onAdd) {
	
		$.ajax({
		
			url: "/add", 
			data: {client: name, password: password, startDateTime: startDateTime.getTime(), 
					endDateTime: endDateTime.getTime(), period: period, reservationsNumber: reservationsNumber}, 
			success: function(data) {
			
				var loadedReservations = data.reservations;		
				var loadedClients = data.clients;
				if (loadedReservations != undefined && loadedClients != undefined) {
					for (var i = 0, j = data.reservations.length; i < j; i++) {
						loadedReservations[i].startDateTime = new Date(loadedReservations[i].startDateTime);
						loadedReservations[i].endDateTime = new Date(loadedReservations[i].endDateTime);
					}
					namespace.reservations.add(loadedReservations);		
					namespace.clients.add(loadedClients);
				}	
				onAdd(data.message);
			},
			error: errorHandler,
			timeout: 5000,
			dataType: "json"
		});
	}
	
	function cancelReservationFunction(id, password, onCancelReservation) {
		
		$.ajax({
			url: "/cancelReservation", 
			data: {id: id, password: password}, 
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
	
	function cancelSequenceFunction(sequence, password, onCancelSequence) {
	
		$.ajax({
			url: "/cancelSequence", 
			data: {sequence: sequence, password: password}, 
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
	
	function errorHandler(jqxhr, status, errorMsg) {
	
		noty({
			
			layout: 'topRight',
			type: 'error',
			text: "Request failed, status: " + status, 
			timeout: 3000
		});
	}
	
})(myNamespace);