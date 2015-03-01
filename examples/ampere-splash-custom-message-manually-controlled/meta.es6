module.exports = {
	tags 								: ['splash', 'injectBoundHTML'],
	caption 						: 'Use <ampere-splash> with manually injected splash template',
	description					: `How to customize and manually control the splash message`,
	bootstrap 						: `
		<template id="final-splash">
			<section style="white-space: initial">
				<paper-button raised role="button" tabindex="-1" on-tap="{{resolve}}">Resolve</paper-button> or
				<paper-button raised role="button" tabindex="-1" on-tap="{{reject}}">Reject</paper-button> the
				app initialization process.

				<p>
					<em>
						Alternatively press <kbd>F12</kbd> to open Javascript console and enter
						<code>document.querySelector('ampere-splash').resolve()</code> or
						<code>document.querySelector('ampere-splash').reject()</code> to change final state of the app.
					</em>
				</p>
			</section>
		</template>
		<script>
			var host;
			var	app = window.Ampere.default.app(bootstrap(), function(app) {
				var delay =	function(message) {
					return new Promise(function(resolve) {
						app.promise.message = message;
						setTimeout(resolve, 1000);
					})
				};

				return delay("Module in 4 seconds ready")
				.then(function(){ return delay("Module in 3 seconds ready");})
				.then(function(){ return delay("Module in 2 seconds ready");})
				.then(function(){ return delay("Module in 1 seconds ready");})
				.then(function(){
						// cleanup message to see the fallback for rejections
						// which is the reject argument's (type exception) message property
					delete app.promise.message;

						// convert template content to html in inject it into the splash template
					var e = document.createElement('div');
					e.appendChild(document.querySelector('#final-splash').content.cloneNode(true));
					host.injectBoundHTML(
						e.innerHTML,
						host.shadowRoot.querySelector("#splash .progress-message")
					);

					return new Promise(function(resolve, reject) {
						host.resolve=function() {
							resolve();
						};
						host.reject=function() {
							reject(new Error('You have aborted application initialization. Please reload the application.'));
						};
					});
				});
			});
			document.addEventListener('polymer-ready',function() {
				(host=document.querySelector('ampere-splash')).app = app;
			});
		</script>
	`
};
