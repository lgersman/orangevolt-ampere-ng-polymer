function bootstrap(Ampere=window.Ampere.default) {
  return Ampere.domain(null, (domain, createModule)=>{
    createModule(null, (module, createState)=>{
      module.options[Ampere.UI.CAPTION] = document.title;

      createState(null, (state, createView)=>
        createView(null, (view, createTemplate)=>
          new Promise(resolve=>
              // we need to wait until the dom is ready before accessing the dom
            document.addEventListener('DOMContentLoaded', ()=>
              createTemplate(document.querySelector('#view')) && resolve()
            )
          )
        )
      )
    });
  }).modules[Ampere.DEFAULT].states[Ampere.DEFAULT].views[Ampere.DEFAULT];
}
