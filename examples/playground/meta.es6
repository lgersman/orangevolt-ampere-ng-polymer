module.exports = {
	caption 		: "Playground",
	description : `Aber sowas von`,
	templates : [
		`
		<template id="mystate_view">
			<div>hello from default view {{view.name}} !</div>
		</template>
		`,`
		<template id="mystate_view1">
			<div>hello from custom view {{view.name}} !</div>
		</template>
		`
	]
};
