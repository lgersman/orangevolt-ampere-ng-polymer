	// iife wrapper
(function() {
	let logger;
	document.addEventListener("polymer-ready", ()=>logger=Ampere.default.UI.logger(`<ampere-app>`));

		/**
		* injects setView call into undo/redo function
		*/
	function wrapOperation(host:HTMLElement, operation:Function, view:View, setView:Function) {
		return ()=>{
			const reverseView = view.state.module.app.view;
			if(typeof(operation)==='function') {
				let promise = new Promise((resolve, reject)=>{
					try {
						return Promise.resolve(operation()).then(resolve, reject);
					} catch(ex) {
						reject(ex);
					}
				});

				promise = promise.then(
						// wait for transition view to be ready
					reverseOperation/*:Function*/=>{
						return view.promise.then(()=>{
							host.classList.remove(`state-${app.view.state.name}`, `view-${app.view.name}`);

							setView(view);

							host.classList.add(`state-${app.view.state.name}`, `view-${app.view.name}`);

							app.ui('unblock');

							return typeof(reverseOperation)==='function' ? wrapOperation(host, reverseOperation, reverseView, setView): reverseOperation;
						});
					},
					(ex)=>{
						if(ex instanceof Error) {
							return new Promise((resolve,reject)=>{
								const cancel = ()=>{
									app.ui('unblock');
									app.ui('flash', 'Operation aborted');
									alert("canceled");
									reject(undefined);
								};
								cancel[Ampere.UI.CAPTION]='Cancel';
								cancel[Ampere.UI.ICON]='cancel';

								const retry = ()=>{
									alert("retried");
									resolve("Subber");
								};
								retry[Ampere.UI.CAPTION]='Retry';
								retry[Ampere.UI.ICON]='autorenew';
									// TODO : set title element of document ??

								app.ui('flash',	ex.message || 'Error occured', {dismiss:false, actions : [cancel, retry], error : ex});
							});
						} else {
							return Promise.reject(undefined);
						}
					}
				);

				return promise;
			} else {
				app.ui('unblock');
				return Promise.resolve(operation);
			}
		};
	}

		/**
		*	default executor implementation

		* @param transition the transition to execute
		* @param setView contextual function to set the resulting view
		*/
	function appExecutor(transition/*Transition*/,setView:Function,...params) {
		var host 				= this,
				app  				= transition.state.module.app,
				transaction = transition.transaction,
					// this is just for shorter code
				Ampere = window.Ampere.default
		;

		app.ui('block');
		app.ui('flash', `Executing transition ${transition.name}`);

			// execute transition transaction
		var promise = new Promise((resolve, reject)=>{
			try {
				Promise.resolve(transaction(params)).then(resolve, reject);
			} catch(ex) {
				app.ui('unblock');
				reject(ex);
			}
		});

			// execute redo operation
		promise = promise.then(
			redo/*Function*/=>wrapOperation(host, redo, transition.view, setView)(),
			ex=>{
				const cancel=()=>app.ui('unblock');
				//cancel[Ampere.UI.CAPTION]='Cancel';
				cancel[Ampere.UI.ICON]='close';

				app.ui('flash',	ex.message || 'Error occured', { actions : [cancel], error : ex});
				Promise.reject(ex);
			}
		);

		return promise;
	}

		// the symbol to use as key for the internal ui actions
	const UI_ACTIONS  = Symbol('UI_ACTIONS');

		/**
		*
		*/
	function appUiInterface(host:HTMLElement/*:ampere-app*/,app/*:App*/,action:string,...params) {
		host.logger.assert(typeof(action)==='string' && action.length>0, `app.ui(action,...params) : action is required to be non empty string but was "${action}"`);

		let fnName, fn;
			// arguments available : try to evaluate setter function
		if(params.length) {
			fnName = `set${action[0].toUpperCase()}${action.substring(1)}`;
			fn = host[UI_ACTIONS][`get${action[0].toUpperCase()}${action.substring(1)}`];
		} else {
			fnName = `get${action[0].toUpperCase()}${action.substring(1)}`;
			fn = host[UI_ACTIONS][`get${action[0].toUpperCase()}${action.substring(1)}`];
		}

		if(!fn) {
			fn = host[UI_ACTIONS][action];

			if(typeof(fn)!=='function') {
				host.logger.assert(
					typeof(fn)==='function',
					params.length ? `app.ui(action,...) : neither ui function "${action}" nor setter "${fnName}" found.` : 'app.ui(action) : neither ui function "${action}" nor getter "${fnName}" found.'
				)
			}

			params.unshift(app);

			return fn.apply(this, params);
		}
	}

	Polymer({
		attached() {
			var template = this.querySelector("template");
			if(template) {
				!template.bindingDelegate && (template.bindingDelegate = this.element.syntax);
				this.shadowRoot.appendChild(template.createInstance(this));
			}
		},
		appChanged(o, app) {
			this.logger=Ampere.default.UI.logger('<ampere-app>', app.toString());

				// override execute function
			app.execute = appExecutor.bind(this);
				// bridge ui into app
			app.ui = appUiInterface.bind(this, this);

			this.classList.add(`state-${app.view.state.name}`, `view-${app.view.name}`);
		},
	registerUIAction(action:string, fn:Function) {
			logger.assert(typeof(action)==='string' && typeof(fn)==='function', 'app.registerUIAction(action,fn) : action is required to be non empty string but was "' + action +  '" and 2nd argument expected to be an function');

			logger.assert(this[UI_ACTIONS][action]===undefined, 'app.registerUIAction(action,fn) : action(=" + action + ") is already registered');

			this[UI_ACTIONS][action] = fn;
		},
		[UI_ACTIONS] : {}
		/*,
		computed : {
			view : 'app.view'
		}*/
	});
})();
