module.exports = {
	description					: `How to bootstrap ampere-app without ampere-splash element`,
	element							: `
		<template>
			<ampere-app fit app={{app}}></ampere-app>
		</template>
	`,
	templates : [
		`
		<template id="view">
			<div fit style="display: flex; height:100%; justify-content: center;align-items: center">
				<template if="{{view.state.module.app.promise.message}}">
					App is loading : {{view.state.module.app.promise.message}} ...
				</template>
				<template if="{{!view.state.module.app.promise.message}}">
					App is ready to use !!
				</template>
			</div>
		</template>
		`
	],
	bootstrap : `
		<script>
			var	app = window.Ampere.default.app(bootstrap(), function(app) {
				var delay =	function(message) {
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
				});
			});
			document.addEventListener('polymer-ready',function() {
				var template = document.body.querySelector('template');

				template.bindingDelegate = new PolymerExpressions();
				document.body.appendChild(template.createInstance({app : app}));
			});
		</script>
	`
};
