module.exports = {
	tags								: ['history', 'undo', 'redo'],
	caption							: 'History Undo Redo demo',
	description					: `Show how to Undo / Redo and Reset the history`,
	templates 					: [
		`
		<template id="view">
			<div layout vertical flex center center-justified>
				value = {{state.value}}
			</div>
		</template>
		`
	]
};
