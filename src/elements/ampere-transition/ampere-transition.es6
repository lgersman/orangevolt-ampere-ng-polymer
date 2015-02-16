	// iife wrapper
(function() {
	Polymer({
		attached() {
			let template = this.querySelector("template");
			if(template) {
				!template.bindingDelegate && (template.bindingDelegate = this.element.syntax);
				this.shadowRoot.appendChild(template.createInstance(this));
			}
			this.logger = Ampere.default.UI.logger('<ampere-transition>', this.transition.toString());
			this.unpromisify(this.transition, "disabled");
		},
		disabled : true,
			/**
			* unpromisify will convert a promise into a object property
			*
			* obj the model to get a promise from
			* objPropertyName the name of the model property returning the promise
			* elementPropertyName (optional) the elements property to set
			* reset (optional) the value to set the elements property to until the promise is resolved
			*/
		unpromisify(obj, objPropertyName, elementPropertyName, reset) {
			!elementPropertyName && (elementPropertyName=objPropertyName);
			arguments.length===3 && (this[elementPropertyName]=reset);
			this.logger.log(`unpromisify() : reset this['${elementPropertyName}'] to ${reset}`);

			obj[objPropertyName].then(
				val=>{
					this.logger.log(`unpromisify() : set this['${elementPropertyName}'] from ${this[elementPropertyName]} to ${!!val}`);
					this[elementPropertyName] = !!val;
				},
				ex=>this[elementPropertyName] = val
			);
		},
		execute(event) {
			this.transition.state.module.app.execute(this.transition, event);
		}
	});
})();
