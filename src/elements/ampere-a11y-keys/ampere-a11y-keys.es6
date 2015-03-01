// iife wrapper
(function() {
	let logger;
	document.addEventListener("polymer-ready", ()=>logger=Ampere.default.UI.logger(`<ampere-a11y-keys>`));

	const listen = (node, handler) => {
			if(node && node.addEventListener) {
				window.document.addEventListener('keydown', handler);
			}
		},
		unlisten = (node, handler) => {
			if(node && node.removeEventListener) {
				window.document.removeEventListener('keydown', handler);
			}
		}
	;

	Polymer({
		targetChanged(oldTarget) {
			unlisten(oldTarget, this._keyHandler);
			listen(this.target, this._keyHandler);
		}
	});
})();
