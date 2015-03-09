(function() {
  function transitions(state, scope, /*array*/path=[]) {
    if(state) {
      path.unshift(scope);

      if(!(state && state.type==='state')) {
        throw new Error( logger.prefix('transitions(state, scope, filter) : first argument expected to be a ampere state'));
      }

      let o = { /*
        local : {
          primary : {
            ''    : [],
            group1  : []
          },
          secondary  : {
            ...
          },
          ...
        },
        global : {
          ...
        },
        ...
      */};

        // fetch module and state transitions
      const transitions = Object.keys(state.module.transitions).map(name=>state.module.transitions[name])
        .concat(Object.keys(state.transitions).map(name=>state.transitions[name]))
      ;

        // insert transition into structure
      for(let transition of transitions) {
        const SCOPE = transition.options[Ampere.default.UI.SCOPE] || Ampere.default.DEFAULT,
          SCOPE_PRIORITY = transition.options[Ampere.default.UI.SCOPE_PRIORITY] || 'primary',
          SCOPE_GROUP = transition.options[Ampere.default.UI.SCOPE_GROUP] || Ampere.default.DEFAULT
        ;
          // ensure scope, scope[priority] and scope[priority][group] exist
        o[SCOPE] || (o[SCOPE]={});
        o[SCOPE][SCOPE_PRIORITY] || (o[SCOPE][SCOPE_PRIORITY]={});
        o[SCOPE][SCOPE_PRIORITY][SCOPE_GROUP] || (o[SCOPE][SCOPE_PRIORITY][SCOPE_GROUP]=[]);

        o[SCOPE][SCOPE_PRIORITY][SCOPE_GROUP].push(transition);
      }

      o = path.reduce((item, part)=>item && item[part], o);

      return o;
    }
  }

  const init = ()=>Ampere.default.UI.transitions = transitions;

  ((document.readyState=="complete" || document.readyState==="loaded") && init()) || document.addEventListener("DOMContentLoaded", init);
})()
