# HelpDrawer

simple content menu for UQ Library applications using ReactJs

## HelpDrawer Props

All these props are passed in from HelpDrawer's `reducer.js` file:

- `title: PropTypes.string.isRequired`
- `text: PropTypes.any.isRequired`
- `open: PropTypes.bool.isRequired`
- `buttonLabel: PropTypes.string`

## HelpIcon Props

- `text: PropTypes.any.isRequired`
- `title: PropTypes.string`
- `buttonLabel: PropTypes.string`
- `tooltip: PropTypes.string`
- `tooltipIconColor: PropTypes.string` - a HEX colour value
- `onClick: PropTypes.func`
- `inline: PropTypes.bool`
- `style: PropTypes.object`

## Usage

### ./App.js

```jsx
import React from 'react';
...

import {HelpDrawer, HelpIcon} from 'modules/SharedComponents/Toolbox/HelpDrawer';

// Data configuration
const text = 'Where ever additional cues or explanation are required to clarify a process or procedure. Can be used as a card cue (inline inside of <CardHeader> to offer the icon in the top right of the card, or inline in text or form elements. Additionally, by adding 2 parameters (helpTitle and helpText) to a <Field> element, an integrated help icon can be produced. More info on this implementation in forms.'

const App = () => (
  <div>
    <HelpIcon
        title="Contextual help drawer"
        text={text}
        buttonLabel="Got it!"
        tooltip="Click for further information"
        tooltipIconColor="#123211"
        inline />
    <HelpDrawer />
  </div>
);

ReactDOM.render(
  <App />,
  document.getElementById('app')
);
```

### ./reducer.js

```jsx
import { reducer as formReducer } from 'redux-form/immutable';
import { combineReducers } from 'redux-immutable';

// Reducers
import { helpDrawerReducer } from 'modules/SharedComponents/Toolbox/HelpDrawer';

const rootReducer = combineReducers({
    form: formReducer,
    // New
    ...
    helpDrawer: helpDrawerReducer
});

export default rootReducer;

```
