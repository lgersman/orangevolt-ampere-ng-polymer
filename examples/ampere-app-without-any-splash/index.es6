function bootstrap(Ampere=window.Ampere.default) {
	let d = Ampere.domain(null, (domain, createModule)=>{
		createModule(null, (module, createState, createTransition)=>{
			module.options[Ampere.UI.CAPTION] = document.title;

			createState(null, (state, createView, createTransition)=>{
				createView(null, (view, createTemplate)=>{
					return new Promise(resolve=>{
							// we need to wait until the dom is ready before accessing the dom
						document.addEventListener('DOMContentLoaded', ()=>{
							createTemplate(document.querySelector('#view'));
							resolve();
						});
					});
				});
			});
		});
	})
	return d.modules[Ampere.DEFAULT].states[Ampere.DEFAULT].views[Ampere.DEFAULT];
}
