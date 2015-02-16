# slides

* "customers love to tell you their workflow"

* "Humanfirst"

# source

* actions links/rechts ausrichten The buttons should have either the affirmative or dismissive attribute. See the Material Design spec for more info.

* create variables.less

* add <ampere-app> derivate <ampere-wizard> (same js)

* styling views based on APP-AMPERE.state-[name].view-[name]

* examples !!!

* docs: https://github.com/naseer/mermaid-webapp, https://github.com/knsv/mermaid for diagrams

* http://blog.garstasio.com/you-dont-need-jquery/

* https://www.cookiechoices.org/#tools

# documentation

## ui

* View
** attached(<ampere-view>, templateInstance)
** detached(<ampere-view>, templateInstance)
** on-* eventhandler mapped to view methods (how to access paramaters via templateInstance) what is "this" and arguments
** access view properties directly

* app.ui(...)
** flash : details to options and dont forget actions[function ok() {}] vs actions[function () {}[UI.CAPTION="OK"]]
				"dismiss" option actions || error keep it open
** flash : with and without options.error
** block, block(boolean), unblock
** progress(...)
