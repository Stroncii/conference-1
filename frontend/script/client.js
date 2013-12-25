(function(namespace) {

	function Client(name, password) {
		
		this.id = id;
		this.name = name;
	}

	var clientsArray = new Array();
	var namesArray = new Array();
	
	namespace.clients = {
	
		create:	createFunction,		
		add:	addFunction,	
		has: 	hasFunction,
		getById: getByIdFunction
	}
	
	function createFunction(id, name) {
		return new Client(id, name);
	}
	
	function addFunction(newClients) {
		clientsArray = clientsArray.concat(newClients);
		for (var i = 0; i < newClients.length; i++) {
			namesArray.push(newClients[i].name);
		}
	}
	
	function hasFunction(name) {
	
		if (namesArray.indexOf(name) != -1) {
			return true;
		}
		else {
			return false;
		}
	}
	
	function getByIdFunction(id) {
	
		for (var i = 0, j = clientsArray.length; i < j; i++) {
	
			if (clientsArray[i].id == id) {
				return clientsArray[i];
			}
		}
		return null;
	}
	
})(myNamespace);