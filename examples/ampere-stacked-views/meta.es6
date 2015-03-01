module.exports = {
	tags								: ['view', 'parent', 'stacked', 'dialog', 'modal'],
	caption							: 'Stacked views',
	description					: 'Stacked views (aka Dialogs) are actually Views having a parent view of the same state. This example shows you how to use it.',
	templates 					: [
		`
		<template id="main1">
			haha {{name}}
			<div flex layout vertical center center-justified>
				<span>haha {{name}}</span>

				<ampere-transition transition="{{state.transitions['first-dialog']}}" ></ampere-transition>
			</div>
		</template>
		`,`
		<template id="first-dialog">
			first dialog
			<div flex layout vertical center center-justified>
				first dialog
			</div>
		</template>
		`,`
		<template id="second-dialog">
		  second dialog
			<div flex layout vertical center center-justified>
				second dialog
			</div>
		</template>
		`
	]
};
