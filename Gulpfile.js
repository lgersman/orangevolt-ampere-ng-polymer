  /*
  * gulp bootstrap file
  */

require('./orangevolt-ampere-ng/node_modules/traceur').require.makeDefault(
  function(filename) {
      // only transpile es6 files
    return filename.endsWith('es6');
  }, {
    experimental       : true,
    arrayComprehension : true//,    // bug in traceur 0.0.72, must be explicitly set to true (its experimental, si it should be on by default)
    //types              : true,
    //typeAssertions     : true,
    //typeAssertionModule: 'rtts-assert',
    //annotations        : true,
  }
);

require('./tasks.es6');
