function bootstrap(Ampere=window.Ampere.default, UI=Ampere.UI) {
  return Ampere.domain(null, (domain, createModule)=>{
    createModule(null, (module, createState, createTransition)=>{
      module.options[Ampere.UI.CAPTION] = document.title;

      //let bitch;
      //createState('kinky', (state, createView, createTransition)=>bitch=createView('bitch', (view, createTemplate)=>{}));

      createState(null, (state, createView, createTransition)=>{
        let main           = createView('main', (view, createTemplate)=>{
          createTemplate(document.querySelector('#main'));

          view.options[Ampere.UI.DESCRIPTION] = document.querySelector('meta[name="description"]').content;
        }),
        first_dialog  = createView('first-dialog', (view, createTemplate, options=view.options)=>{
          // createTemplate(document.querySelector('#first-dialog'));
          options[UI.CAPTION]     = view.name;
          options[UI.DESCRIPTION] = 'This is the description of the first dialog';
            // declare view "main" as parent view of view "first_dialog"
          options[UI.PARENT]      = main;
        }),
        second_dialog = createView('second-dialog',(view, createTemplate, options=view.options)=>{
          createTemplate(document.querySelector('#second-dialog'));

          options[UI.CAPTION]    = view.name;
          options[UI.DESCRIPTION]= 'Description of second dialog';
          options[UI.ICON]       = 'info-outline';
            // declare view "first_dialog" as parent view of view "first_dialog"
          options[UI.PARENT] = first_dialog;
        }),
        confirm = createView('confirm',(view, createTemplate, options=view.options)=>{
          createTemplate(document.querySelector('#confirm'));

          options[UI.CAPTION]    = 'Confirmation';
          options[UI.ICON]       = 'report';
            // declare view "main" as parent view of view "confirm"
          options[UI.PARENT]     = main;
        }),
        input  = createView('input',(view, createTemplate, options=view.options)=>{
          createTemplate(document.querySelector('#input'));

          options[UI.CAPTION]    = 'Enter some input';
          options[UI.DESCRIPTION]= 'This is just a dialog to input something.',
          options[UI.ICON]       = 'create';
            // declare view "main" as parent view of view "input"
          options[UI.PARENT]     = main;
        })
        ;

        createTransition('first-dialog', (transition, options=transition.options)=>{
          //transition.options[Ampere.UI.SCOPE] = 'global';
          options[UI.CAPTION]        = 'Open first dialog (or press F1)';
          options[UI.HOTKEY]         = 'f1';
          options[UI.DESCRIPTION]    = null;
        }, first_dialog);

        createTransition('first-dialog-close', (transition, options=transition.options)=>{
          options[UI.SCOPE]          = first_dialog.name;
          options[UI.SCOPE_PRIORITY] = 'secondary';
          options[UI.CAPTION]        = 'Close';
          options[UI.HOTKEY]         = 'esc';
          options[UI.DESCRIPTION]    = null;
        }, main);

        createTransition('second-dialog', (transition, options=transition.options)=>{
          options[UI.SCOPE]          = first_dialog.name;
          //options[UI.ICON]         = ''; // overwrite view icon with no icon
          options[UI.CAPTION]        = 'Open second dialog over first dialog';
          options[UI.DESCRIPTION]    = null;
        }, second_dialog);

        createTransition('second-dialog-close', (transition, options=transition.options)=>{
          options[UI.SCOPE]          = second_dialog.name;
          options[UI.SCOPE_PRIORITY] = 'secondary';
          options[UI.CAPTION]        = 'Close';
          //options[UI.HOTKEY]         = 'esc';
          options[UI.DESCRIPTION]    = null;
        }, first_dialog);

        createTransition('confirm', (transition, options=transition.options)=>{
          options[UI.ICON]           = null;
          options[UI.DESCRIPTION]    = "Das ist die Beschreibung";
          options[UI.HOTKEY]         = 'f2';
        }, confirm);

        createTransition('confirm-ok', (transition, options=transition.options)=>{
          options[UI.SCOPE]          = confirm.name;
          options[UI.CAPTION]        = 'Ok';
          options[UI.HOTKEY]         = 'enter';
          options[UI.DESCRIPTION]    = null;

          transition.transaction=()=>
            /*redo*/()=>module.app.ui('flash', "You've confirmed the dialog.");
        }, main);

        createTransition('confirm-close', (transition, options=transition.options)=>{
          options[UI.SCOPE]          = confirm.name;
          options[UI.SCOPE_PRIORITY] = 'secondary';
          options[UI.CAPTION]        = 'Close';
          options[UI.HOTKEY]         = 'esc';
          options[UI.DESCRIPTION]    = null;

          transition.transaction=()=>
            /*redo*/()=>module.app.ui('flash', "You've canceled confirmation.");
        }, main);

        createTransition('input', (transition, options=transition.options)=>{
          options[UI.ICON]          = null;
          options[UI.DESCRIPTION]   = null;
          options[UI.HOTKEY]        = 'f3';
        }, input);

        createTransition('input-ok', (transition, options=transition.options)=>{
          options[UI.SCOPE]         = input.name;
          options[UI.CAPTION]       = 'Ok';
          options[UI.HOTKEY]        = 'enter';
          options[UI.DESCRIPTION]   = null;

            // disable transition if current view!==input view or myvalue is not consist of 2 words
          transition.disabled=()=>app.view!==input || !/\w+\s+\w+/.test(app.view.myvalue);

          transition.transaction=()=>
            /*redo*/()=>module.app.ui('flash', "You've entered '${app.view.myvalue}'.");
        }, main);

        createTransition('input-close', (transition, options=transition.options)=>{
          options[UI.SCOPE]         = input.name;
          options[UI.SCOPE_PRIORITY]= 'secondary';
          options[UI.CAPTION]       = 'Close';
          options[UI.HOTKEY]        = 'esc';
          options[UI.DESCRIPTION]   = null;

          transition.transaction=()=>
            /*redo*/()=>(app.view.myvalue='') || module.app.ui('flash', "You've canceled the input dialog.");
        }, main);
      });
    });
  }).modules[Ampere.DEFAULT].states[Ampere.DEFAULT].views.main;
}
