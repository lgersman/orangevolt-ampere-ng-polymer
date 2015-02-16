	// iife wrapper
(function() {
	Polymer({
		open() {
			this.opened = true;
		},
		close() {
			this.opened = false;
		},
		publish : {
			opened : {
				value : false,
				reflect : true
			}
		}
	});
})();
