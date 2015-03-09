"use strict";
/**
   wraps an ampere-app including its splash screen
*/
  // iife wrapper
(function() {
  const ORIGINAL_LENGTH = Symbol('ORIGINAL_LENGTH');

  let logger;
  document.addEventListener("polymer-ready", ()=>logger=Ampere.default.UI.logger(`<ampere-splash>`));

  Polymer({
    attached() {
        // memoize original item count
      this[ORIGINAL_LENGTH] = this.shadowRoot.childNodes.length;

        // this is actually over engineered because there can only be one template for the splash
      [...this.querySelectorAll("template")].forEach(template=>{
        !template.bindingDelegate && (template.bindingDelegate = this.element.syntax);
        this.shadowRoot.appendChild(template.createInstance(this));
      });
    },
    appChanged(oldApp, app) {
      if(app) {
        logger.assert(!oldApp, "app is already set and can only set once");

          // track promise state of the app
        app.promise.then(
          value=>this.async(()=>{
            this.state = 'fullfilled';

              // cleanup dynamically imported template nodes
            while(this.shadowRoot.childNodes.length>this[ORIGINAL_LENGTH]) {
              this.shadowRoot.removeChild(this.shadowRoot.lastChild);
            }
          }),
          ex=>this.async(()=>{
            this.state = 'rejected';
            this.error = ex;
          })
        );
      }
    },
    state : 'pending'
  });
})();
