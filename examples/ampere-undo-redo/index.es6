function bootstrap(Ampere=window.Ampere.default, UI=Ampere.UI) {
  return Ampere.domain(null, (domain, createModule)=>{
    createModule(null, (module, createState, createTransition, options=module.options)=>{
      options[UI.CAPTION]     = document.title;
      options[UI.DESCRIPTION] = "Tap toolbar actions to see something happen !";
      options[UI.ICON]        = "stars";

      createState(null, (state, createView, createTransition)=>{
        state.options[UI.DESCRIPTION] = module.options[UI.DESCRIPTION];
        state.value                   = 0;

        createView(null, (view, createTemplate)=>createTemplate(document.querySelector('#view')));

        createTransition('Inc 1 Undoable', (transition, options=transition.options)=>{
          options[UI.SCOPE]       = 'global';
          options[UI.SCOPE_GROUP] = 'actions';
            // hint : values can be functions
          options[UI.DESCRIPTION] = t=>`Increment 1 (Hotkey : ${t.options[UI.HOTKEY]})`;
            // hotkeys can be space separated a11y keys
          options[UI.HOTKEY]      = 'pageup';
          options[UI.ICON]        = 'done';

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

        createTransition('Inc 10 Undoable', (transition, options=transition.options)=>{
          options[UI.SCOPE]       = 'global';
          options[UI.SCOPE_GROUP] = 'actions';
          options[UI.ICON]        = 'done-all';

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

        createTransition('Inc 5 w/o Undo', (transition, options=transition.options)=>{
          options[UI.SCOPE] = 'global';
            // let this transition appear in a separate transition group
          options[UI.SCOPE_GROUP] = 'group1';

          transition.transaction=()=>
            ()=>{
              state.value+=5;
              transition.log(`redo : state.value=${state.value}`);
            }
          ;
        });


        createTransition('undo', (transition, options=transition.options)=>{
          options[UI.SCOPE]          = 'global';
          options[UI.SCOPE_PRIORITY] = 'secondary';
          options[UI.HOTKEY]         = 'ctrl+z';

          transition.disabled = ()=>
            !module.app.history.canUndo
          ;
            // CAVEAT : ()=>!module.app.history.undo() means "return result of undo()" which
            // would be interpreted as this transitions redo function. We use the
            // negotiation operator to suppress undo() return value to be assigend as transition redo operation
          transition.transaction = ()=>
            !module.app.history.undo()
          ;
        });

        createTransition('redo', (transition, options=transition.options)=>{
          options[UI.SCOPE]          = 'global';
          options[UI.SCOPE_PRIORITY] = 'secondary';
          options[UI.HOTKEY]         = 'ctrl+y';

          transition.disabled = ()=>
            !module.app.history.canRedo
          ;
            // CAVEAT : ()=>!module.app.history.redo() means "return result of redo()" which
            // would be interpreted as this transitions redo function. We use the
            // negotiation operator to suppress redo() return value to be assigend as transition redo operation
          transition.transaction = ()=>
            !module.app.history.redo()
          ;
        });

        createTransition('reset', (transition, options=transition.options)=>{
          options[UI.SCOPE]          = 'global';
            // make reset appaear in a different group (i.e. spearated)
          options[UI.SCOPE_GROUP]    = 'group1';
          options[UI.SCOPE_PRIORITY] = 'secondary';

          transition.disabled = ()=>
            !module.app.history.canReset
          ;
            // CAVEAT : ()=>!module.app.history.reset() means "return result of reset()" which
            // would be interpreted as this transitions redo function. We use the
            // negotiation operator to suppress reset() return value to be assigend as transition redo operation
          transition.transaction = ()=>
            !module.app.history.reset()
          ;
        });
      });
    });
  }).modules[Ampere.DEFAULT].states[Ampere.DEFAULT].views[Ampere.DEFAULT];
}
