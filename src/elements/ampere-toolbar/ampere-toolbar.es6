  // iife wrapper
(function() {
  let logger;
  document.addEventListener("polymer-ready", ()=>logger=Ampere.default.UI.logger(`<ampere-toolbar>`));

  Polymer({
    attached() {
      var template = this.querySelector("template");
      if(template) {
        !template.bindingDelegate && (template.bindingDelegate = this.element.syntax);
        this.shadowRoot.appendChild(template.createInstance(this));
      }
    },
    containsTransitions() {
      const transitions = this.transitions() || {};

      let val = Object.keys(transitions).reduce((count, priority)=>{
        return count + Object.keys(transitions[priority]).length;
      }, 0);

      return val;
    },
    transitions(...path) {
      return this.app && Ampere.default.UI.transitions(this.app.view.state, this.scope, path);
    }
  });
})();
