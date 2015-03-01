function bootstrap(Ampere=window.Ampere.default) {
	let d = Ampere.domain(null, (domain, createModule)=>{
		createModule(null, (module, createState, createTransition)=>{
			module.options[Ampere.UI.CAPTION] = document.title;
			module.options[Ampere.UI.DESCRIPTION] = "Tap toolbar actions to see something happen !";
			module.options[Ampere.UI.ICON] = "stars";

			createState(null, (state, createView, createTransition)=>{
				state.options[Ampere.UI.DESCRIPTION] = module.options[Ampere.UI.DESCRIPTION];

				state.value = 0;

				createView(null, (view, createTemplate)=>createTemplate(document.querySelector('#view')));

				createTransition('Inc 1 Undoable', transition=>{
					transition.options[Ampere.UI.SCOPE] = 'global';
					transition.options[Ampere.UI.SCOPE_GROUP] = 'actions';
						// hint : values can be functions
					transition.options[Ampere.UI.DESCRIPTION] = t=>`Increment 1 (Hotkey : ${t.options[Ampere.UI.HOTKEY]})`;
						// hotkeys can be space separated a11y keys
					transition.options[Ampere.UI.HOTKEY] = 'pageup';

					transition.transaction=()=>{
						let redo, undo = ()=>{
							state.value--;

							transition.log(`undo : state.value=${state.value}`);

							return redo;
						};

						return (redo = ()=>{
							state.value++;

							transition.log(`redo : state.value=${state.value}`);

							return undo;
						});
					};
				});

				createTransition('Inc 10 Undoable', transition=>{
					transition.options[Ampere.UI.SCOPE] = 'global';
					transition.options[Ampere.UI.SCOPE_GROUP] = 'actions';
					transition.options[Ampere.UI.ICON] = 'close';

						// same but different implemented
					transition.transaction=()=>{
							// backup current value
						const VALUE = state.value;

						let redo, undo = ()=>{
							state.value=VALUE;

							transition.log(`undo : state.value=${state.value}`);

							return redo;
						};

						return (redo = ()=>{
							state.value=VALUE + 10;

							transition.log(`redo : state.value=${state.value}`);

							return undo;
						});
					};
				});

				createTransition('Inc 5 w/o Undo', transition=>{
					transition.options[Ampere.UI.SCOPE] = 'global';
						// let this transition appear in a separate transition group
					transition.options[Ampere.UI.SCOPE_GROUP] = 'group1';

					transition.transaction=()=>
						()=>{
							state.value+=5;

							transition.log(`redo : state.value=${state.value}`);
						}
					;
				});


				createTransition('undo', transition=>{
					transition.options[Ampere.UI.SCOPE] = 'global';
					transition.options[Ampere.UI.SCOPE_PRIORITY] = 'secondary';
					transition.options[Ampere.UI.HOTKEY] = 'ctrl+z';

					transition.disabled = ()=>!module.app.history.canUndo;
						// CAVEAT : ()=>!module.app.history.undo() means "return result of undo()" which
						// would be interpreted as this transitions redo function. We use the
						// negotiation operator to suppress undo() return value to be assigend as transition redo operation
					transition.transaction = ()=>!module.app.history.undo();
				});

				createTransition('redo', transition=>{
					transition.options[Ampere.UI.SCOPE] = 'global';
					transition.options[Ampere.UI.SCOPE_PRIORITY] = 'secondary';
					transition.options[Ampere.UI.HOTKEY] = 'ctrl+y';

					transition.disabled = ()=>!module.app.history.canRedo;
						// CAVEAT : ()=>!module.app.history.redo() means "return result of redo()" which
						// would be interpreted as this transitions redo function. We use the
						// negotiation operator to suppress redo() return value to be assigend as transition redo operation
					transition.transaction = ()=>!module.app.history.redo();
				});

				createTransition('reset', transition=>{
					transition.options[Ampere.UI.SCOPE] = 'global';
						// make reset appaear in a different group (i.e. spearated)
					transition.options[Ampere.UI.SCOPE_GROUP] = 'group1';
					transition.options[Ampere.UI.SCOPE_PRIORITY] = 'secondary';

					transition.disabled = ()=>!module.app.history.canReset;
						// CAVEAT : ()=>!module.app.history.reset() means "return result of reset()" which
						// would be interpreted as this transitions redo function. We use the
						// negotiation operator to suppress reset() return value to be assigend as transition redo operation
					transition.transaction = ()=>!module.app.history.reset();
				});
			});
		});
	})
	return d.modules[Ampere.DEFAULT].states[Ampere.DEFAULT].views[Ampere.DEFAULT];
}
