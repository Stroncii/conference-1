//functions to send data on server (or get information from it)

function loadBase() {
	
	document.getElementById("reservations_list_div").innerHTML = "<img src='wait.gif' alt='Loading...' />";
    ajaxReq.send("GET", "/conference/loadbase", loadbaseHandleRequest);
} 

function loadbaseHandleRequest() {
	
	if (ajaxReq.getReadyState() == 4 && ajaxReq.getStatus() == 200) {
        // Store the XML response data
        var xmlData = ajaxReq.getResponseXML().getElementsByTagName("base")[0];

        // Create the arrays of Client and Reservation entry objects
        var reservations = xmlData.getElementsByTagName("reservation");
        for (var i = 0; i < reservations.length; i++) {
        	// Create the reservation entry
        	var client = getText(reservations[i].getElementsByTagName("client")[0]);
        	var startDateTime = new Date(parseInt(
        			getText(reservations[i].getElementsByTagName("startdatetime")[0])));      	
        	var endDateTime = new Date(parseInt(
        			getText(reservations[i].getElementsByTagName("enddatetime")[0])));
			var sequence = getText(reservations[i].getElementsByTagName("sequence")[0]);
        	
        	reservationsList.push(new Reservation(client, startDateTime, endDateTime, sequence));
        	
        	if (clientsList.indexOf(client) == -1) {
        		clientsList.push(client);
        	}
        }
        
        // Show reservations list
        showReservationsList(document.getElementById("reservations_list_div"), new Date());
      }
}


function addToBase(name, password, startDateTime, endDateTime, period, reservationsNumber){

	// Send the new blog entry data as an Ajax request
    ajaxReq.send("POST", "/conference/addtobase", addToBaseHandleRequest, "application/x-www-form-urlencoded; charset=UTF-8",
		"name=" + name + "&password=" + password +
		"&startdatetime=" + startDateTime.getTime() + 
		"&enddatetime=" + endDateTime.getTime() + 
		"&period=" + period + 
		"&reservationsnumber=" + reservationsNumber);
}

function addToBaseHandleRequest() {

	if (ajaxReq.getReadyState() == 4 && ajaxReq.getStatus() == 200) {
		
		var result = parseInt(ajaxReq.getResponseText());
		// Confirm  operation
		if (result == "1") {
			alert("Try to change time of your reservation!");
		} else if (result == "2") {
			alert("Incorrect password!");
		} else {
			alert("The new entry was successfully added.");
			//update local data
		    for (var i = 0; i < tempClientsList.length; i++) {
				clientsList.push(tempClientsList[i]);
			}
			for (var i = 0; i < tempReservationsList.length; i++) {
				reservationsList.push(tempReservationsList[i]);
			}
			// update view
			showReservationsList(document.getElementById("reservations_list_div"), selectedDate);
		}
    }
}

//Get the text content of an HTML element
function getText(elem) {
  var text = "";
  if (elem) {
    if (elem.childNodes) {
      for (var i = 0; i < elem.childNodes.length; i++) {
        var child = elem.childNodes[i];
        if (child.nodeValue)
          text += child.nodeValue;
        else {
          if (child.childNodes[0])
            if (child.childNodes[0].nodeValue)
              text += child.childNodes[0].nodeValue;
        }
      }
    }
  }
  return text;
}