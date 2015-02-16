PolymerExpressions.prototype.transitions = (app, scope)=>{
  const transitions = [];

  Object.keys(app.view.state.module.transitions).forEach(name=>{
    var transition=app.view.state.module.transitions[name],
        type      =transition.options[Ampere.default.UI.SCOPE]
    ;

    (type===scope) && transitions.push(transition);
  });

  Object.keys(app.view.state.transitions).forEach(name=>{
    var transition=app.view.state.transitions[name],
        type      =transition.options[Ampere.default.UI.SCOPE]
    ;

    (type===scope) && transitions.push(transition);
  });

  //console.log( "transitions[" + scope + "]=", transitions);
  return transitions;
};

PolymerExpressions.prototype.caption = (obj, defaultValue)=>{
  obj = obj || {};
  let s = (obj.options || obj)[window.Ampere.default.UI.CAPTION];
  (typeof(s)==='function') && (s=s(obj));
  (s===undefined) && (s=obj.name);

  return s || defaultValue;
};

PolymerExpressions.prototype.icon = (obj, defaultValue)=>{
  obj = obj || {};
  let s = (obj.options || obj)[window.Ampere.default.UI.ICON] || '';
  (typeof(s)==='function') && (s=s(obj));

  return s || defaultValue;
};

PolymerExpressions.prototype.description = (obj, defaultValue)=>{
  obj = obj || {};
  var s = (obj.options || obj)[window.Ampere.default.UI.DESCRIPTION] || '';
  (typeof(s)==='function') && (s=s(obj));

  return s || defaultValue;
};

PolymerExpressions.prototype.stringify = (arg, prettyprint)=>{
  return prettyprint ? JSON.stringify(arg, null, '  ') : JSON.stringify(arg);
};

  // required unless polymer has builtin support for iterating objects (example : repeat="{{k,v in obj}}")
PolymerExpressions.prototype.keys = (arg)=>{
  if(arg instanceof Array) {
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
