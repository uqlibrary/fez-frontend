# Reducers

- always returns a new object
- should not have side effects (no api calls, no calls which trigger dispatches of other reducers)

## Action types

- all action types are defined in src/actions/actionTypes.js

## Testing

Template for reducers unit tests:

```javascript
import * as actions from 'actions/actionTypes';
import [REDUCER NAME]Reducer from './[REDUCER NAME]';
import { initialState } from './[REDUCER NAME]';

describe('[REDUCER NAME] ', () => {

    it('should set values [REDUCER]', () => {

        const test = [REDUCER NAME]Reducer(
          initialState,
          {
            type: actions.[ACTION_TYPE],
            payload: {[NEW STATE]}
          }
        );

        expect(test).toEqual([NEW STATE]);
    });

});

```
