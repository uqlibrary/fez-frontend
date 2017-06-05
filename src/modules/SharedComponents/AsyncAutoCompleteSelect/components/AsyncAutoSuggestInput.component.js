import React from 'react';
import TextField from 'material-ui/TextField';

export default inputProps => (
    <div>
        <TextField id={'async-auto-suggest-input'}
                   autoFocus
                   floatingLabelFixed
                   floatingLabelText="Start typing to filter"
                   style={{marginTop: 0}}
                   fullWidth
                   {...inputProps} />
    </div>
);
