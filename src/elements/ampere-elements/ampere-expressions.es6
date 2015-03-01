  // iife wrapper
(function() {
    let logger;
    document.addEventListener("polymer-ready", ()=>logger=Ampere.default.UI.logger('Ampere','PolymerExpressions'));

      // hasOwnMember is Object.hasOwnProperty with symbol support
    const hasOwnMember = (obj, property)=>Object.getOwnPropertySymbols(obj).concat(Object.getOwnPropertyNames(obj)).indexOf(property)!==-1;

    function findProperty(property, object, parentTraversalTypes/*=[]*/) {
        // should never happen
      if(!object) {
        return;
        //throw new Error(logger.format('findProperty(property, obj) : no obj given'));
      }

      if(!parentTraversalTypes) {
        switch(object.type) {
          case 'transition' :
            parentTraversalTypes = ['view', 'state'];
            break;
          case 'view' :
              // inspect also view state if this view is stacked (aka is a dialog)
            parentTraversalTypes = object.options[Ampere.default.UI.PARENT] ? [] : ['state'];
            break;
          case 'state' :
            parentTraversalTypes = [];
            break;
          case 'module' :
            parentTraversalTypes = ['app', 'domain'];
            break;
          case 'app' :
            parentTraversalTypes = ['module', 'domain'];
            break;
          default :
            parentTraversalTypes = ['transition', 'view', 'state', 'module', 'app', 'domain', 'Ampere'];
        }
      }

		let value;

    if(hasOwnMember(object.options || object, property)) {
      value = (object.options || object)[property];
    } else {
	    if(object.type==='transition') {
        if(property===Ampere.default.UI.CAPTION && object.name!==Ampere.default.UI.DEFAULT) {
          value=object.name;
        } else if(parentTraversalTypes.indexOf('view')!==-1) {
  				object = object.view;
        } else {
          object = {};
        }
	    }

  		if(object.type==='view') {
        if(hasOwnMember(object.options, property)) {
          value = object.options[property];
        } else if(parentTraversalTypes.indexOf('state')!=-1) {
					object = object.state;
				} else {
          object = {};
        }
			}

		  if(object.type==='state') {
	      if(hasOwnMember(object.options, property)) {
          value = object.options[property];
        } else if(parentTraversalTypes.indexOf('app')!=-1) {
          object = object.module.app;
        } else {
          object = {};
        }
  		}

      if(object.type==='app') {
        if(hasOwnMember(object.options, property)) {
          value = object.options[property];
        } else if(parentTraversalTypes.indexOf('module')!=-1) {
          object = object.view.state.module;
        } else {
          object = {};
        }
      }

			if(object.type==='module') {
				if(hasOwnMember(object.options, property)) {
          value = object.options[property];
        } else if(parentTraversalTypes.indexOf('domain')!=-1) {
          object = object.domain;
        } else {
          object = {};
        }
			}

      if(object.type==='domain') {
        if(hasOwnMember(object.options, property)) {
          value = object.options[property];
        } else if(parentTraversalTypes.indexOf('Ampere')!=-1) {
          object = object.Ampere;
        } else {
          object = {};
        }
      }

      if(object.type==='Ampere') {
        value = object.options[property];
      } else {
        object = {};
      }

      if(value===undefined) {
        object = object.options || object;
        value = object[property] || object.name;
      }
		}

		return typeof(value)==='function' ? value(object) : value;
	};

    PolymerExpressions.prototype.caption = (obj, defaultValue)=>{
      return findProperty(window.Ampere.default.UI.CAPTION, obj) || defaultValue;
    };

    PolymerExpressions.prototype.icon = (obj, defaultValue)=>{
      return findProperty(window.Ampere.default.UI.ICON, obj) || defaultValue;
    };

    PolymerExpressions.prototype.description = (obj, defaultValue)=>{
      return findProperty(window.Ampere.default.UI.DESCRIPTION, obj) || defaultValue;
    };

    PolymerExpressions.prototype.hotkey = (obj, defaultValue)=>{
      return findProperty(window.Ampere.default.UI.HOTKEY, obj) || defaultValue;
    };

    PolymerExpressions.prototype.stringify = (arg, prettyprint)=>{
      return prettyprint ? JSON.stringify(arg, null, '  ') : JSON.stringify(arg);
    };


      // required unless polymer has builtin support for iterating objects (example : repeat="{{k,v in obj}}")
    PolymerExpressions.prototype.keys = (arg)=>{
      if(arg===null || arg===undefined) {
      	return [];
      } else if(arg instanceof Array) {
        return arg;
      } else if((arg instanceof Map) || (arg instanceof WeakMap) || (arg instanceof Set)) {
        return Array.from(arg.keys());
    //  } else if( arg instanceof Iterator) {
    //    return Array.from(iterator);
      } else if( arg[Symbol.iterator]) {
        return Array.from(arg[Symbol.iterator]());
      } else if( arg instanceof Object) {
        return Object.getOwnPropertyNames(arg);
      } else {
        throw new Error( "dont know how to extract keys from " + arg);
      }
    };

    /*
    PolymerExpressions.prototype.values = function(arg) {
      if(arg instanceof Array) {
        return arg;
      } else if((arg instanceof Map) || (arg instanceof WeakMap) || (arg instanceof Set)) {
        return Array.from(arg.values());
      } else if( arg instanceof Iterator) {
        return Array.from(iterator);
      } else if( arg[Symbol.iterator]) {
        return Array.from(arg[Symbol.iterator]());
      } else if( arg instanceof Object) {
        Object.getOwnPropertyNames(arg).map(function(name) {
          return arg[name];
        });
      } else {
        throw new Error( "dont know how to extract values from " + arg);
      }
    };
    */
})();
