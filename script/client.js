(function(namespace) {

	function Client(name, password) {
		
		this.name = name;
		this.password = password;
	}

	var clientsArray = new Array();
	var namesArray = new Array();
		
	namespace.clients = {
	
		create:	createFunction,		
		add:		addFunction,	
		checkPass:	checkPassFunction,
		has: 		hasFunction
	}	
	
	function createFunction(name, password) {
		return new Client(name, password);
	}
	
	function addFunction(newClients) {
		clientsArray = clientsArray.concat(newClients);
		for (var i = 0; i < newClients.length; i++) {
			namesArray.push(newClients[i].name);
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
	
})(myNamespace);