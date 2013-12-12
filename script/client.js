(function() {

	function Client(name, password) {
		
		this.name = name;
		this.password = password;
	}

	var clientsArray = [ new Client("Client_1", "1111"),
						 new Client("Client_2", "2222")];
	
	var namesArray = new Array();
	
	for (var i = 0; i < clientsArray.length; i++) {
		namesArray.push(clientsArray[i].name);
	}
		
	window.initVariables().initClients( {
		
			create:		createFunction,		
			add:		addFunction,
			checkPass:	checkPassFunction,		
			has: hasFunction
	});
	
	function createFunction(name, password) {
		return new Client(name, password);
	}
	
	function addFunction(newClient) {
	
		if (newClient != undefined) {
			clientsArray.push(newClient);
		}
	}
	
	function checkPassFunction(name, pass) {
	
		for (var i = 0; i < clientsArray.length; i++) {
			if (clientsArray[i].name == name && clientsArray[i].password == pass) {
				return true;
			}
		}	
		return false;
	}
	
	function hasFunction(name) {
	
		if (namesArray.indexOf(name) != -1) {
			return true;
		}
		else {
			return false;
		}
	}
	
})();