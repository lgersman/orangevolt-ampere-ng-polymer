function bootstrap(Ampere=window.Ampere.default, UI=Ampere.UI) {
  return Ampere.domain(null, (domain, createModule)=>{
    createModule(null, (module, createState, createTransition, options=module.options)=>{
      options[UI.CAPTION] = document.title;
      options[UI.ICON] = "star-outline";

      createState(null, (state, createView, createTransition)=>{
        createView(null, view=>view.options[UI.ICON]="check");

        createView('print', view=>{});
      });

      createState('a', (state, createView, createTransition)=>{
        createView('one', view=>{});
        createView('two', view=>{});
      });

      createState('b', (state, createView, createTransition)=>{
        createView('one', view=>{});
      });

      for(let name of Object.keys(module.states)) {
        let state = module.states[name];
        state.options[UI.DESCRIPTION] = 'Tap a transition in the global toolbar to activate another view with custom style applied';

        for(let name of Object.keys(state.views)) {
          let view = state.views[name];
          // view.options[UI.CAPTION]=`state ${JSON.stringify(state.name)}[view ${JSON.stringify(view.name)}]`;

          createTransition(
            `state ${JSON.stringify(state.name)}[view ${JSON.stringify(view.name)}]`,
            transition=>transition.options[UI.SCOPE] = 'global',
            view
          );
        }
      }
    });
  }).modules[Ampere.DEFAULT].states[Ampere.DEFAULT].views[Ampere.DEFAULT];
}
