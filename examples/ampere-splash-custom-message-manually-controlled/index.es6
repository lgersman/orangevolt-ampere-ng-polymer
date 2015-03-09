function bootstrap(Ampere=window.Ampere.default) {
  return Ampere.domain(null, (domain, createModule)=>{
    createModule(null, (module, createState)=>{
      module.options[Ampere.UI.CAPTION] = document.title;

      createState(null, (state, createView)=>createView(null, (view)=>{}));
    });
  }).modules[Ampere.DEFAULT].states[Ampere.DEFAULT].views[Ampere.DEFAULT];
}
