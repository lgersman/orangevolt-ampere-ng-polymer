function bootstrap(Ampere=window.Ampere.default, UI=Ampere.UI) {
  let d = window.Ampere.default.domain(null, function(domain, createModule) {
    createModule(null, function(module, createState, createTransition, options=module.options) {
      options[UI.CAPTION] = document.title;
      options[UI.ICON] = 'send';
      //options[UI.HOMEPAGE] = 'http://web.de';

      var mystate = createState('mystate', function(state, createView, createTransition) {
        state.options[UI.ICON] = 'refresh';
        state.foo = 'bar';

        var view = createView(null, function(view, createTemplate) {
          view.log("view created");

          view.promise.then(function(result) {
            view.log("fertig : " + result);
          });
          view.options[UI.DESCRIPTION]="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
            // TODO : view template laden
          //createTemplate(document.querySelector('#mystate_view'));

          return new Promise(function(resolve,reject) {
            setTimeout(function() {
              resolve("supi!");
            }, 300);
          });
        });

        var view1 = createView('view1', function(view, createTemplate) {
          createTemplate(document.querySelector('#mystate_view1'));
        });

        createTransition('a', function(transition) {
          transition.options[UI.SCOPE] = 'local';

        }, view1);

        createTransition('b', function(transition) {
          transition.options[UI.SCOPE] = 'global';
          transition.transaction = function(transition) {
          };
          transition.disabled = function() {
            return new Promise(function(resolve,reject) {
              setTimeout(function() {
                // console.warn("i was called");
                resolve();
              }, 3000)
            });
          }
        });

        createTransition('c', function(transition) {
          transition.options[UI.SCOPE] = 'global';
          transition.options[UI.ICON] = '';
          transition.options[UI.DESCRIPTION] = 'Sowas aber auch';
          transition.transaction = function(transition) {
          };
        });

        createTransition('undoable', function(transition) {
          transition.options[UI.SCOPE] = 'local';
          transition.transaction = function(transition) {
            transition.log("transaction() called");

            var undo = function() {
              transition.log("undo() called");
              return redo;
            };

            var redo = function() {
              transition.log("redo() called");
              return undo;
            };

            return redo;
          };
        }, view1);

        createTransition('e', function(transition) {
          transition.transaction = function(transition) {
          };
        }, view);
      });

      createTransition( 'eins', function(transition) {
        transition.options[UI.SCOPE] = 'global';
        transition.options[UI.ICON] = 'settings';
      }, mystate);
      createTransition( 'zwo', function(transition) {
        transition.options[UI.SCOPE] = 'global';
        transition.options[UI.ICON] = 'menu';
        transition.options[UI.CAPTION] = '';
      }, mystate);
      createTransition( 'drei', function(transition) {
        transition.options[UI.SCOPE] = 'global';
      }, mystate);
      createTransition( 'throwexbefore', function(transition) {
        transition.options[UI.SCOPE] = 'global';
        transition.options[UI.ICON] = '';
        transition.transaction = function(transition) {
          throw new Error("hier ging was schief");
        };
      }, mystate);
      createTransition( 'fünf', function(transition) {
        transition.options[UI.SCOPE] = 'local';
        transition.options[UI.ICON] = '';
      }, mystate);
    });
  });

  return d.modules[Ampere.DEFAULT].states['mystate'].views[Ampere.DEFAULT];
}
