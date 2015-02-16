	// iife wrapper
(function() {
		// Symbol key for current flash job
	var RECENT_FLASH_JOB = Symbol("RECENT_FLASH_JOB");

	let logger;
	document.addEventListener("polymer-ready", ()=>logger=Ampere.default.UI.logger(`<ampere-status>`))

	Polymer({
		attached() {
			const template = this.querySelector("template");
			if(template) {
				!template.bindingDelegate && (template.bindingDelegate = this.element.syntax);
				this.shadowRoot.appendChild(template.createInstance(this));
			}

				// contribute action to ampere-app element
			this.host.registerUIAction("block", this.block.bind(this));
			this.host.registerUIAction("unblock", this.unblock.bind(this));
			this.host.registerUIAction("flash", this.flash.bind(this));
				// wrap all progress calls into a polymer job
			this.host.registerUIAction("progress", (...args)=>this.job( 'progress', ()=>this.progress(...args), 200));

			/*
			this.$.toast.addEventListener('core-overlay-close-completed', function() {
				this.flash.options = {};
			}.bind(this));
			*/

				// prevent automatic dismiss if user actions are applied
			this.$.toast.addEventListener('core-overlay-open', e=>this.$.toast.dismissJob.stop());
		},
		displayError(event, details, target) {
			this.$.errordetails.open();
			event.stopPropagation();
		},
		executeAction(event, details, target) {
			var action = this.flash.options && this.flash.options.actions && target.templateInstance.model.action;
			try {
					// reset options
				this.flash.options = {};

				logger.assert(typeof(action)==='function', 'ampere-status.executeAction(event) : action expected to be a function');
				action();
			} catch(ex) {
				debugger
			}
		},
			// blocks the user interface
		block(app, param) {
				// set param=true if param argument is not given
			param = arguments.length==1 ? true : param;

			logger.log(`ui.block(${!!param})`);
			this.$.overlay[!!param ? 'open' : 'close']();
		},
			// unblocks the user interface
		unblock(app) {
			logger.log('ui.unblock()');
			this.$.overlay.close();
		},
		progress(app, param) {
			if(arguments.length===1) {
				this.$.progress.indeterminate = false;
				this.$.progress.secondaryProgress = 0;
				this.$.progress.value = 0;
				this.$.progress.secondaryProgress = 0;
				this.$.progressTooltip.disabled = true;
			} else if(typeof(param)==='number') {
				logger.assert(param>=0 && param<=100, 'ui("progress", <number>) : number argument expected to be >=0 && <=100) but was ' + param);
				this.$.progress.indeterminate = false;
				this.$.progress.value = param;
				this.$.progress.secondaryProgress = 0;
				this.$.progressTooltip.disabled = true;
			} else if(typeof(param)==='boolean') {
				this.$.progress.indeterminate = param;
				this.$.progress.secondaryProgress = 0;
				this.$.progress.value = 0;
				this.$.progressTooltip.disabled = true;
			} else if(typeof(param)==='string') {
				this.$.progress.value = 0;
				this.$.progress.indeterminate = true;
				this.$.progressTooltip.disabled = !(this.$.progressTooltip.label = param);
				if(!this.$.progressTooltip.disabled) {
					this.$.progressTooltip.show=true;
					this.job('progress.hideTooltip', ()=>this.$.progressTooltip.show=false, 4000);
				}
			} else if(typeof(param)==='object') {
				('value' in param) && this.progress(app, param.value);
				('secondaryProgress' in param) && (this.$.progress.secondaryProgress = param.secondaryProgress);
				if('description' in param) {
					this.$.progressTooltip.disabled = !(this.$.progressTooltip.label = param.description);
					if(!this.$.progressTooltip.disabled) {
						this.$.progressTooltip.show=true;
						this.job('progress.hideTooltip', ()=>this.$.progressTooltip.show=false, 4000);
					}
				}
			} else {
				logger.assert(false, 'dont know how to handle given arguments');
			}
		},
			// shows a flash message
		flash(app, text, options) {
			if(arguments.length===1 || !text) {
				logger.log('ui.flash()');
				this.job('flash', ()=>this.$.toast.dismiss(), 0);
			} else {
				const job = ()=>{
						// normalize options
					options = options || { actions : []};

						// normalize actions to array
					if('actions' in options) {
						!Array.isArray(options.actions) && (options.actions = [options.actions]);
					} else {
						options.actions = [];
					}

						// adjust dismiss option if dismiss is not explicitly set
						// dismiss=no actions available
					("dismiss" in options) || (options.dismiss = !options.actions.length);

						// normalize action caption
					options.actions.forEach(action=>{
						action[Ampere.default.UI.CAPTION]!==undefined || (action[Ampere.default.UI.CAPTION]=action.name||undefined);

						logger.assert(
							action[Ampere.default.UI.CAPTION] || action[Ampere.default.UI.ICON],
							`ui.flash(text, options) : Either Ampere.default.UI.CAPTION, Ampere.default.UI.ICON must be set or action function must be named : ${action.toString()}`);
					});

					this.flash.options = options;
					this.$.toast.text = text;
					this.$.toast.show();

						// if recent job is this job and no actions/error are applied
					setTimeout(()=>this[RECENT_FLASH_JOB]===job && options.dismiss && this.$.toast.dismiss(), this.$.toast.duration);
				};

					// remember current job as recent
				this[RECENT_FLASH_JOB] = job;

				this.job('flash', job, 200);
			}
		}
	});
})();
