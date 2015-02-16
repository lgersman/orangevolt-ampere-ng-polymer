module.exports = {
	description					: `How to customize the splash template`,
	element							: `
		<ampere-splash fit>
			<template id="splash">
				<div
					style="display: flex; height:100%; justify-content: center;align-items: center"
				>Loading module "{{app.view.state.module | caption}}" : {{app.view.state.module.promise.message}} ...</div>
			</template>
		</ampere-splash>
	`
};
