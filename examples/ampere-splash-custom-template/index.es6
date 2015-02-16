function bootstrap(Ampere=window.Ampere.default) {
	let d = Ampere.domain(null, (domain, createModule)=>{
		createModule(null, (module, createState, createTransition)=>{
			module.options[Ampere.UI.CAPTION] = document.title;

			createState(null, (state, createView, createTransition)=>{
				createView(null, (view, createTemplate)=>{
				});
			});

			let delay =	progress=>new Promise(resolve=>{
				//console.log(progress);
				module.promise.message = progress;
				setTimeout(resolve, 1000);
			});

			return delay("Module in 4 seconds ready")
			.then(()=>delay("Module in 3 seconds ready"))
			.then(()=>delay("Module in 2 seconds ready"))
			.then(()=>delay("Module in 1 seconds ready"))
			.then(()=>delete module.promise.message)
			/*.then(()=>new Promise(resolve=>window.resolve=resolve))*/;
		});
	})
	return d.modules[Ampere.DEFAULT].states[Ampere.DEFAULT].views[Ampere.DEFAULT];
}
