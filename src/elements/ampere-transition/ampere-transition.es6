  // iife wrapper
(function() {
  let logger;
  document.addEventListener("polymer-ready", ()=>logger=Ampere.default.UI.logger(`<ampere-transition>`));

    // poll disabled state of transitions
  function updateDisabled() {
    for(let element of updateDisabled.transitionElements) {
      element.transition && element.unpromisify(element.transition, 'disabled');
    }
  }
  updateDisabled.transitionElements = new Set();

  setInterval(updateDisabled, 200);

  Polymer({
    attached() {
      let template = this.querySelector("template");
      if(template) {
        !template.bindingDelegate && (template.bindingDelegate = this.element.syntax);
        this.shadowRoot.appendChild(template.createInstance(this));
      }
      this.logger = Ampere.default.UI.logger('<ampere-transition>', this.transition.toString());
      //this.unpromisify(this.transition, "disabled");

      updateDisabled.transitionElements.add(this);
    },
    detached() {
      updateDisabled.transitionElements.delete(this);
    },
    transitionChanged(old, transition) {
      if(!transition || !transition.type==='transition') {
        throw new Error(logger.prefix(`transition attribute(=${transition}) expected to be a ampere transition instance`));
      }
    },
    appearance : 'paper-button',
    disabled   : true,
      /**
      * unpromisify will convert a promise into a object property
      *
      * obj the model to get a promise from
      * objPropertyName the name of the model property returning the promise
      * elementPropertyName (optional) the elements property to set
      * reset (optional) the value to set the elements property to until the promise is resolved
      */
    unpromisify(obj, objPropertyName, elementPropertyName, reset) {
      !elementPropertyName && (elementPropertyName=objPropertyName);

      /*
      if(arguments.length===4) {
        this[elementPropertyName]=reset;
        this.logger.log(`unpromisify() : reset this['${elementPropertyName}'] to ${reset}`);
      }
      */
      obj[objPropertyName].then(
        val=>{
          //this.logger.log(`unpromisify() : set this['${elementPropertyName}'] from ${this[elementPropertyName]} to ${!!val}`);
          this[elementPropertyName] = !!val;
        },
        ex=>{
          this.logger.error(`unpromisify(...) : Failed to evaluate property '${elementPropertyName}' : ${ex.message}`);
        }
      );
    },
    execute(event) {
      if(!this.disabled) {
          // if current view is stacked and hotkey was activated :
          // evaluate if this transition is member of the top most view otherwise cancel execution
        if(event.type==="keys-pressed" && this.transition.state.module.app.view.options[Ampere.default.UI.PARENT]) {
          /*
          if(!this.view)  {
              // find top most parent node
            for(var parentNode=this.parentNode; parentNode.parentNode; parentNode=parentNode.parentNode);

            this.view = parentNode.host.view;
          }
          */

          if(this.host) {
              // abort transition execution if current top most view is not same as the view this transition was rendered into
            if(this.host.view!==this.transition.state.module.app.view) {
              return;
            }
          } else {
            Ampere.default.UI.logger(`<ampere-transition>`, this.transition.toString()).warn('transition hotkey event : unable to check if transition view is top most : "host" attribute not defined - set "host" attribute manually to fix this issue');
          }
        }

        this.transition.state.module.app.execute(this.transition, event);
      }
    }
  });
})();
