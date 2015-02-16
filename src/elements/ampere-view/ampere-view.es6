	// iife wrapper
(function() {
	const TEMPLATE_INSTANCE = Symbol('TEMPLATE_INSTANCE');

	let logger;
	document.addEventListener("polymer-ready", ()=>logger=Ampere.default.UI.logger(`<ampere-view>`));

	function makeSyntax(/*ampereView*/) {
		let events = Object.create(Polymer.api.declaration.events);
		//events.findController = function() { return ampereView; };

		let syntax = new PolymerExpressions(),
				prepareBinding = syntax.prepareBinding
		;
		syntax.prepareBinding = function(pathString, name, node) {
			return events.prepareEventBinding(pathString, name, node) ||
				prepareBinding.call(syntax, pathString, name, node);
		};
		return syntax;
	}

	Polymer({
		created() {
				// bind Polymer dispatchMethod to this.view to
				// allow binding of on-* events to the view
			let dispatchMethod = this.dispatchMethod;

			this.dispatchMethod = (obj, method, args)=>dispatchMethod.call(this, this.view, method, args);
		},
		viewChanged(o, view) {
			logger.log(`view changed : view:${view}`);
			let _logger = Ampere.default.UI.logger('<ampere-view>', view.toString());

				// backup template style
			let styleElement=this.shadowRoot.querySelector("style");
				// make shadow root empty
			while(this.shadowRoot.firstChild) {
				this.shadowRoot.removeChild(this.shadowRoot.firstChild);
			}
			styleElement && this.shadowRoot.appendChild(styleElement);

				// call view.detached(<ampere-view>,templateInstance) if exists
			if(this[TEMPLATE_INSTANCE] && typeof(view.detached)==='function') {
				_logger.log('calling detected view method detached(<ampere-view>,templateInstance)');
				view.detached(this,this[TEMPLATE_INSTANCE]);
			}

			let template = view.template || this.$.default;
				// set bindingDelegate on template
			!template.bindingDelegate && (template.bindingDelegate = this.element.syntax);

				// append template
			this.shadowRoot.appendChild(this[TEMPLATE_INSTANCE]=template.createInstance(view, makeSyntax()));

			// http://stackoverflow.com/questions/26683274/polymer-js-attach-handler-to-paper-button-in-standard-html-dom
			// http://stackoverflow.com/questions/28104808/polymer-function-call-with-parameters
			// http://stackoverflow.com/questions/28210278/polymer-event-parameters-on-repeat/28211187

				// call view.attached(templateInstance) if exists
			if(this[TEMPLATE_INSTANCE] && typeof(view.attached)==='function') {
				_logger.log('calling detected view method attached(<ampere-view>,templateInstance)');
				view.attached(this,this[TEMPLATE_INSTANCE]);
			}
		},
		computed : {
			'view' : 'host.app.view'
		}
	});
})();
