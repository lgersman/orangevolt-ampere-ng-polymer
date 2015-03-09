module.exports = {
  tags                 : ['splash'],
  caption              : 'Use <ampere-app> directly with custom splash',
  description          : `How to bootstrap ampere-app without ampere-splash element`,
  element              : `
    <template>
      <template if="{{app.promise.message}}">
        <div style="display: flex; height:100%; justify-content: center;align-items: center">
          App is loading : {{app.promise.message}} ...
        </div>
      </template>
      <template if="{{!app.promise.message}}">
        <ampere-app fit app={{app}}></ampere-app>
      </template>
    </template>
  `,
  bootstrap             : `
    <script>
      var app = window.Ampere.default.app(bootstrap(), function(app) {
        var delay = function(message) {
          return new Promise(function(resolve) {
            app.promise.message = message;
            setTimeout(resolve, 1000);
          })
        };

        return delay("ready in 4 seconds")
          .then(function(){ return delay("ready in 3 seconds");})
          .then(function(){ return delay("ready in 2 seconds");})
          .then(function(){ return delay("ready in 1 seconds");})
          .then(function(){
            delete app.promise.message;
          })
        ;
      });
      document.addEventListener('polymer-ready',function() {
        var template = document.body.querySelector('template');

        template.bindingDelegate = new PolymerExpressions();
        document.body.appendChild(template.createInstance({app : app}));
      });
    </script>
  `
};
