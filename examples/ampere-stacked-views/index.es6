function bootstrap(Ampere=window.Ampere.default) {
	let d = Ampere.domain(null, (domain, createModule)=>{
		createModule(null, (module, createState, createTransition)=>{
			module.options[Ampere.UI.CAPTION] = document.title;
			module.options[Ampere.UI.DESCRIPTION] = document.querySelector('meta[name="description"]').content;

			//let bitch;
			//createState('kinky', (state, createView, createTransition)=>bitch=createView('bitch', (view, createTemplate)=>{}));

			createState(null, (state, createView, createTransition)=>{
				let main 				  = createView('main', (view, createTemplate)=>{
						createTemplate(document.querySelector('#main1'))
					}),
					first_dialog  = createView('first-dialog', (view, createTemplate)=>{
						//createTemplate(document.querySelector('#first-dialog'));
						view.options[Ampere.UI.CAPTION] 		= view.name;
						view.options[Ampere.UI.DESCRIPTION] = 'This is the description of the first dialog';
					}),
					second_dialog = createView('second-dialog',(view, createTemplate)=>{
						createTemplate(document.querySelector('#second-dialog'))
						view.options[Ampere.UI.CAPTION] 	 = view.name;
						view.options[Ampere.UI.DESCRIPTION]= 'Description of second dialog';
						view.options[Ampere.UI.ICON] = 'info-outline';
					})
				;

				//state.options[Ampere.UI.CAPTION] 		= document.title;
				state.options[Ampere.UI.DESCRIPTION]= module.options[Ampere.UI.DESCRIPTION];

					// declare view "main" as parent view of view "first_dialog"
				first_dialog.options[Ampere.UI.PARENT] = main;

					// declare view "first_dialog" as parent view of view "first_dialog"
				second_dialog.options[Ampere.UI.PARENT] = first_dialog;

				createTransition('first-dialog', transition=>{
					//transition.options[Ampere.UI.SCOPE] = 'global';
					transition.options[Ampere.UI.CAPTION] = 'Open first dialog (or press F1)';
					transition.options[Ampere.UI.HOTKEY] = 'f1';
				}, first_dialog);

				createTransition('first-dialog-close', transition=>{
					transition.options[Ampere.UI.SCOPE] = first_dialog.name;
					transition.options[Ampere.UI.SCOPE_PRIORITY] = 'secondary';
					transition.options[Ampere.UI.CAPTION] = 'Close';
					transition.options[Ampere.UI.HOTKEY] = 'esc';
				}, main);

				createTransition('second-dialog', transition=>{
					transition.options[Ampere.UI.SCOPE] = first_dialog.name;
					//transition.options[Ampere.UI.ICON] = ''; // overwrite view icon with no icon
					transition.options[Ampere.UI.CAPTION] = 'Open second dialog over first dialog';
				}, second_dialog);

				createTransition('second-dialog-close', transition=>{
					transition.options[Ampere.UI.SCOPE] = second_dialog.name;
					transition.options[Ampere.UI.SCOPE_PRIORITY] = 'secondary';
					transition.options[Ampere.UI.CAPTION] = 'Close';
					transition.options[Ampere.UI.HOTKEY] = 'esc';
				}, first_dialog);
			});
		});
	})
	return d.modules[Ampere.DEFAULT].states[Ampere.DEFAULT].views.main;
}
