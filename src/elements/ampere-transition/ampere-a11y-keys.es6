// iife wrapper
(function() {
  //let logger;
  //document.addEventListener("polymer-ready", ()=>logger=Ampere.default.UI.logger(`<ampere-a11y-keys>`));

    // key for keeping
  const REGISTERED_HOTKEY_TRANSITIONS = Symbol('REGISTERED_HOTKEY_TRANSITIONS');

  const listen = (node, handler) => {
    if(document && document.addEventListener) {
        document.addEventListener('keydown', handler);
      }
    },
    unlisten = (node, handler) => {
      if(document && document.removeEventListener) {
        document.removeEventListener('keydown', handler);
      }
    }
  ;

  Polymer({
      // override core-a11y-keys attached()
    attached() {
      
    },
      // override core-a11y-keys detached()
    detached() {
      unlisten(this.target, this._keyHandler);
    },
    targetChanged(oldTarget) {
      unlisten(oldTarget, this._keyHandler);
      listen(this.target, this._keyHandler);
    }
  });
})();
