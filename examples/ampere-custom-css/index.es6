function bootstrap(Ampere=window.Ampere.default) {
	let d = Ampere.domain(null, (domain, createModule)=>{
		createModule(null, (module, createState, createTransition)=>{
			module.options[Ampere.UI.CAPTION] = document.title;
			module.options[Ampere.UI.DESCRIPTION] = 'Tap a transition in the global toolbar to activate another view with custom style applied';
			module.options[Ampere.UI.ICON] = "star-outline";

			createState(null, (state, createView, createTransition)=>{
				createView(null, (view, createTemplate)=>{
					view.options[Ampere.UI.ICON]="check";
				});

				createView('print', (view, createTemplate)=>{
				});
			});

			createState('a', (state, createView, createTransition)=>{
				createView('one', (view, createTemplate)=>{
				});

				createView('two', (view, createTemplate)=>{
				});
			});

			createState('b', (state, createView, createTransition)=>{
				createView('one', (view, createTemplate)=>{
				});
			});

			for(let name of Object.keys(module.states)) {
				let s = module.states[name];

				for(let name of Object.keys(s.views)) {
					let v = s.views[name];
					v.options[Ampere.UI.CAPTION]=`state ${JSON.stringify(s.name)}[view ${JSON.stringify(v.name)}]`;
					v.options[Ampere.UI.DESCRIPTION] = module.options[Ampere.UI.DESCRIPTION];

					createTransition(`state ${JSON.stringify(s.name)}[view ${JSON.stringify(v.name)}]`, transition=>{
						transition.options[Ampere.UI.SCOPE] = 'global';
					}, v);
				}
			}
		});
	})
	return d.modules[Ampere.DEFAULT].states[Ampere.DEFAULT].views[Ampere.DEFAULT];
}
