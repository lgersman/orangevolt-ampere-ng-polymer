function bootstrap(Ampere=window.Ampere.default) {
  let d = window.Ampere.default.domain(null, (domain, createModule)=>{
    createModule(null, (module, createState, createTransition)=>{
      module.options[domain.Ampere.UI.CAPTION] = document.title;
      module.options[domain.Ampere.UI.DESCRIPTION] = "Open the Browser console to see some informative output.";
      //module.options[domain.Ampere.UI.ICON] = 'send';
      //module.options[domain.Ampere.UI.HOMEPAGE] = 'http://web.de';

      createState(null, (state, createView, createTransition)=>{
        createView(null, function(view, createTemplate) {
          view.options[domain.Ampere.UI.DESCRIPTION] = module.options[domain.Ampere.UI.DESCRIPTION];

          view.onAction = (event, detail, target)=>target.templateInstance.model.item.action(event, detail, target);

          view.params = {
            numberValue  : 30,
            booleanValue  : false,
            secondaryProgress : 70,
            description : 'Loading ...',
            get isNumberValueValid() { return Number.isInteger(Number.parseInt(view.params.numberValue)); },
            get isSecondaryProgressValid() { return Number.isInteger(Number.parseInt(view.params.secondaryProgress)); },

            blockValue : false,

            flashText : 'Hello world !',
            errorText: 'Houston, we have a problem !'
          };

          const UNBLOCK = ()=>(view.params.blockValue=false) || module.app.ui('unblock');
          UNBLOCK[Ampere.UI.CAPTION]="module.app.ui('unblock') aka module.app.ui('block', false)";

          const ACCEPT = function Accept() { alert("You have accepted the operation."); module.app.ui('unblock'); };
          const CANCEL = function() { module.app.ui('progress'); alert("You have canceled the operation."); module.app.ui('unblock'); };
          CANCEL[Ampere.UI.ICON]="close";

          const RETRY  = function Retry() {
            alert("You want to retry the operation.");

            module.app.ui('progress', 'Retrying operation ...');
            setTimeout(()=>module.app.ui('progress') || view.actions.flash.find(action=>action.template==='action_flash_error').action(), 2000);
          };

          view.actions = {
            progress : [
              {
                template : 'action_progress_disable',
                caption  : "Disable progress using",
                syntax   : "module.app.ui('progress')",
                action   : ()=>module.app.ui('progress')
              }, {
                template : 'action_progress_boolean',
                caption  : "Switch indeterministic progress on/off",
                syntax   : "module.app.ui('progress', boolean)",
                action   : ()=>module.app.ui('progress', view.params.booleanValue)
              }, {
                template : 'action_progress_number',
                caption  : "Set progress to a fixed value (in percent)",
                syntax   : "module.app.ui('progress', [percentage])",
                action   : ()=>view.params.isNumberValueValid && module.app.ui('progress', Number.parseInt(view.params.numberValue))
              }, {
                template : 'action_progress_text',
                caption  : "Show indeterministic progress with description ",
                syntax   : "module.app.ui('progress', 'Loading assets ...')",
                action   : ()=>module.app.ui('progress', view.params.description)
              }, {
                template : 'action_progress_options',
                caption  : "Show primary and secondary progress with description",
                syntax   : "module.app.ui('progress', { value : 30, secondaryProgress : 70, description : 'Loading ...'})",
                action   : ()=>view.params.isNumberValueValid && view.params.isSecondaryProgressValid && module.app.ui('progress', {
                  value             : Number.parseInt(view.params.numberValue),
                  secondaryProgress : Number.parseInt(view.params.secondaryProgress),
                  description       : view.params.description
                })
              }
            ],
            overlay : [
              {
                template : 'action_block',
                caption  : "Block user interface",
                syntax   : "module.app.ui('block')",
                action   : ()=>module.app.ui('block') || app.ui('flash', "This notice is just for demo purposes : User interface blocked.", {actions : [UNBLOCK]})
              }, {
                template : 'action_block_boolean',
                caption  : "Conditional block/unblock user interface",
                syntax   : "module.app.ui('block', boolean)",
                action   : (event, detail, target)=>{
                  module.app.ui('block', view.params.blockValue);

                  if(view.params.blockValue) {
                    app.ui('flash', "This notice is just for demo purposes : User interface blocked.", {dismiss : false, actions : [UNBLOCK]});
                  }
                }
              }, {
                template : 'action_unblock',
                caption  : "Unblock user interface",
                syntax   : "module.app.ui('unblock')",
                action   : ()=>module.app.ui('unblock')
              }
            ],
            flash : [
              {
                caption  : "Show a flash message",
                template : 'action_flash_text',
                syntax   : "module.app.ui('flash', 'Hello world !')",
                action   : ()=>view.params.flashText && module.app.ui('flash', view.params.flashText)
              }, {
                caption  : "Hide flash",
                template : 'action_flash',
                syntax   : "module.app.ui('flash')",
                action   : ()=>module.app.ui('flash')
              }, {
                caption  : "Show flash with actions",
                template : 'action_flash_options',
                syntax   : "module.app.ui('flash', 'Houston, we need your decision.', {dismiss : false, actions : [ function accept() { ... }, function cancel() { ... }]})",
                action   : ()=>view.params.flashText && module.app.ui('flash', view.params.flashText, {dismiss : false, actions : [ACCEPT, CANCEL]})
              }, {
                caption  : "Show flash with error",
                template : 'action_flash_error',
                syntax   : "module.app.ui('flash', 'An error occured', {dismiss : false, error : new Error('Houston, we have a problem !'), actions : [ function retry() { ... }, function cancel() { ... }]})",
                action   : ()=>{
                  if(view.params.flashText && view.params.errorText) {
                    let error = new Error(view.params.errorText);
                    //error[Ampere.UI.CAPTION]="Something unexpected happended :-(";
                    //error[Ampere.UI.DESCRIPTION]="That's the problem description";

                    module.app.ui('block');
                  module.app.ui('flash', view.params.flashText, {dismiss : false, error : error, actions : [RETRY, CANCEL]});
                  }
                }
              }
            ]
          };

          createTemplate(document.querySelector('#view'));
        });




      });
    });
  });

  return d.modules[Ampere.DEFAULT].states[Ampere.DEFAULT].views[Ampere.DEFAULT];
}
