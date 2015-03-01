	// iife wrapper
(function() {
		// poll disabled state of transitions
	function updateDisabled() {
		for(let element of updateDisabled.transitionElements) {
			element.unpromisify(element.transition, 'disabled');
		}
	}
	updateDisabled.transitionElements = new Set();

	setInterval(updateDisabled, 200);

	Polymer({
		attached() {
			let template = this.querySelector("template");
			if(template) {
				!template.bindingDelegate && (template.bindingDelegate = this.element.syntax);
				this.shadowRoot.appendChild(template.createInstance(this));
			}
			this.logger = Ampere.default.UI.logger('<ampere-transition>', this.transition.toString());
			//this.unpromisify(this.transition, "disabled");

			updateDisabled.transitionElements.add(this);
		},
		detached() {
			updateDisabled.transitionElements.delete(this);
		},
		appearance : 'paper-button',
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

			/*
			if(arguments.length===4) {
				this[elementPropertyName]=reset;
				this.logger.log(`unpromisify() : reset this['${elementPropertyName}'] to ${reset}`);
			}
			*/
			obj[objPropertyName].then(
				val=>{
					//this.logger.log(`unpromisify() : set this['${elementPropertyName}'] from ${this[elementPropertyName]} to ${!!val}`);
					this[elementPropertyName] = !!val;
				},
				ex=>{
					this.logger.error(`unpromisify(...) : Failed to evaluate property '${elementPropertyName}' : ${ex.message}`);
				}
			);
		},
		execute(event) {
			this.disabled || this.transition.state.module.app.execute(this.transition, event);
		}
	});
})();
