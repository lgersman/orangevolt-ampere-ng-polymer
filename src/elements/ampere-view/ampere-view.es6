  // iife wrapper
(function() {
  const TEMPLATE_INSTANCE = Symbol('TEMPLATE_INSTANCE');
  const OBSERVABLE = Symbol('OBSERVABLE');

  let logger;
  document.addEventListener("polymer-ready", ()=>logger=Ampere.default.UI.logger(`<ampere-view>`));

  /*
  function makeSyntax() {
    let events = Object.create(Polymer.api.declaration.events);
    //events.findController = function() { return ampereView; };

    let syntax = new PolymerExpressions(),
        prepareBinding = syntax.prepareBinding
    ;
    syntax.prepareBinding = function(pathString, name, node) {
      return events.prepareEventBinding(pathString, name, node) ||
        prepareBinding.call(syntax, pathString, name, node);
    };
    return syntax;
  }
  */

  function attach(element) {
    Object.observe(element.view.state.module.app, element.onAppViewChanged);

      // call view.attached(templateInstance) if exists
    if(element[TEMPLATE_INSTANCE] && typeof(element.view.attached)==='function') {
      Ampere.default.UI.logger(`<${element.nodeName.toLowerCase()}>`, element.view.toString()).log('calling detected view method attached(<ampere-view>,templateInstance)');
      element.view.attached(element[TEMPLATE_INSTANCE]);
    }
  }

  function detach(element) {
    element.onAppViewChanged && Object.unobserve(element.view.state.module.app, element.onAppViewChanged);
    element.onAppViewChanged = undefined;

      // call view.detached(<ampere-view>,templateInstance) if exists
    if(element[TEMPLATE_INSTANCE] && typeof(element.view.detached)==='function') {
      Ampere.default.UI.logger(`<${element.nodeName.toLowerCase()}>`, element.view.toString()).log('calling detected view method detached(<ampere-view>,templateInstance)');
      element.view.detached(element[TEMPLATE_INSTANCE]);
    }
  }

  Polymer({
    created() {
      //WebComponents.flags.log.events=true

        // bind Polymer dispatchMethod to this.view to
        // allow binding of on-* events to the view
      let dispatchMethod = this.dispatchMethod;

      this.dispatchMethod = (obj, method, args)=>{
        return dispatchMethod.call(this, typeof(this.view[method])==='function' ? this.view  : this, method, args);
      };
    }/*,
    attached() {
      attach(this)
    },
    detached() {
      detach(this);
    }*/,
    toggleDescription() {
      this.shadowRoot.querySelector("#description").toggle();
    },
    toggleHotkeyMap(event) {
      let hotkeymap = this.shadowRoot.querySelector("#hotkeymap");

      if(hotkeymap.hasAttribute('hidden')) {
        hotkeymap.removeAttribute('hidden');
      } else {
        hotkeymap.setAttribute('hidden', '');
      }

      event && event.stopPropagation();
    },
      // hosts transitions of this view
    transitions : [],
      // filter for getting transitions of this view having hotkeys
    hotkeys(transitions, property) {
      const transitionsWithHotkeys = transitions.filter(transition=>transition.options[Ampere.default.UI.HOTKEY]);
      return !property ? transitionsWithHotkeys : transitionsWithHotkeys[property];
    },
    domReady() {
      let oldTransitions = this.transitions;

        // collect all transitions of this view into this.transitionElements
      this.transitions = this.shadowRoot.querySelectorAll("ampere-transition").array();

        // add module transitions if this view is not stacked
      if(this.host.views.length===1) {
        Object.keys(this.view.state.module.transitions).forEach(name=>this.transitions.push(this.view.state.module.transitions[name]));
      }

        // assign transition.viewElement to this
      this.transitions = this.transitions.map(transitionElement=>(transitionElement.host=this) && transitionElement.transition);

      Ampere.default.UI.logger(`<${this.nodeName.toLowerCase()}>`, this.view.toString()).log(
        `this.transitions=${JSON.stringify(this.transitions.map(t=>t.name))}`
      );

        // add state global transitions
      let transitionsPerScope = Ampere.default.UI.transitions(this.view.state, 'global') || {};
      Object.keys(transitionsPerScope).forEach(priority=>
        Object.keys(transitionsPerScope[priority]).forEach(group=>this.transitions.push(...transitionsPerScope[priority][group]))
      );

        // add state local transitions
      transitionsPerScope = Ampere.default.UI.transitions(this.view.state, 'local') || {};
      Object.keys(transitionsPerScope).forEach(priority=>
        Object.keys(transitionsPerScope[priority]).forEach(group=>this.transitions.push(...transitionsPerScope[priority][group]))
      );

      /*
      const notifier = Object.getNotifier && Object.getNotifier(this);
      notifier && notifier.notify({
        type: 'update',
        name: 'transitions',
        oldValue: oldTransitions
      });
      */
    },
    viewChanged(o, view) {
      Ampere.default.UI.logger(`<${this.nodeName.toLowerCase()}>`).log(`view changed : view:${view}`);

      while(this.$.content.firstChild) {
        this.$.content.removeChild(this.$.content.firstChild);
      }

      detach(this);

      let template = view.template || this.$.default;
        // set bindingDelegate on template
      !template.bindingDelegate && (template.bindingDelegate = this.element.syntax);

        // append header
      this.$.content.appendChild(this.$.header.createInstance(this));

        // append template
      this.$.content.appendChild(this[TEMPLATE_INSTANCE]=template.createInstance(view/*, makeSyntax()*/));

      // http://stackoverflow.com/questions/26683274/polymer-js-attach-handler-to-paper-button-in-standard-html-dom
      // http://stackoverflow.com/questions/28104808/polymer-function-call-with-parameters
      // http://stackoverflow.com/questions/28210278/polymer-event-parameters-on-repeat/28211187

      this.onAppViewChanged = changes=>{
        changes.forEach(change=>{
          if(change.name==='view') {
            let hotkeymap = this.shadowRoot.querySelector("#hotkeymap");

            if(!hotkeymap.hasAttribute('hidden')) {
              this.toggleHotkeyMap(event);
            }
          }
        });
      };

      attach(this);

      /*
        // backup template style
      let styleElement=this.shadowRoot.querySelector("style");
        // make shadow root empty
      while(this.shadowRoot.firstChild) {
        this.shadowRoot.removeChild(this.shadowRoot.firstChild);
      }
      styleElement && this.shadowRoot.appendChild(styleElement);

      detach(this);

      let template = view.template || this.$.default;
        // set bindingDelegate on template
      !template.bindingDelegate && (template.bindingDelegate = this.element.syntax);

        // append template
      this.shadowRoot.appendChild(this[TEMPLATE_INSTANCE]=template.createInstance(view, makeSyntax()));

      // http://stackoverflow.com/questions/26683274/polymer-js-attach-handler-to-paper-button-in-standard-html-dom
      // http://stackoverflow.com/questions/28104808/polymer-function-call-with-parameters
      // http://stackoverflow.com/questions/28210278/polymer-event-parameters-on-repeat/28211187

      attach(this);
      */
    },
    get viewIcon() {
      return PolymerExpressions.prototype.icon(this.view);
    },
    get viewCaption() {
      return PolymerExpressions.prototype.caption(this.view);
    },
    get viewDescription() {
      return PolymerExpressions.prototype.description(this.view);
    }
  });
})();
