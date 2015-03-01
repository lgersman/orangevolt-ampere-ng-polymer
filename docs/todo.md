# source

* caption() filter : name als fallback

* transition.active oder besser über "class" option an der transition abbilden ?

* transition appearance (link, paper-item, etc) controlled by attribute 'as'

* transition progress

* create variables.less

* add <ampere-app> derivate <ampere-wizard> (same js)

* styling views based on APP-AMPERE.state-[name].view-[name]

* examples !!!

* docs: https://github.com/naseer/mermaid-webapp, https://github.com/knsv/mermaid for diagrams

* http://blog.garstasio.com/you-dont-need-jquery/

* https://www.cookiechoices.org/#tools

* es6 : use static for static class members

* compress web components using vulcanize

# slides

* "customers love to tell you their workflow"

* "Humanfirst"

* complex web apps will end in chaos without application pattern like ampere

* define workflow once, use it in different ampere implementations (polymer,react,angular or even blessed)

# documentation

* polymer expressions

* use urlsrc to webcrawl localhost urls to static files : to https://github.com/jakearchibald/trained-to-thrill/blob/master/gulpfile.js

## source code formatting
* https://github.com/leeoniya/preCode.js/blob/master/preCode.js

## ui

* transition
** appearance attribute vs custom template

* View
** attached(<ampere-view>, templateInstance)
** detached(<ampere-view>, templateInstance)
** on-* eventhandler mapped to view methods (how to access paramaters via templateInstance) what is "this" and arguments and fallback will be the view web component
** access view properties directly

** parent views must always share the same state.
** ampere transitions appear in the dialog button bar if their scope option===view.name

* app.ui(...)
** flash : details to options and dont forget actions[function ok() {}] vs actions[function () {}[UI.CAPTION="OK"]]
				"dismiss" option actions || error keep it open
** flash : with and without options.error
** block, block(boolean), unblock
** progress(...)
