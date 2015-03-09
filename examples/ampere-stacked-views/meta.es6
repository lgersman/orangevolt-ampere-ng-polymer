module.exports = {
  tags        : ['view', 'parent', 'stacked', 'dialog', 'modal'],
  caption     : 'Stacked views',
  description : 'Stacked views (aka Dialogs) are actually Views having a parent view of the same state. This example shows you how to use it.',
  templates   : [
    `
    <template id="main">
      <div layout horizontal ccenter ccenter-justified>
        <ampere-transition transition="{{state.transitions['first-dialog']}}" ></ampere-transition>
        <ampere-transition transition="{{state.transitions.confirm}}" ></ampere-transition>
        <ampere-transition transition="{{state.transitions.input}}" ></ampere-transition>
      </div>
    </template>
    `,`
    /*
    <template id="first-dialog">
      first dialog
      <div flex layout vertical center center-justified>
        first dialog
      </div>
    </template>
    `,`
    */
    <template id="second-dialog">
      <div flex layout vertical center center-justified>
        second dialog
      </div>
    </template>
    `,`
    <template id="confirm">
      <div flex layout vertical center center-justified>
        This is just a confirm dialog.
      </div>
    </template>
    `,`
    <template id="input">
      <paper-input-decorator label="Enter 2 words" floatingLabel error="2 words are required!" autoValidate>
        <input type="text" value="{{myvalue}}" is="core-input" pattern="\\w+\\s+\\w+" autofocus required>
      </paper-input-decorator>
    </template>
    `
  ]
};
