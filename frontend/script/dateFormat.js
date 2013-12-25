(function() {

	// Custom Date function to display a date in DD/MM/YYYY format
	Date.prototype.shortDateFormat = function() {
		return pad(this.getDate(),2) + "/" + pad((this.getMonth() + 1),2) + "/" + this.getFullYear();
	}

	// Custom Date function to display time in HH:MM format
	Date.prototype.shortTimeFormat = function() {
		return pad(this.getHours(),2) + ":" + pad(this.getMinutes(),2);
	}

	function pad(num, size) {
		var s = "000000000" + num;
		return s.substr(s.length-size);
	}
	
})();