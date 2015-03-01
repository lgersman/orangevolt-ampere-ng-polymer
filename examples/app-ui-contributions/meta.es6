module.exports = {
	tags 								: ['flash', 'ui', 'progress', 'block', 'unblock'],
	caption 						: "app.ui contributions",
	description 				: `Demo of available functions contributed to app.ui(...)`,
	templates 					: [
		`
		<template id="view">
			<template id="action_progress_disable">
				<section>
					<paper-button raised on-tap="{{onAction}}"">
						module.app.ui('progress');
					</paper-button>
				</section>
			</template>

			<template id="action_progress_boolean">
				<section>
					<core-label horizontal layout>
						<paper-checkbox for on-change="{{onAction}}" checked="{{params.booleanValue}}"></paper-checkbox>
						Indeterministic
					</core-label>
				</section>

				<section>
					<paper-button raised on-tap="{{onAction}}">
						module.app.ui('progress', {{!!params.booleanValue}});
					</paper-button>
				</section>
			</template>

			<template id="action_progress_number">
				<section>
					<paper-input-decorator on-input="{{onAction}}" label="Progress value (0-100) %" floatingLabel error="Input must be a number between 0-100" autovalidate>
						<input is="core-input" autofocus value="{{params.numberValue}}" min="0" max="100" type="number" required>
					</paper-input-decorator>
				</section>
				<section>
					<paper-button raised on-tap="{{onAction}}" disabled?="{{!params.isNumberValueValid}}">
						module.app.ui('progress', {{params.numberValue || 'NaN'}});
					</paper-button>
				</section>
			</template>

			<template id="action_progress_text">
				<section>
					<paper-input-decorator on-input="{{onAction}}" floatingLabel label="Enter progress description">
						<input is="core-input" autofocus value="{{params.description}}" type="text">
					</paper-input-decorator>
				</section>
				<section>
					<paper-button raised on-tap="{{onAction}}">
						module.app.ui('progress', {{params.description | stringify}});
					</paper-button>
				</section>
				<section>
					*Hover the progress indicator to see the progress text.
				</section>
			</template>

			<template id="action_progress_options">
				<section>
					<paper-input-decorator on-input="{{onAction}}" label="Progress value (0-100) %" floatingLabel error="Input must be a number between 0-100" autovalidate>
						<input is="core-input" autofocus value="{{params.numberValue}}" min="0" max="100" type="number" required>
					</paper-input-decorator>

					<paper-input-decorator on-input="{{onAction}}" label="Secondary progress value (0-100) %" floatingLabel error="Input must be a number between 0-100" autovalidate>
						<input is="core-input" autofocus value="{{params.secondaryProgress}}" min="0" max="100" type="number" required>
					</paper-input-decorator>

					<paper-input-decorator on-input="{{onAction}}" floatingLabel label="Enter progress description">
						<input is="core-input" autofocus value="{{params.description}}" type="text">
					</paper-input-decorator>
				</section>
				<section>
					<paper-button raised on-tap="{{onAction}}" disabled?="{{!params.isNumberValueValid || !params.isSecondaryProgressValid}}">
						module.app.ui('progress', {{params.numberValue || 'NaN'}}, {{params.secondaryProgress || 'NaN'}}, {{params.description | stringify}});
					</paper-button>
				</section>
			</template>

			<template id="action_block_summary">
				<section>
					<em>For demoing purposes the blocking functions bellow will show up a flash notice to unblock the application again.</em>
				</section>
			</template>

			<template id="action_block">
				<template bind ref="action_block_summary"></template>

				<section>
					<paper-button raised on-tap="{{onAction}}">
						module.app.ui('block');
					</paper-button>
				</section>
			</template>

			<template id="action_block_boolean">
				<template bind ref="action_block_summary"></template>

				<section>
					<core-label horizontal layout>
						<paper-checkbox for checked="{{params.blockValue}}"></paper-checkbox>
						Block User interface
					</core-label>
				</section>

				<marked-element text="_(You need to press the button below to see something happen)_"></marked-element>

				<section>
					<paper-button raised on-tap="{{onAction}}">
						module.app.ui('block', {{!!params.blockValue}});
					</paper-button>
				</section>
			</template>

			<template id="action_unblock">
				<marked-element>
_You will never see something happen here because you can only execute the action when the application is **not blocked** ..._
				</marked-element>

				<section>
					<paper-button raised on-tap="{{onAction}}">
						module.app.ui('unblock');
					</paper-button>
				</section>
			</template>

			<template id="action_flash_text">
				<section>
					<paper-input-decorator on-input="{{onAction}}" floatingLabel label="Enter flash text" error="Text cannot be empty." autovalidate>
						<input is="core-input" autofocus value="{{params.flashText}}" type="text" required>
					</paper-input-decorator>
				</section>
				<section>
					<paper-button raised on-tap="{{onAction}}" disabled?="{{!params.flashText}}">
						module.app.ui('flash', {{params.flashText | stringify}});
					</paper-button>
				</section>
			</template>

			<template id="action_flash">
				<section>
					<paper-button raised on-tap="{{onAction}}">
						module.app.ui('flash');
					</paper-button>
				</section>
			</template>

			<template id="action_flash_options">
				<section>
					<paper-input-decorator on-input="{{onAction}}" floatingLabel label="Enter flash text" error="Text cannot be empty." autovalidate>
						<input is="core-input" autofocus value="{{params.flashText}}" type="text" required>
					</paper-input-decorator>
				</section>
				<section>
					<paper-button raised on-tap="{{onAction}}" disabled?="{{!params.flashText}}">
						module.app.ui('flash', {{params.flashText | stringify}}, {dismiss:false, actions : [function accept() {...}, function cancel() {...}]});
					</paper-button>
				</section>
			</template>

			<template id="action_flash_error">
				<section>
					<paper-input-decorator on-input="{{onAction}}" floatingLabel label="Enter flash text" error="Text cannot be empty." autovalidate>
						<input is="core-input" autofocus value="{{params.flashText}}" type="text" required>
					</paper-input-decorator>
					<paper-input-decorator on-input="{{onAction}}" floatingLabel label="Enter error text" error="Error cannot be empty." autovalidate>
						<input is="core-input" autofocus value="{{params.errorText}}" type="text" required>
					</paper-input-decorator>
				</section>
				<section>
					<paper-button raised on-tap="{{onAction}}" disabled?="{{!params.flashText || !params.errorText}}">
						module.app.ui('flash', {{params.flashText | stringify}}, {dismiss:false, error : new Error({{params.errorText | stringify}}), actions : [function retry() {...}, function cancel() {...}]});
					</paper-button>
				</section>
				<section>
					*<em>The demo automatically blocks the user interface using <code>module.app.ui('block')</code> when displaying an error for demonstation purposes</em>
				</section>
			</template>

			<!--
			<p center-center horizontal layout>
				<em>Open the Browser console to see some informative output.</em>
			</p>
			-->

			<core-menu selected="0">
				<template repeat="{{group in actions | keys}}">
					<core-submenu label="{{group}}">
						<template repeat="{{item in actions[group]}}">
							<core-item>
								<div flex on-tap="{{item.action}}">
									<div class="caption">
										<div>{{item.caption}}</div>
										<code>{{item.syntax}}</code>
									</div>
									<div class="details">
										<template bind ref="{{item.template}}"></template>
									</div>
								</div>
							</core-item>
						</template>
					</core-submenu>
				</template>
			<core-menu>
		</template>
		`
	]
};
