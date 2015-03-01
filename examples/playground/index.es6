function bootstrap(Ampere=window.Ampere.default) {
  let d = window.Ampere.default.domain(null, function(domain, createModule) {
    createModule(null, function(module, createState, createTransition) {
      module.options[Ampere.UI.CAPTION] = document.title;
      module.options[Ampere.UI.ICON] = 'send';
      //module.options[Ampere.UI.HOMEPAGE] = 'http://web.de';

      var mystate = createState('mystate', function(state, createView, createTransition) {
        state.options[Ampere.UI.ICON] = 'refresh';
        state.foo = 'bar';

        var view = createView(null, function(view, createTemplate) {
          view.log("view created");

          view.promise.then(function(result) {
            view.log("fertig : " + result);
          });
          view.options[Ampere.UI.DESCRIPTION]="hilfe!!";
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
          transition.options[Ampere.UI.SCOPE] = 'local';
          
        }, view1);

        createTransition('b', function(transition) {
          transition.options[Ampere.UI.SCOPE] = 'global';
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
          transition.options[Ampere.UI.SCOPE] = 'global';
          transition.options[Ampere.UI.ICON] = '';
          transition.options[Ampere.UI.DESCRIPTION] = 'Sowas aber auch';
          transition.transaction = function(transition) {
          };
        });

        createTransition('undoable', function(transition) {
          transition.options[Ampere.UI.SCOPE] = 'local';
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
        transition.options[Ampere.UI.SCOPE] = 'global';
        transition.options[Ampere.UI.ICON] = 'settings';
      }, mystate);
      createTransition( 'zwo', function(transition) {
        transition.options[Ampere.UI.SCOPE] = 'global';
        transition.options[Ampere.UI.ICON] = 'menu';
        transition.options[Ampere.UI.CAPTION] = '';
      }, mystate);
      createTransition( 'drei', function(transition) {
        transition.options[Ampere.UI.SCOPE] = 'global';
      }, mystate);
      createTransition( 'throwexbefore', function(transition) {
        transition.options[Ampere.UI.SCOPE] = 'global';
        transition.options[Ampere.UI.ICON] = '';
        transition.transaction = function(transition) {
          throw new Error("hier ging was schief");
        };
      }, mystate);
      createTransition( 'fünf', function(transition) {
        transition.options[Ampere.UI.SCOPE] = 'local';
        transition.options[Ampere.UI.ICON] = '';
      }, mystate);
    });
  });

  return d.modules[Ampere.DEFAULT].states['mystate'].views[Ampere.DEFAULT];
}
