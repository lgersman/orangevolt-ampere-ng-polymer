	// iife wrapper
(function() {
	//let logger;
	//document.addEventListener("polymer-ready", ()=>logger=Ampere.default.UI.logger(`<ampere-dialog>`));

	Polymer({
		onCoreOverlayCompleted() {
				// if this is not the top most dialog
			if(this.disabled) {
					// make overlay having same z-index as dialog
				this.$.overlay.style['z-index']=this.$.dialog.style['z-index'];
					// this is a chrome only workaround for duisplaying
					// view in the right z-index order. occures only if many nested dialogs
					// created at once ...
					// (ff does it wrong using this wa ...)
				//this.$.dialog.style['z-index']=this.host.views.indexOf(this.view);
			}
		},
		transitions(...path) {
			return this.view && Ampere.default.UI.transitions(this.view.state, this.view.name, path);
		}
	});
})();
